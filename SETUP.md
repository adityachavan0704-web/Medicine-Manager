# SmartMedGuard - Complete Setup Guide

## 🚀 Quick Start Guide

Follow these steps to get SmartMedGuard running on your machine.

### Prerequisites

Before you begin, make sure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** or **yarn** (comes with Node.js)

### Step 1: Clone or Extract the Project

```bash
cd "D:\DS CP"
```

### Step 2: Database Setup

1. **Start MySQL Server**
   - Make sure your MySQL server is running
   - Default port: 3306

2. **Create Database**
   ```sql
   CREATE DATABASE smartmedguard;
   ```

3. **Run Schema**
   ```bash
   mysql -u root -p smartmedguard < database/schema.sql
   ```

   Or import via MySQL Workbench:
   - Open MySQL Workbench
   - Connect to your server
   - File → Run SQL Script
   - Select `database/schema.sql`

### Step 3: Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`** - Edit `backend/.env`:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=smartmedguard

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Secret (change this to a random string)
   JWT_SECRET=your_super_secret_jwt_key_here_change_this

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

   This will create:
   - **4 sample user accounts** (admin, pharmacist1, pharmacist2, viewer)
   - **80 sample medicines** with varied expiry statuses
   - **Automated alerts** based on expiry dates
   - **50 history entries** showing medicine operations

   **Alternative: Manual Account Creation**
   
   If the seed script fails or you want to manually create just the sample users:
   
   ```bash
   mysql -u root -p smartmedguard < src/scripts/create-sample-users.sql
   ```
   
   Or use the password hash generator:
   ```bash
   node src/scripts/generate-password-hashes.js
   ```

6. **Start backend server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 SmartMedGuard Backend Server running on port 5000
   📊 Data Structures Loaded:
      - MinHeap: 80 medicines
      - HashMap: 80 medicines
      - AlertQueue: X alerts
      - HistoryLinkedList: 50 entries
   ✨ Server ready to accept connections!
   ```

### Step 4: Frontend Setup

1. **Open a NEW terminal** and navigate to frontend
   ```bash
   cd "D:\DS CP\frontend"
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`** (optional) - Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start frontend development server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v4.x.x  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

### Step 5: Access the Application

1. **Open your browser** and go to: **http://localhost:5173**

2. **Login with demo credentials:**

   | Role | Username | Password | Email | Permissions |
   |------|----------|----------|-------|-------------|
   | **Admin** | `admin` | `admin123` | admin@smartmedguard.com | Full access - Create, Read, Update, Delete |
   | **Pharmacist** | `pharmacist1` | `pharma123` | pharmacist1@smartmedguard.com | Create, Read, Update medicines |
   | **Viewer** | `viewer` | `view123` | viewer@smartmedguard.com | Read-only access |

   **Note:** You can enter either the username OR email address in the login form.

---

## 🔐 Sample Account Details

The seed script automatically creates these test accounts with properly hashed passwords (bcrypt, 10 salt rounds):

### Admin Account
- **Username:** admin
- **Email:** admin@smartmedguard.com  
- **Password:** admin123
- **Role:** admin
- **Capabilities:** Full CRUD on all resources, user management, system configuration

### Pharmacist Account
- **Username:** pharmacist1
- **Email:** pharmacist1@smartmedguard.com
- **Password:** pharma123  
- **Role:** pharmacist
- **Capabilities:** Add/edit medicines, dispense stock, view alerts, access analytics

### Viewer Account
- **Username:** viewer
- **Email:** viewer@smartmedguard.com
- **Password:** view123
- **Role:** viewer  
- **Capabilities:** View-only access to all data, no modifications allowed

### Creating Additional Accounts

**Option 1: Use the Seed Script**
```bash
cd backend
npm run seed
```

**Option 2: Manual SQL Script**
```bash
mysql -u root -p smartmedguard < backend/src/scripts/create-sample-users.sql
```

**Option 3: Generate Custom Password Hashes**
```bash
cd backend
node src/scripts/generate-password-hashes.js
```

Then manually insert into database:
```sql
INSERT INTO users (id, username, email, password_hash, role, preferences, created_at)
VALUES (
    UUID(),
    'newuser',
    'newuser@example.com',
    'your_generated_hash_here',
    'pharmacist',
    '{"theme":"light","alertNotifications":true}',
    NOW()
);
```

---

## 🎯 Testing the Data Structures

### 1. Dashboard
- View real-time statistics
- See medicine status breakdown (Safe/Expiring/Critical/Expired)
- Check FEFO recommendations (MinHeap in action!)

### 2. Medicine Inventory
- Add, edit, delete medicines
- Search by name (HashMap O(1) lookup)
- Dispense medicines (updates all data structures)

### 3. Alert Center
- View alerts in FIFO order (Queue)
- Mark as read, acknowledge, delete
- Generate new alerts

### 4. Analytics
- View category breakdowns
- Expiry trends over time
- Stock movement trends

### 5. **DS Visualization** (⭐ Main CP Showcase)
- **MinHeap**: See the tree structure, expiry priority
- **HashMap**: View buckets, collisions, load factor
- **Alert Queue**: FIFO visualization with front/rear pointers
- **LinkedList**: Bidirectional history chain

---

## 🔧 Troubleshooting

### Backend won't start
- **Check MySQL**: Ensure MySQL is running on port 3306
- **Check credentials**: Verify `.env` database credentials
- **Check port**: Make sure port 5000 is not in use

### Frontend won't start
- **Check backend**: Backend must be running on port 5000
- **Check port**: Make sure port 5173 is not in use
- **Clear cache**: Try `npm run dev -- --force`

### Database connection error
```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1"

