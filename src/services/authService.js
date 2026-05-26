/**
 * @file authService.js
 * @description Functions to talk to the auth API - login, register, and get profile.
 */

import API from './api';

/**
 * Login user with email and password.
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Response with user data and JWT token
 */
export const loginUser = (email, password) => {
  return API.post('/auth/login', { email, password });
};

/**
 * Register a new user account.
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise} Response with new user data and token
 */
export const registerUser = (name, email, password) => {
  return API.post('/auth/register', { name, email, password });
};

/**
 * Get the profile of the currently logged-in user.
 * Uses the token from sessionStorage (added automatically by api.js interceptor).
 * @returns {Promise} Response with user profile data
 */
export const getProfile = () => {
  return API.get('/auth/me');
};
