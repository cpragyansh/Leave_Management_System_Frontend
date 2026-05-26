/**
 * @file leaveService.js
 * @description Functions to talk to the leave API - applying, viewing history, and admin actions.
 */

import API from './api';

/**
 * Submit a new leave request.
 * @param {Object} leaveData - Object with type, startDate, endDate, reason
 * @returns {Promise} Response with the created leave request
 */
export const applyLeave = (leaveData) => {
  return API.post('/leaves/apply', leaveData);
};

/**
 * Get all past leave requests for the currently logged-in employee.
 * @returns {Promise} Response with array of leave requests
 */
export const getLeaveHistory = () => {
  return API.get('/leaves/history');
};

/**
 * Admin only - get all leave requests from every employee.
 * @returns {Promise} Response with all leave requests in the system
 */
export const getAllLeaveRequests = () => {
  return API.get('/leaves/admin/all');
};

/**
 * Admin only - approve or reject a leave request.
 * @param {string} requestId - The ID of the leave request to review
 * @param {string} status - Either 'approved' or 'rejected'
 * @param {string} rejectionReason - Required if status is 'rejected'
 * @returns {Promise} Response with the updated leave request
 */
export const reviewLeaveRequest = (requestId, status, rejectionReason) => {
  return API.put(`/leaves/admin/review/${requestId}`, { status, rejectionReason });
};
