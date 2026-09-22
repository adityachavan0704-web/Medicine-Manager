const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'smartmedguard-secret-key-change-in-production';
const JWT_EXPIRATION = '24h';
const SALT_ROUNDS = 10;

/**
 * AuthService - Handles user authentication and authorization
 */
class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { username, email, password, role = 'viewer' } = userData;

    try {
      // Check if user exists
      const [existing] = await db.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existing.length > 0) {
        throw new Error('Username or email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const userId = uuidv4();
      await db.query(
        `INSERT INTO users (id, username, email, password_hash, role, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId, username, email, passwordHash, role]
      );

      // Generate token
      const token = this.generateToken({ id: userId, username, email, role });

      return {
        user: { id: userId, username, email, role },
        token
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async loginUser(credentials) {
    const { usernameOrEmail, password } = credentials;

    try {
      // Find user
      const [users] = await db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [usernameOrEmail, usernameOrEmail]
      );

      if (users.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = users[0];

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );

      // Generate token
      const token = this.generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          preferences: user.preferences ? JSON.parse(user.preferences) : {}
        },
        token
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const [users] = await db.query(
        'SELECT id, username, email, role, preferences, created_at, last_login FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences ? JSON.parse(user.preferences) : {},
        createdAt: user.created_at,
        lastLogin: user.last_login
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId, preferences) {
    try {
      await db.query(
        'UPDATE users SET preferences = ? WHERE id = ?',
        [JSON.stringify(preferences), userId]
      );

      return preferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
