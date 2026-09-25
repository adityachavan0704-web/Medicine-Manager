# SmartMedGuard - Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Issue 1: Backend won't start

#### Symptom
```
Error: connect ECONNREFUSED 127.0.0.1:3306
or
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

#### Solution
1. **Check MySQL is running**:
   ```bash
   # Windows
   services.msc → Find MySQL → Start

   # Check if MySQL is listening
   netstat -an | findstr 3306
   ```

2. **Verify database credentials in `.env`**:
   ```env
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=smartmedguard
   ```

3. **Test MySQL connection**:
   ```bash
   mysql -u root -p
   # Enter your password
   # If successful, you'll see MySQL prompt
   ```

4. **Recreate database if needed**:
   ```bash
   mysql -u root -p -e "DROP DATABASE IF EXISTS smartmedguard"
   mysql -u root -p -e "CREATE DATABASE smartmedguard"
   mysql -u root -p smartmedguard < database/schema.sql
   ```

---

### Issue 2: "Port 5000 already in use"

#### Symptom
```
Error: listen EADDRINUSE: address already in use :::5000
```

#### Solution
1. **Kill process using port 5000**:
   ```powershell
   # Windows PowerShell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
   ```

2. **Or change port in backend/.env**:
   ```env
   PORT=5001
   ```
   Then update frontend/.env:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

---

### Issue 3: Frontend can't connect to backend

#### Symptom
- Login fails with network error
- Console shows CORS errors
- API requests timeout

#### Solution
1. **Verify backend is running**:
   - Open http://localhost:5000/health
   - Should see: `{"status":"ok",...}`

2. **Check CORS settings in backend/.env**:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Verify frontend API URL**:
   - Check `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete → Clear cache
   - Or use incognito mode

---

### Issue 4: Seed script fails

#### Symptom
```
Error: ER_NO_SUCH_TABLE: Table 'smartmedguard.medicines' doesn't exist
```

#### Solution
1. **Run schema first**:
   ```bash
   mysql -u root -p smartmedguard < database/schema.sql
   ```

2. **Then run seed**:
   ```bash
   cd backend
   npm run seed
   ```

3. **If still fails, recreate from scratch**:
   ```bash
   mysql -u root -p -e "DROP DATABASE smartmedguard"
   mysql -u root -p -e "CREATE DATABASE smartmedguard"
   mysql -u root -p smartmedguard < database/schema.sql
   cd backend
   npm run seed
   ```

---

### Issue 5: "Module not found" errors

#### Symptom
```
Error: Cannot find module 'express'
or
Error: Cannot find module 'react'
```

#### Solution
1. **Reinstall dependencies**:
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Issue 6: Login fails with "Invalid credentials"

#### Solution
1. **Make sure database is seeded**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Use correct credentials**:
   - Username: `admin`
   - Password: `admin123`
   - (Case sensitive!)

3. **Check if user exists in database**:
   ```bash
   mysql -u root -p smartmedguard -e "SELECT username, role FROM users"
   ```

---

### Issue 7: Frontend shows blank page

#### Solution
1. **Check browser console** (F12):
   - Look for JavaScript errors

2. **Verify all files are present**:
   ```bash
   cd frontend
   ls src/pages/
   # Should see: Login.jsx, Register.jsx, Dashboard.jsx, etc.
   ```

3. **Restart frontend server**:
   ```bash
   cd frontend
   # Ctrl+C to stop
   npm run dev
   ```

4. **Clear Vite cache**:
   ```bash
   cd frontend
   npm run dev -- --force
   ```

---

### Issue 8: "Cannot read property 'map' of undefined"

#### Symptom
- Frontend crashes with React errors
- Console shows "Cannot read property 'map' of undefined"

#### Solution
This usually means API returned unexpected data.

1. **Check backend is responding**:
   ```bash
   curl http://localhost:5000/api/medicines
   ```

2. **Check browser Network tab** (F12 → Network):
   - See if API calls are successful (200 status)
   - Check response data format

