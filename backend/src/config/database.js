/**
 * Database Connection Module
 * 
 * Provides MySQL connection pool with:
 * - Automatic retry logic for failed connections
 * - Connection health checks
 * - Comprehensive error handling
 * - Connection pool management
 * 
 * Requirements:
 * - 15.4: Database connection failure handling with 503 status and logging
 * - 17.6: System startup database connectivity for data structure initialization
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database configuration from environment variables
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartmedguard',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 5,
  initialDelay: 1000,      // 1 second
  maxDelay: 30000,         // 30 seconds
  backoffMultiplier: 2,    // Exponential backoff
};

/**
 * Connection pool instance
 */
let pool = null;

/**
 * Calculate delay for exponential backoff
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoffDelay(attempt) {
  const delay = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
}

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create connection pool with retry logic
 * 
 * Implements exponential backoff retry strategy:
 * - Attempt 0: 1 second delay
 * - Attempt 1: 2 seconds delay
 * - Attempt 2: 4 seconds delay
 * - Attempt 3: 8 seconds delay
 * - Attempt 4: 16 seconds delay
 * 
 * @param {number} attempt - Current attempt number (default: 0)
 * @returns {Promise<mysql.Pool>} MySQL connection pool
 * @throws {Error} If all retry attempts fail
 */
async function createPool(attempt = 0) {
  try {
    console.log(`[Database] Creating connection pool (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})...`);
    
    const newPool = mysql.createPool(dbConfig);
    
    // Test connection by executing a simple query
    const connection = await newPool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('[Database] Connection pool created successfully');
    console.log(`[Database] Connected to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    return newPool;
  } catch (error) {
    console.error(`[Database] Connection attempt ${attempt + 1} failed:`, error.message);
    
    // If max retries reached, throw error
    if (attempt >= RETRY_CONFIG.maxRetries - 1) {
      console.error('[Database] Max retry attempts reached. Connection failed.');
      throw new Error(`Database connection failed after ${RETRY_CONFIG.maxRetries} attempts: ${error.message}`);
    }
    
    // Calculate delay and retry
    const delay = calculateBackoffDelay(attempt);
    console.log(`[Database] Retrying in ${delay / 1000} seconds...`);
    await sleep(delay);
    
    return createPool(attempt + 1);
  }
}

/**
 * Initialize database connection pool
 * 
 * Creates the connection pool with retry logic.
 * Should be called once during application startup.
 * 
 * Requirements:
 * - 17.6: System startup database connectivity
 * - 15.4: Error logging for connection failures
 * 
 * @returns {Promise<mysql.Pool>} MySQL connection pool
 * @throws {Error} If connection fails after all retries
 */
export async function initializeDatabase() {
  if (pool) {
    console.log('[Database] Connection pool already initialized');
    return pool;
  }
  
  try {
    pool = await createPool();
    
    // Set up pool error handler
    pool.on('error', (err) => {
      console.error('[Database] Pool error:', err.message);
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.log('[Database] Connection lost. Pool will attempt to reconnect automatically.');
      }
    });
    
    return pool;
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error.message);
    throw error;
  }
}

/**
 * Get database connection pool
 * 
 * Returns the existing connection pool or throws error if not initialized.
 * 
 * Requirements:
 * - 15.4: Error handling for database operations
 * 
 * @returns {mysql.Pool} MySQL connection pool
 * @throws {Error} If pool is not initialized
 */
export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

/**
 * Execute query with connection retry logic
 * 
 * Wraps query execution with automatic retry on connection failures.
 * 
 * Requirements:
 * - 15.4: Database connection failure handling with error logging
 * 
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @param {number} attempt - Current attempt number (default: 0)
 * @returns {Promise<Array>} Query results
 * @throws {Error} If query fails after retries
 */
export async function executeQuery(sql, params = [], attempt = 0) {
  try {
    const currentPool = getPool();
    const [rows] = await currentPool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error(`[Database] Query execution failed (attempt ${attempt + 1}):`, error.message);
    
    // Retry on connection errors
    const isConnectionError = 
      error.code === 'PROTOCOL_CONNECTION_LOST' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNREFUSED';
    
    if (isConnectionError && attempt < 3) {
      const delay = calculateBackoffDelay(attempt);
      console.log(`[Database] Retrying query in ${delay / 1000} seconds...`);
      await sleep(delay);
      return executeQuery(sql, params, attempt + 1);
    }
    
    // Re-throw error if not a connection error or max retries reached
    throw error;
  }
}

/**
 * Check database connection health
 * 
 * Performs a simple ping to verify database connectivity.
 * Used for health check endpoints and monitoring.
 * 
 * Requirements:
 * - 15.4: Connection health verification
 * - 17.6: System startup connectivity check
 * 
 * @returns {Promise<Object>} Health status object
 */
export async function checkHealth() {
  try {
    if (!pool) {
      return {
        status: 'disconnected',
        message: 'Database pool not initialized',
        timestamp: new Date().toISOString(),
      };
    }
    
    const connection = await pool.getConnection();
    const startTime = Date.now();
    await connection.ping();
    const responseTime = Date.now() - startTime;
    connection.release();
    
    return {
      status: 'healthy',
      message: 'Database connection is healthy',
      responseTime: `${responseTime}ms`,
      connections: {
        active: pool.pool._allConnections.length,
        idle: pool.pool._freeConnections.length,
        limit: dbConfig.connectionLimit,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Database] Health check failed:', error.message);
    return {
      status: 'unhealthy',
      message: error.message,
      error: error.code,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Close database connection pool gracefully
 * 
 * Closes all connections in the pool.
 * Should be called during application shutdown.
 * 
 * @returns {Promise<void>}
 */
export async function closeDatabase() {
  if (pool) {
    try {
      console.log('[Database] Closing connection pool...');
      await pool.end();
      pool = null;
      console.log('[Database] Connection pool closed successfully');
    } catch (error) {
      console.error('[Database] Error closing pool:', error.message);
      throw error;
    }
  }
}

/**
 * Transaction helper - begin transaction
 * 
 * Gets a connection from the pool and begins a transaction.
 * 
 * @returns {Promise<mysql.PoolConnection>} Database connection with active transaction
 */
export async function beginTransaction() {
  const connection = await getPool().getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Transaction helper - commit transaction
 * 
 * Commits the transaction and releases the connection back to the pool.
 * 
 * @param {mysql.PoolConnection} connection - Database connection
 * @returns {Promise<void>}
 */
export async function commitTransaction(connection) {
  try {
    await connection.commit();
  } finally {
    connection.release();
  }
}

/**
 * Transaction helper - rollback transaction
 * 
 * Rolls back the transaction and releases the connection back to the pool.
 * 
 * Requirements:
 * - 17.7: Rollback data structure changes on database failure
 * 
 * @param {mysql.PoolConnection} connection - Database connection
 * @returns {Promise<void>}
 */
export async function rollbackTransaction(connection) {
  try {
    await connection.rollback();
  } finally {
    connection.release();
  }
}

/**
 * Export database configuration (for testing/debugging)
 */
export function getDatabaseConfig() {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    connectionLimit: dbConfig.connectionLimit,
  };
}

export default {
  initializeDatabase,
  getPool,
  executeQuery,
  checkHealth,
  closeDatabase,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  getDatabaseConfig,
};
