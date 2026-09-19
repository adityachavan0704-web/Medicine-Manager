-- SmartMedGuard Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pharmacist', 'viewer') DEFAULT 'viewer',
  preferences JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create medicines table
CREATE TABLE medicines (
  id VARCHAR(36) PRIMARY KEY,
  batch_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(200) NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'tablets',
  price DECIMAL(10, 2) NOT NULL,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  expiry_date DATE NOT NULL,
  manufacture_date DATE NOT NULL,
  status ENUM('Safe', 'Expiring Soon', 'Critical', 'Expired') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  INDEX idx_expiry_date (expiry_date),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_batch_number (batch_number),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create alerts table
CREATE TABLE alerts (
  id VARCHAR(36) PRIMARY KEY,
  medicine_id VARCHAR(36) NOT NULL,
  type ENUM('EXPIRING_30', 'EXPIRING_7', 'EXPIRING_1', 'EXPIRED', 'LOW_STOCK') NOT NULL,
  severity ENUM('info', 'warning', 'critical') NOT NULL,
  message TEXT NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  batch_number VARCHAR(50) NOT NULL,
  expiry_date DATE NOT NULL,
  days_until_expiry INT,
  is_read BOOLEAN DEFAULT FALSE,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by VARCHAR(36),
  acknowledged_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_medicine_id (medicine_id),
  INDEX idx_type (type),
  INDEX idx_severity (severity),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create history table
CREATE TABLE history (
  id VARCHAR(36) PRIMARY KEY,
  medicine_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  action ENUM('ADD', 'UPDATE', 'DELETE', 'DISPENSE') NOT NULL,
  details TEXT NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  batch_number VARCHAR(50) NOT NULL,
  quantity_before INT,
  quantity_after INT,
  changes JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_medicine_id (medicine_id),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, email, password_hash, role) 
VALUES (
  'admin-001',
  'admin',
  'admin@smartmedguard.com',
  '$2b$10$rK7Y.YvqVZ7nF6fZYqXXMeE0UF0QJ4Lh9K8jZvqxZYqXXMeE0UF0Q',
  'admin'
);