3. **Verify services are initialized**:
   - Backend should log: "MedicineService initialized"

---

### Issue 9: Charts not showing

#### Symptom
- Dashboard/Analytics pages load but no charts visible

#### Solution
1. **Check if data is loading**:
   - Open browser console
   - Look for API responses

2. **Verify Recharts is installed**:
   ```bash
   cd frontend
   npm list recharts
   ```

3. **If not installed**:
   ```bash
   npm install recharts
   ```

---

### Issue 10: Dark mode not working

#### Solution
1. **Check localStorage**:
   - Browser console: `localStorage.getItem('theme')`
   - Should return 'light' or 'dark'

2. **Clear localStorage and try again**:
   - Browser console: `localStorage.clear()`
   - Refresh page
   - Click theme toggle

---

### Issue 11: JWT token expires immediately

#### Symptom
- Logged out right after login
- Redirected to login page repeatedly

#### Solution
1. **Check JWT_SECRET in backend/.env**:
   ```env
   JWT_SECRET=your_secret_key_here_minimum_32_characters
   ```

2. **Check token expiration** in `backend/src/services/AuthService.js`:
   ```javascript
   // Should be: expiresIn: '24h'
   ```

3. **Clear old tokens**:
   - Browser console: `localStorage.clear()`
   - Login again

---

### Issue 12: Database connection pool exhausted

#### Symptom
```
Error: Too many connections
```

#### Solution
1. **Restart MySQL**:
   ```bash
   # Windows: services.msc → MySQL → Restart
   ```

2. **Check connection pool settings** in `backend/src/config/database.js`:
   ```javascript
   connectionLimit: 10,
   waitForConnections: true,
   ```

3. **Restart backend server**

---

## 🚨 Emergency Reset (Nuclear Option)

If everything is broken, start fresh:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS smartmedguard"
mysql -u root -p -e "CREATE DATABASE smartmedguard"
mysql -u root -p smartmedguard < database/schema.sql

# 3. Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev

# 4. Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# 5. Clear browser cache and reload
```

---

## 📋 Pre-Demo Verification Checklist

Run these commands to verify everything is working:

```bash
# 1. Check MySQL
mysql -u root -p -e "SELECT COUNT(*) FROM smartmedguard.medicines"
# Should return count (e.g., 80)

# 2. Check Backend
curl http://localhost:5000/health
# Should return: {"status":"ok",...}

# 3. Check Backend API
curl http://localhost:5000/api/medicines
# Should return JSON with medicines array

# 4. Check Frontend
# Open http://localhost:5173 in browser
# Should see login page

# 5. Test Login
# Login with admin/admin123
# Should redirect to dashboard
```

---

## 🆘 Still Having Issues?

### Check Logs

1. **Backend logs**:
   - Look at terminal running backend
   - Check for error messages

2. **Frontend logs**:
   - Browser console (F12)
   - Look for red errors

3. **MySQL logs**:
   - Windows: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`

### System Requirements

- **Node.js**: 18.0.0 or higher
- **MySQL**: 8.0 or higher  
- **RAM**: At least 4GB
- **Disk Space**: At least 500MB free

### Port Requirements

- **3306**: MySQL
- **5000**: Backend API
- **5173**: Frontend Dev Server

Make sure these ports are not blocked by firewall.

---

## 💡 Prevention Tips

1. **Always start backend before frontend**
2. **Keep terminals open** to see error messages
3. **Check logs immediately** if something doesn't work
4. **Test after each major change**
5. **Keep backups** of working `.env` files

---

## 📞 Quick Reference

### Backend Commands
```bash
npm run dev      # Start development server
npm run seed     # Seed database
npm test         # Run tests
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### MySQL Commands
```bash
mysql -u root -p                           # Connect to MySQL
SHOW DATABASES;                            # List databases
USE smartmedguard;                         # Switch to database
SHOW TABLES;                               # List tables
SELECT COUNT(*) FROM medicines;            # Count medicines
```

---

**Remember**: Most issues are configuration-related. Double-check your `.env` files first!
