import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../config/database.js';
import StatusCalculator from '../utils/StatusCalculator.js';

dotenv.config();

// Medicine categories
const categories = [
  'Antibiotic',
  'Painkiller',
  'Vitamin',
  'Antacid',
  'Antihistamine',
  'Antiseptic',
  'Cough Syrup',
  'Anti-inflammatory',
  'Cardiovascular',
  'Diabetes',
  'Respiratory',
  'Dermatology'
];

// Medicine names by category
const medicineNames = {
  'Antibiotic': ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Doxycycline', 'Penicillin'],
  'Painkiller': ['Ibuprofen', 'Paracetamol', 'Aspirin', 'Naproxen', 'Diclofenac'],
  'Vitamin': ['Vitamin C', 'Vitamin D3', 'Vitamin B Complex', 'Multivitamin', 'Calcium'],
  'Antacid': ['Omeprazole', 'Ranitidine', 'Pantoprazole', 'Famotidine', 'Esomeprazole'],
  'Antihistamine': ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Diphenhydramine', 'Chlorpheniramine'],
  'Antiseptic': ['Betadine', 'Dettol', 'Hydrogen Peroxide', 'Alcohol Swabs', 'Povidone-Iodine'],
  'Cough Syrup': ['Benadryl', 'Robitussin', 'Mucinex', 'Dextromethorphan', 'Guaifenesin'],
  'Anti-inflammatory': ['Prednisolone', 'Hydrocortisone', 'Indomethacin', 'Meloxicam', 'Celecoxib'],
  'Cardiovascular': ['Atenolol', 'Metoprolol', 'Amlodipine', 'Lisinopril', 'Atorvastatin'],
  'Diabetes': ['Metformin', 'Glimepiride', 'Insulin', 'Sitagliptin', 'Empagliflozin'],
  'Respiratory': ['Salbutamol', 'Montelukast', 'Budesonide', 'Ipratropium', 'Theophylline'],
  'Dermatology': ['Clotrimazole', 'Ketoconazole', 'Mupirocin', 'Tretinoin', 'Benzoyl Peroxide']
};

const manufacturers = [
  'PharmaCorp Ltd',
  'MediLife Industries',
  'HealthCare Pharma',
  'BioMed Solutions',
  'Global Pharmaceuticals',
  'Apex HealthCare',
  'Prime Medicines',
  'United Pharma',
  'Sterling Drugs',
  'Novartis Healthcare'
];

const units = ['tablets', 'capsules', 'bottles', 'boxes', 'strips', 'vials', 'tubes'];

