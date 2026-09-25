# SmartMedGuard - Intelligent Medicine Expiry, Stock & Safety Management System

A full-stack web application demonstrating practical implementations of core data structures (MinHeap, HashMap, Queue, LinkedList) while solving real-world medicine inventory management problems.

**🎓 Data Structures & Algorithms College Project**

## 📋 Project Overview

SmartMedGuard is a comprehensive medicine management system that showcases:
- **Min-Heap** for expiry prioritization and FEFO recommendations
- **Hash Table** for O(1) medicine lookups
- **Queue** for FIFO alert management  
- **Linked List** for chronological history tracking

Built with modern web technologies and following software engineering best practices.

## ✨ Key Features

- 🏥 **Medicine Inventory Management** - Complete CRUD with comprehensive details
- ⏰ **Auto-calculated Status** - Safe/Expiring Soon/Critical/Expired (based on expiry date)
- 📊 **FEFO Recommendations** - First Expire First Out using MinHeap
- 🔔 **Smart Multi-tier Alerts** - 30-day, 7-day, 1-day warnings + low stock alerts
- 📈 **Real-time Dashboard** - Analytics with interactive charts
- 🔍 **Fast O(1) Search** - Using custom HashMap implementation
- 📜 **Activity History** - Chronological tracking with Linked List
- 🎨 **Premium UI** - Medical green theme with dark mode support
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🎓 **DS Visualization** - Interactive diagrams for all data structures

## 🛠️ Tech Stack

### Frontend
- React 18 (JavaScript)
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
- **Custom data structure implementations** (MinHeap, HashMap, Queue, LinkedList)

### Architecture
- Three-tier pattern (Presentation → Business Logic → Data)
- RESTful API design
- Role-based access control (Admin, Pharmacist, Viewer)

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

## 🚀 Quick Start

**See [SETUP.md](SETUP.md) for detailed setup instructions.**

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Database Setup**
   ```bash
   mysql -u root -p -e "CREATE DATABASE smartmedguard"
   mysql -u root -p smartmedguard < database/schema.sql
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm install
   npm run seed
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Login: `admin` / `admin123`

## 🎯 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Pharmacist | pharmacist1 | pharma123 |
| Viewer | viewer | view123 |

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
