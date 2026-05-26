import React, { useState, useEffect } from 'react';
import { getAllLeaveRequests, reviewLeaveRequest } from '../services/leaveService';
import { getInitials, formatDates, timeAgo } from '../utils/helpers';

/**
 * AdminDashboard Page Component
 * 
 * This is the dashboard screen shown only to Admin / HR users.
 * It lets them view all leave requests submitted by employees,
 * filter them by department or status, and approve or reject requests.
 */
const AdminDashboard = () => {
  // State variables to hold data, loading state, errors, and filters
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('pending');

  // Fetch the leave requests as soon as the screen opens
  useEffect(() => {
    loadRequests();
  }, []);

  /**
   * Loads all leave requests from our database.
   */
  const loadRequests = async () => {
    try {
      const res = await getAllLeaveRequests();
      setRequests(res.data.data);
    } catch (err) {
      setError('Could not load leave requests. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approves or rejects a leave request.
   * If rejecting, it asks the admin for a reason using a popup.
   * 
   * @param {string} id - The ID of the leave request.
   * @param {string} status - The new status (approved or rejected).
   */
  const handleAction = async (id, status) => {
    let reason = '';

    // If the admin is rejecting, ask them why
    if (status === 'rejected') {
      const input = prompt('Enter rejection reason (at least 5 characters):');
      if (input === null) return; // Stop if they clicked Cancel
      
      // Make sure they typed a valid reason
      if (input.trim().length < 5) {
        alert('Rejection reason must be at least 5 characters.');
        return;
      }
      reason = input;
    }

    try {
      // Call our API to save the decision
      await reviewLeaveRequest(id, status, reason);
      // Reload the list so the dashboard updates immediately
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };



  // Filter requests based on status and selected department on the client-side
  const filteredRequests = requests.filter((req) => {
    // 1. Status Filter
    if (req.status !== statusFilter) return false;
    
    // 2. Department Filter (Since we don't have department in schema, we check email)
    if (department !== 'All Departments') {
      const isHr = req.employeeId?.email?.includes('admin');
      const dept = isHr ? 'Human Resources' : 'Engineering';
      if (dept !== department) return false;
    }
    return true;
  });

  // Count how many leave requests are currently pending approval
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  /**
   * Helper function to get color styling for the leave type badges.
   * 
   * @param {string} type - The leave category (annual, sick, personal).
   * @returns {Object} Background styling classes.
   */
  const getTypeBadgeStyle = (type) => {
    if (type === 'sick') return { pill: 'bg-secondary-fixed/35 text-on-secondary-fixed-variant', dot: 'bg-secondary' };
    if (type === 'personal') return { pill: 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant', dot: 'bg-tertiary' };
    return { pill: 'bg-primary-fixed/30 text-on-primary-fixed-variant', dot: 'bg-primary' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Counter Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Manage Leave Requests</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex h-2 w-2 rounded-full ${pendingCount > 0 ? 'bg-tertiary animate-pulse' : 'bg-green-500'}`}></span>
            <p className="text-body-md text-on-surface-variant">
              You have <span className="font-bold text-tertiary">{pendingCount} pending</span> approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filter by Department */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
          <label className="text-sm text-on-surface-variant mb-2 block font-semibold">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg text-body-md p-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="All Departments">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
          <label className="text-sm text-on-surface-variant mb-2 block font-semibold">Status</label>
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
            {['pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 py-1 text-xs rounded-md transition-all cursor-pointer capitalize ${
                  statusFilter === s ? 'bg-white shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table showing all leave requests */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {error && <div className="p-6 text-red-500 text-center">{error}</div>}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant">Loading leave requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              No {statusFilter} leave requests found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center">Days</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredRequests.map((req) => {
                  const initials = getInitials(req.employeeId?.name);
                  const isHr = req.employeeId?.email?.includes('admin');
                  const dept = isHr ? 'Human Resources' : 'Engineering';
                  const { pill, dot } = getTypeBadgeStyle(req.type);

                  return (
                    <tr key={req._id} className="hover:bg-surface-container transition-colors">
                      {/* Name and avatar column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm ring-2 ring-surface-container-high">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">{req.employeeId?.name || 'Unknown'}</p>
                            <p className="text-xs text-on-surface-variant">{dept}</p>
                          </div>
                        </div>
                      </td>

                      {/* Leave type category badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`}></span>
                          {req.type} Leave
                        </span>
                      </td>

                      {/* Duration details */}
                      <td className="px-6 py-4 text-body-md text-on-surface">{formatDates(req.startDate, req.endDate)}</td>

                      {/* Number of days requested */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-surface-container-high px-2 py-1 rounded font-semibold text-body-md">{req.totalDays}</span>
                      </td>

                      {/* How long ago it was sent */}
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{timeAgo(req.createdAt)}</td>

                      {/* Message/reason from the employee */}
                      <td className="px-6 py-4 max-w-xs break-words">
                        <p className="text-body-md text-on-surface-variant whitespace-normal">{req.reason}</p>
                      </td>

                      {/* Action buttons (Approve / Reject) */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {req.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAction(req._id, 'rejected')}
                                className="p-2 rounded-lg bg-error-container text-on-error-container hover:bg-error/10 transition-colors cursor-pointer"
                                title="Reject"
                              >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                              </button>
                              <button
                                onClick={() => handleAction(req._id, 'approved')}
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer"
                                title="Approve"
                              >
                                <span className="material-symbols-outlined text-[20px]">check</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-xs italic text-on-surface-variant capitalize px-2">{req.status}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer showing count info */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <p className="text-sm text-on-surface-variant font-medium">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