// Generate random date within range
function getRandomDate(startDaysAgo, endDaysAgo) {
  const start = new Date();
  start.setDate(start.getDate() - startDaysAgo);
  const end = new Date();
  end.setDate(end.getDate() - endDaysAgo);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFutureDate(minDays, maxDays) {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Seed users
async function seedUsers() {
  console.log('Seeding users...');
  
  const users = [
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@smartmedguard.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: uuidv4(),
      username: 'pharmacist1',
      email: 'pharmacist1@smartmedguard.com',
      password: 'pharma123',
      role: 'pharmacist'
    },
    {
      id: uuidv4(),
      username: 'pharmacist2',
      email: 'pharmacist2@smartmedguard.com',
      password: 'pharma123',
      role: 'pharmacist'
    },
    {
      id: uuidv4(),
      username: 'viewer',
      email: 'viewer@smartmedguard.com',
      password: 'view123',
      role: 'viewer'
    }
  ];

  // Delete existing users except the default admin
  await db.query("DELETE FROM users WHERE username != 'admin' OR email != 'admin@smartmedguard.com'");

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const preferences = JSON.stringify({ theme: 'light', alertNotifications: true });
    
    await db.query(
      `INSERT INTO users (id, username, email, password_hash, role, preferences) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [user.id, user.username, user.email, passwordHash, user.role, preferences]
    );
  }

  console.log(`✓ Seeded ${users.length} users`);
  return users;
}

// Seed medicines
async function seedMedicines(adminUserId) {
  console.log('Seeding medicines...');
  
  // Clear existing medicines (cascades to alerts and history)
  await db.query('DELETE FROM medicines');
  
  const medicines = [];
  let safeCount = 0, expiringSoonCount = 0, criticalCount = 0, expiredCount = 0;

  // Generate 80 medicines across different statuses
  // Safe: 40 medicines (>30 days)
  for (let i = 0; i < 40; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = medicineNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const manufactureDate = getRandomDate(90, 180);
    const expiryDate = getRandomFutureDate(31, 365);
    const status = StatusCalculator.calculateStatus(expiryDate);
    
    medicines.push({
      id: uuidv4(),
      batchNumber: `BATCH-${Date.now()}-${i}`,
      name,
      category,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      description: `${name} - High quality pharmaceutical product`,
      quantity: Math.floor(Math.random() * 500) + 100,
      unit: units[Math.floor(Math.random() * units.length)],
      price: (Math.random() * 50 + 5).toFixed(2),
      lowStockThreshold: Math.floor(Math.random() * 50) + 10,
      expiryDate: formatDate(expiryDate),
      manufactureDate: formatDate(manufactureDate),
      status,
      createdBy: adminUserId
    });
    safeCount++;
  }

  // Expiring Soon: 25 medicines (8-30 days)
  for (let i = 0; i < 25; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = medicineNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const manufactureDate = getRandomDate(90, 180);
    const expiryDate = getRandomFutureDate(8, 30);
    const status = StatusCalculator.calculateStatus(expiryDate);
    
    medicines.push({
      id: uuidv4(),
      batchNumber: `BATCH-${Date.now()}-${i + 40}`,
      name,
      category,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      description: `${name} - High quality pharmaceutical product`,
      quantity: Math.floor(Math.random() * 300) + 50,
      unit: units[Math.floor(Math.random() * units.length)],
      price: (Math.random() * 50 + 5).toFixed(2),
      lowStockThreshold: Math.floor(Math.random() * 50) + 10,
      expiryDate: formatDate(expiryDate),
      manufactureDate: formatDate(manufactureDate),
      status,
      createdBy: adminUserId
    });
    expiringSoonCount++;
  }

  // Critical: 10 medicines (1-7 days)
  for (let i = 0; i < 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = medicineNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const manufactureDate = getRandomDate(90, 180);
    const expiryDate = getRandomFutureDate(1, 7);
    const status = StatusCalculator.calculateStatus(expiryDate);
    
    medicines.push({
      id: uuidv4(),
      batchNumber: `BATCH-${Date.now()}-${i + 65}`,
      name,
      category,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      description: `${name} - High quality pharmaceutical product`,
      quantity: Math.floor(Math.random() * 200) + 20,
      unit: units[Math.floor(Math.random() * units.length)],
      price: (Math.random() * 50 + 5).toFixed(2),
      lowStockThreshold: Math.floor(Math.random() * 50) + 10,
      expiryDate: formatDate(expiryDate),
      manufactureDate: formatDate(manufactureDate),
      status,
      createdBy: adminUserId
    });
    criticalCount++;
  }

  // Expired: 5 medicines (already expired)
  for (let i = 0; i < 5; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = medicineNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const manufactureDate = getRandomDate(180, 365);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - Math.floor(Math.random() * 30) - 1);
    const status = 'Expired';
    
    medicines.push({
      id: uuidv4(),
      batchNumber: `BATCH-${Date.now()}-${i + 75}`,
      name,
      category,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      description: `${name} - High quality pharmaceutical product`,
      quantity: Math.floor(Math.random() * 100) + 10,
      unit: units[Math.floor(Math.random() * units.length)],
      price: (Math.random() * 50 + 5).toFixed(2),
      lowStockThreshold: Math.floor(Math.random() * 50) + 10,
      expiryDate: formatDate(expiryDate),
      manufactureDate: formatDate(manufactureDate),
      status,
      createdBy: adminUserId
    });
    expiredCount++;
  }

  // Insert medicines
  for (const med of medicines) {
    await db.query(
      `INSERT INTO medicines 
       (id, batch_number, name, category, manufacturer, description, quantity, unit, price, 
        low_stock_threshold, expiry_date, manufacture_date, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        med.id, med.batchNumber, med.name, med.category, med.manufacturer, med.description,
        med.quantity, med.unit, med.price, med.lowStockThreshold, med.expiryDate,
        med.manufactureDate, med.status, med.createdBy
      ]
    );
  }

  console.log(`✓ Seeded ${medicines.length} medicines:`);
  console.log(`  - Safe: ${safeCount}`);
  console.log(`  - Expiring Soon: ${expiringSoonCount}`);
  console.log(`  - Critical: ${criticalCount}`);
  console.log(`  - Expired: ${expiredCount}`);
  
  return medicines;
}

