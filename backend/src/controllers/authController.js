const authService = require('../services/AuthService');

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.validatedBody);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.validatedBody);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 */
const updatePreferences = async (req, res, next) => {
  try {
    const preferences = await authService.updatePreferences(
      req.user.id,
      req.body
    );
    res.json(preferences);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updatePreferences
};
