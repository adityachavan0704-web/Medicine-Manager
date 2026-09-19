# SmartMedGuard - Intelligent Medicine Expiry, Stock & Safety Management System

A full-stack web application demonstrating practical implementations of core data structures (MinHeap, HashMap, Queue, LinkedList) while solving real-world medicine inventory management problems.

## 📋 Project Overview

SmartMedGuard is a Data Structures & Algorithms college project that provides intelligent medicine management using:
- **Min-Heap** for expiry prioritization and FEFO recommendations
- **Hash Table** for O(1) medicine lookups
- **Queue** for FIFO alert management  
- **Linked List** for chronological history tracking

## ✨ Key Features

- 🏥 Medicine inventory management with comprehensive details
- ⏰ Auto-calculated medicine status (Safe/Expiring Soon/Critical/Expired)
- 📊 FEFO (First Expire First Out) recommendations
- 🔔 Smart multi-tier alerts (30-day, 7-day, 1-day warnings + low stock)
- 📈 Real-time dashboard with analytics and charts
- 🔍 Fast O(1) medicine search using HashMap
- 📜 Activity history tracking with Linked List
- 🎨 Premium healthcare SaaS UI with medical green theme
- 🌙 Dark mode support
- 📱 Fully responsive (mobile/tablet/desktop)
- 🎓 Data structure visualization page for CP demonstration

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Router (routing)
- Recharts (analytics charts)
- Lucide React (icons)
- Axios (HTTP client)

### Backend
- Node.js with Express
- MySQL 8.0+ (database)
- JWT (authentication)
- Bcrypt (password hashing)
- Custom data structure implementations

## 📊 Data Structures Used

### 1. MinHeap - Expiry Priority Queue
- **Purpose**: Maintains medicines sorted by expiry date
- **Operations**: 
  - Insert: O(log n)
  - Extract Min: O(log n)
  - Peek Min: O(1)
- **Use Cases**: FEFO recommendations, critical expiry identification

### 2. HashMap - Fast Medicine Search
- **Purpose**: Provides O(1) average-case lookups
- **Operations**:
  - Insert: O(1) avg
  - Search: O(1) avg
  - Delete: O(1) avg
- **Use Cases**: Medicine lookups by ID, batch number, category

### 3. AlertQueue - Notification Management
- **Purpose**: Manages alerts in FIFO order
- **Operations**:
  - Enqueue: O(1)
  - Dequeue: O(1)
- **Use Cases**: Multi-tier alert system (30/7/1 day warnings)

### 4. HistoryLinkedList - Activity Tracking
- **Purpose**: Maintains chronological history
- **Operations**:
  - Insert Front/Back: O(1)
  - Search: O(n)
- **Use Cases**: Medicine operation history, audit trail

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📂 Project Structure

```
smartmedguard/
├── backend/
│   ├── src/
│   │   ├── data-structures/     # Custom DS implementations
│   │   │   ├── MinHeap.js
│   │   │   ├── HashMap.js
│   │   │   ├── AlertQueue.js
│   │   │   └── HistoryLinkedList.js
│   │   ├── controllers/         # API controllers
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Auth, validation
│   │   ├── models/              # Data models
│   │   ├── utils/               # Helper functions
│   │   └── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom hooks
│   │   └── App.jsx              # Main app
│   └── package.json
├── database/
│   └── schema.sql               # Database schema
└── README.md
```

## 🎯 API Endpoints

### Medicine Endpoints
- `GET /api/medicines` - Get all medicines with stats
- `GET /api/medicines/:id` - Get medicine details
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/expiring` - Get FEFO recommendations
- `POST /api/medicines/:id/dispense` - Dispense medicine

### Alert Endpoints
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unread` - Get unread alerts
- `PUT /api/alerts/:id/read` - Mark as read
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/trends` - Trend data

### Data Structure Visualization
- `GET /api/ds/minheap` - MinHeap visualization
- `GET /api/ds/hashmap` - HashMap visualization
- `GET /api/ds/queue` - Queue visualization
- `GET /api/ds/linkedlist` - LinkedList visualization

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run with coverage
npm test -- --coverage
```

## 🎨 UI Features

- **Dashboard**: Real-time statistics, charts, FEFO recommendations
- **Inventory**: Sortable table, search, filters, CRUD operations
- **Alerts**: Tabbed view, severity-based filtering, acknowledgments
- **Analytics**: Category breakdown, expiry trends, stock trends
- **DS Visualization**: Interactive diagrams with complexity annotations

## 🔒 Security Features

- JWT-based authentication with 24-hour expiration
- Bcrypt password hashing (10 rounds)
- Role-based access control (Admin/Pharmacist/Viewer)
- SQL injection prevention
- Rate limiting (100 requests/minute)
- HTTPS enforcement in production
- CORS whitelisting

## 📈 Performance Targets

- Medicine lookup by ID: O(1) via HashMap
- FEFO recommendations: O(n log n) via MinHeap
- Dashboard load time: < 2 seconds
- API response 95th percentile: < 1 second
- Supports 10,000+ medicines

## 👥 User Roles

1. **Admin**: Full CRUD access, user management
2. **Pharmacist**: Add, update, dispense medicines (no delete)
3. **Viewer**: Read-only access

## 📱 Responsive Design

- Mobile: < 640px (stacked single-column layout)
- Tablet: 640px - 1024px (2-column layout)
- Desktop: > 1024px (3-column layout)

## 🎓 CP Demonstration Features

- Data structure visualization page with interactive diagrams
- Complexity annotations for all operations
- Performance metrics logging
- Sample data for realistic demonstrations
- Step-by-step operation visualization

## 🐛 Known Issues

None currently. Please report issues via GitHub.

## 📝 License

MIT License - feel free to use for educational purposes.

## 👨‍💻 Author

College Project - Data Structures & Algorithms

## 🙏 Acknowledgments

- Built as a demonstration of practical DS implementations
- Solves real-world healthcare inventory management problems
- Designed for competitive programming (CP) presentations
