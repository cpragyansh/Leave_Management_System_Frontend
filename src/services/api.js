/**
 * @file api.js
 * @description Creates an axios instance with the base URL of our backend.
 * Also automatically adds the JWT token to every request so the user stays logged in.
 */

import axios from 'axios';

// Base URL for our backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

/**
 * Request interceptor - runs before every API call.
 * Reads the user from sessionStorage and adds their token to the request header.
 * This way we don't have to manually add the token in every service file.
 */
API.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
