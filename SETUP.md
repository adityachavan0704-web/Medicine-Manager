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
   - **Admin**: `admin` / `admin123`
   - **Pharmacist**: `pharmacist1` / `pharma123`
   - **Viewer**: `viewer` / `view123`

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