# If fails, restart MySQL service
# Windows: Services → MySQL → Restart
# Mac: brew services restart mysql
# Linux: sudo systemctl restart mysql
```

### Seed script fails
```bash
# Make sure database exists
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS smartmedguard"

# Re-run schema
mysql -u root -p smartmedguard < database/schema.sql

# Try seed again
npm run seed
```

### Login fails with "Invalid credentials"

**Problem:** Field name mismatch between frontend and backend

**Solution 1: Verify Sample Accounts Exist**
```bash
# Check if users exist in database
mysql -u root -p smartmedguard -e "SELECT username, email, role FROM users"
```

If no users found, run the seed script:
```bash
cd backend
npm run seed
```

Or manually create users:
```bash
mysql -u root -p smartmedguard < backend/src/scripts/create-sample-users.sql
```

**Solution 2: Test Password Hashes**

The seed script uses bcrypt with 10 salt rounds. If login still fails:

1. Generate a new hash:
```bash
cd backend
node src/scripts/generate-password-hashes.js
```

2. Manually update the password in database:
```sql
UPDATE users 
SET password_hash = 'your_new_hash_here' 
WHERE username = 'admin';
```

**Solution 3: Check Network Request**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check the POST request to `/api/auth/login`
5. Verify the request body contains `usernameOrEmail` field (not `username`)

**Common Login Issues:**
- ❌ Using wrong credentials
- ❌ Database not seeded
- ❌ Backend server not running
- ❌ CORS errors (check backend .env CORS_ORIGIN)
- ❌ JWT_SECRET not set in backend .env

---

## 📁 Project Structure

```
DS CP/
├── backend/
│   ├── src/
│   │   ├── data-structures/    # 🔴 Core DS implementations
│   │   │   ├── MinHeap.js
│   │   │   ├── HashMap.js
│   │   │   ├── AlertQueue.js
│   │   │   └── HistoryLinkedList.js
│   │   ├── services/           # Business logic
│   │   ├── controllers/        # API controllers
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, validation
│   │   ├── utils/              # StatusCalculator
│   │   ├── config/             # Database config
│   │   ├── scripts/            # Seed script
│   │   └── server.js           # Entry point
│   ├── .env                    # Configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/              # Main pages
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API services
│   │   └── App.jsx
│   ├── .env                    # Configuration
│   └── package.json
├── database/
│   └── schema.sql              # Database schema
└── README.md
```

---

## 🎨 Features Showcase

### Data Structure Features
1. **MinHeap**: O(log n) insert, O(log n) extract, FEFO recommendations
2. **HashMap**: O(1) search by ID, collision handling, auto-resizing
3. **Queue**: O(1) enqueue/dequeue, FIFO alert processing
4. **LinkedList**: O(1) insert at front/back, bidirectional traversal

### UI Features
- 🎨 Medical green theme with dark mode
- 📱 Fully responsive (mobile, tablet, desktop)
- 📊 Interactive charts (Recharts)
- 🔍 Real-time search and filtering
- 🔐 Role-based access control
- ⚡ Fast performance with optimized data structures

---

## 📝 Demo Script for Presentation

### 1. Login & Dashboard (2 min)
- Show login with admin credentials
- Highlight 4 stat cards
- Explain status breakdown pie chart
- Point out FEFO table (MinHeap)

### 2. Medicine Management (3 min)
- Add a new medicine
- Show search (HashMap in action)
- Dispense medicine (updates all DS)
- Delete a medicine

### 3. Alert System (2 min)
- Show different alert types
- Explain multi-tier system (30/7/1 day)
- Mark as read, acknowledge
- Generate new alerts

### 4. **DS Visualization** (5 min) ⭐ MAIN SHOWCASE
- **MinHeap**: Explain tree structure, parent-child relationship
- **HashMap**: Show buckets, collisions, load factor
- **Queue**: Demonstrate FIFO with front/rear pointers
- **LinkedList**: Show bidirectional links, head/tail

### 5. Code Walkthrough (3 min)
- Open `backend/src/data-structures/MinHeap.js`
- Show heapifyUp, heapifyDown
- Explain complexity annotations
- Show how it integrates with MedicineService

---

## 🎓 For CP Evaluation

### Demonstrated Concepts:
1. ✅ **Binary Heap** - Min-heap for priority queue
2. ✅ **Hash Table** - Collision handling, resizing
3. ✅ **Queue** - FIFO with circular array
4. ✅ **Linked List** - Doubly linked for history
5. ✅ **Time Complexity** - All operations documented
6. ✅ **Real-world Application** - Healthcare inventory
7. ✅ **Full-stack Integration** - React + Node.js + MySQL
8. ✅ **Visualization** - Interactive DS diagrams

---

## 🚀 Next Steps

1. Test all features thoroughly
2. Practice the demo presentation
3. Prepare to explain complexity analysis
4. Be ready to show code implementation
5. Understand how DS integrate with backend services

---

## 💡 Tips

- Keep both terminals open (backend + frontend)
- Use Chrome DevTools to inspect network requests
- Check browser console for any errors
- Use `npm run dev` for development (hot reload)
- Use `npm run build` to create production build

---

## 📞 Need Help?

If something doesn't work:
1. Check both terminals for error messages
2. Verify MySQL is running
3. Check `.env` configuration
4. Try restarting both servers
5. Clear browser cache and restart

**Happy Demonstrating! 🎉**
