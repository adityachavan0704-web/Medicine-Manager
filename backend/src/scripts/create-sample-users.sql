-- ============================================================================
-- SmartMedGuard Sample Users Creation Script
-- ============================================================================
-- This script creates sample test accounts for SmartMedGuard
-- Run this if the seed script doesn't work or for manual setup
--
-- Password hashes are pre-generated using bcrypt with SALT_ROUNDS = 10:
-- - admin123 -> $2b$10$ic7xupzPQg/FP74/rnswSeLt20p1MXDw2WDi/WDSXrQgo1OsYanni
-- - pharma123 -> $2b$10$P6ZIsJAjHTe1SAlCDAqAUOzO8LYpDFlh5rYaLafzkhpbmSrwFAPP2
-- - view123 -> $2b$10$HK.4K7oup8CWSHOhU3bb4u.1.fV8nUNwMn2JwFMlt9IYZRFdDq0Yi
-- ============================================================================

-- Clear existing sample users (optional - comment out if you want to keep other users)
-- DELETE FROM users WHERE username IN ('admin', 'pharmacist1', 'viewer');

-- Insert Admin User
INSERT INTO users (id, username, email, password_hash, role, preferences, created_at)
VALUES (
    UUID(),
    'admin',
    'admin@smartmedguard.com',
    '$2b$10$ic7xupzPQg/FP74/rnswSeLt20p1MXDw2WDi/WDSXrQgo1OsYanni',  -- admin123
    'admin',
    '{"theme":"light","alertNotifications":true}',
    NOW()
)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role);

-- Insert Pharmacist User 1
INSERT INTO users (id, username, email, password_hash, role, preferences, created_at)
VALUES (
    UUID(),
    'pharmacist1',
    'pharmacist1@smartmedguard.com',
    '$2b$10$P6ZIsJAjHTe1SAlCDAqAUOzO8LYpDFlh5rYaLafzkhpbmSrwFAPP2',  -- pharma123
    'pharmacist',
    '{"theme":"light","alertNotifications":true}',
    NOW()
)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role);

-- Insert Viewer User
INSERT INTO users (id, username, email, password_hash, role, preferences, created_at)
VALUES (
    UUID(),
    'viewer',
    'viewer@smartmedguard.com',
    '$2b$10$HK.4K7oup8CWSHOhU3bb4u.1.fV8nUNwMn2JwFMlt9IYZRFdDq0Yi',  -- view123
    'viewer',
    '{"theme":"light","alertNotifications":true}',
    NOW()
)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role);

-- Verify users were created
SELECT username, email, role, created_at 
FROM users 
WHERE username IN ('admin', 'pharmacist1', 'viewer')
ORDER BY role, username;

-- ============================================================================
-- Test Credentials Summary:
-- ============================================================================
-- Admin Account:
--   Username: admin
--   Password: admin123
--   Email: admin@smartmedguard.com
--   Role: admin
--
-- Pharmacist Account:
--   Username: pharmacist1
--   Password: pharma123
--   Email: pharmacist1@smartmedguard.com
--   Role: pharmacist
--
-- Viewer Account:
--   Username: viewer
--   Password: view123
--   Email: viewer@smartmedguard.com
--   Role: viewer
-- ============================================================================

-- Note: To generate new password hashes, run this Node.js code:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('your_password', 10).then(hash => console.log(hash));
