/**
 * Test Login Script
 * Tests that sample accounts can login successfully
 * Run: node backend/src/scripts/test-login.js
 */
import bcrypt from 'bcrypt';
import { initializeDatabase, getPool, closeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const testAccounts = [
  { username: 'admin', password: 'admin123' },
  { username: 'pharmacist1', password: 'pharma123' },
  { username: 'viewer', password: 'view123' }
];

async function testLogin() {
  console.log('\n🔐 Testing Login for Sample Accounts...\n');
  
  let allPassed = true;
  
  try {
    // Initialize database connection
    await initializeDatabase();
    const pool = getPool();
    
    for (const account of testAccounts) {
      try {
        // Fetch user from database
        const [users] = await pool.query(
          'SELECT * FROM users WHERE username = ?',
          [account.username]
        );
        
        if (users.length === 0) {
          console.log(`❌ ${account.username}: NOT FOUND in database`);
          allPassed = false;
          continue;
        }
        
        const user = users[0];
        
        // Test password
        const isValid = await bcrypt.compare(account.password, user.password_hash);
        
        if (isValid) {
          console.log(`✅ ${account.username}: Login SUCCESS`);
          console.log(`   - Email: ${user.email}`);
          console.log(`   - Role: ${user.role}`);
        } else {
          console.log(`❌ ${account.username}: Password MISMATCH`);
          console.log(`   - Expected password: ${account.password}`);
          console.log(`   - Hash in DB: ${user.password_hash}`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${account.username}: ERROR - ${error.message}`);
        allPassed = false;
      }
      console.log('');
    }
    
    if (allPassed) {
      console.log('🎉 All login tests PASSED!\n');
    } else {
      console.log('⚠️  Some login tests FAILED. Run seed script: npm run seed\n');
    }
  } catch (error) {
    console.error('💥 Database connection error:', error.message);
    allPassed = false;
  } finally {
    await closeDatabase();
  }
  
  process.exit(allPassed ? 0 : 1);
}

testLogin().catch(error => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