// Seed alerts
async function seedAlerts(medicines) {
  console.log('Seeding alerts...');
  
  const alerts = [];
  
  for (const med of medicines) {
    const daysUntilExpiry = StatusCalculator.getDaysUntilExpiry(new Date(med.expiryDate));
    
    // Generate appropriate alerts based on days until expiry
    if (daysUntilExpiry < 0) {
      // Expired
      alerts.push({
        id: uuidv4(),
        medicineId: med.id,
        type: 'EXPIRED',
        severity: 'critical',
        message: `${med.name} (Batch: ${med.batchNumber}) has EXPIRED`,
        medicineName: med.name,
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate,
        daysUntilExpiry,
        isRead: Math.random() > 0.7
      });
    } else if (daysUntilExpiry <= 1) {
      // 1-day warning
      alerts.push({
        id: uuidv4(),
        medicineId: med.id,
        type: 'EXPIRING_1',
        severity: 'critical',
        message: `URGENT: ${med.name} (Batch: ${med.batchNumber}) expires in ${daysUntilExpiry} day(s)`,
        medicineName: med.name,
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate,
        daysUntilExpiry,
        isRead: Math.random() > 0.5
      });
    } else if (daysUntilExpiry <= 7) {
      // 7-day warning
      alerts.push({
        id: uuidv4(),
        medicineId: med.id,
        type: 'EXPIRING_7',
        severity: 'warning',
        message: `${med.name} (Batch: ${med.batchNumber}) expires in ${daysUntilExpiry} days`,
        medicineName: med.name,
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate,
        daysUntilExpiry,
        isRead: Math.random() > 0.3
      });
    } else if (daysUntilExpiry <= 30) {
      // 30-day warning
      alerts.push({
        id: uuidv4(),
        medicineId: med.id,
        type: 'EXPIRING_30',
        severity: 'info',
        message: `${med.name} (Batch: ${med.batchNumber}) expires in ${daysUntilExpiry} days`,
        medicineName: med.name,
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate,
        daysUntilExpiry,
        isRead: Math.random() > 0.2
      });
    }
    
    // Low stock alerts (random 20% of medicines)
    if (med.quantity <= med.lowStockThreshold && Math.random() > 0.8) {
      alerts.push({
        id: uuidv4(),
        medicineId: med.id,
        type: 'LOW_STOCK',
        severity: 'warning',
        message: `Low stock alert: ${med.name} has only ${med.quantity} ${med.unit} remaining`,
        medicineName: med.name,
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate,
        daysUntilExpiry: null,
        isRead: Math.random() > 0.6
      });
    }
  }

  // Insert alerts
  for (const alert of alerts) {
    await db.query(
      `INSERT INTO alerts 
       (id, medicine_id, type, severity, message, medicine_name, batch_number, 
        expiry_date, days_until_expiry, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alert.id, alert.medicineId, alert.type, alert.severity, alert.message,
        alert.medicineName, alert.batchNumber, alert.expiryDate, alert.daysUntilExpiry,
        alert.isRead
      ]
    );
  }

  console.log(`✓ Seeded ${alerts.length} alerts`);
  return alerts;
}

// Seed history
async function seedHistory(medicines, users) {
  console.log('Seeding history...');
  
  const histories = [];
  const actions = ['ADD', 'UPDATE', 'DISPENSE'];
  
  // Generate 50 history entries
  for (let i = 0; i < 50; i++) {
    const med = medicines[Math.floor(Math.random() * medicines.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    let details = '';
    let quantityBefore = null;
    let quantityAfter = null;
    
    if (action === 'ADD') {
      details = `Added ${med.name} (Batch: ${med.batchNumber}) to inventory`;
    } else if (action === 'UPDATE') {
      details = `Updated ${med.name} (Batch: ${med.batchNumber}) information`;
      quantityBefore = med.quantity + Math.floor(Math.random() * 50);
      quantityAfter = med.quantity;
    } else if (action === 'DISPENSE') {
      const dispensed = Math.floor(Math.random() * 50) + 10;
      details = `Dispensed ${dispensed} ${med.unit} of ${med.name} (Batch: ${med.batchNumber})`;
      quantityBefore = med.quantity + dispensed;
      quantityAfter = med.quantity;
    }
    
    const timestamp = getRandomDate(1, 30);
    
    histories.push({
      id: uuidv4(),
      medicineId: med.id,
      userId: user.id,
      action,
      details,
      medicineName: med.name,
      batchNumber: med.batchNumber,
      quantityBefore,
      quantityAfter,
      timestamp: timestamp.toISOString().slice(0, 19).replace('T', ' ')
    });
  }

  // Insert histories
  for (const hist of histories) {
    await db.query(
      `INSERT INTO history 
       (id, medicine_id, user_id, action, details, medicine_name, batch_number, 
        quantity_before, quantity_after, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hist.id, hist.medicineId, hist.userId, hist.action, hist.details,
        hist.medicineName, hist.batchNumber, hist.quantityBefore, hist.quantityAfter,
        hist.timestamp
      ]
    );
  }

  console.log(`✓ Seeded ${histories.length} history entries`);
  return histories;
}

// Main seed function
async function seed() {
  console.log('\n🌱 Starting database seeding...\n');
  
  try {
    const users = await seedUsers();
    const adminUser = users.find(u => u.role === 'admin');
    
    const medicines = await seedMedicines(adminUser.id);
    await seedAlerts(medicines);
    await seedHistory(medicines, users);
    
    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Medicines: ${medicines.length}`);
    console.log(`   - Alerts: Auto-generated based on expiry dates`);
    console.log(`   - History: 50 sample entries`);
    console.log('\n🎉 Ready to start the server!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
