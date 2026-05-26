import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { applyLeave } from '../services/leaveService';
import { getProfile } from '../services/authService';
import { countWorkingDays } from '../utils/helpers';

/**
 * RequestLeave Page Component
 * 
 * This page contains the leave application form.
 * Employees can select the type of leave, start and end dates, and state their reason.
 * The page automatically calculates and displays the total number of working days (excluding weekends).
 */
const RequestLeave = () => {
  // States to hold the user's balances, form inputs, total days, loading state, and messages
  const [balances, setBalances] = useState({ annual: 0, sick: 0, personal: 0 });
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Load the employee's leave balance limits when page renders
  useEffect(() => {
    const loadBalances = async () => {
      try {
        const res = await getProfile();
        setBalances(res.data.data.leaveBalances || { annual: 0, sick: 0, personal: 0 });
      } catch (err) {
        console.error('Could not load leave balances:', err);
      }
    };
    loadBalances();
  }, []);

  // Automatically recalculate total working days when start date or end date changes
  useEffect(() => {
    const workingDays = countWorkingDays(startDate, endDate);
    setTotalDays(workingDays);
  }, [startDate, endDate]);

  /**
   * Handles the submission of the leave request form.
   * 
   * @param {Event} e - Submit Event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Require selection of leave type
    if (!leaveType) {
      setError('Please select a leave type first.');
      return;
    }

    setIsLoading(true);

    try {
      // Submit details to backend API
      await applyLeave({ type: leaveType, startDate, endDate, reason });
      setSuccess('Leave request submitted successfully!');
      
      // Wait briefly so the success message is readable, then redirect back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit leave request. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        {/* Banner with Leave Balance Limit Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-primary rounded-xl p-8 text-on-primary relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h3 className="font-headline-lg text-headline-lg mb-2">Need some time off?</h3>
              <p className="text-body-lg opacity-90 max-w-md">
                Submit your request below. Your manager will be notified immediately for review.
              </p>
            </div>
            <span
              className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] opacity-10 rotate-12 pointer-events-none select-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              beach_access
            </span>
          </div>

          {/* Quick reference card for annual leave remaining */}
          <div className="bg-surface-container-highest rounded-xl p-6 flex flex-col justify-between border border-outline-variant shadow-sm">
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Available Balance
              </p>
              <h4 className="font-display-lg text-display-lg text-primary font-bold">
                {balances.annual} <span className="text-xl font-semibold">Days</span>
              </h4>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span className="text-sm">Annual leave remaining</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="glass-card rounded-xl shadow-sm p-6 md:p-10">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm text-center mb-6 border border-error/20">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center mb-6 border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dropdown for Leave Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant">Leave Type</label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select leave category</option>
                    <option value="annual">Annual</option>
                    <option value="sick">Sick</option>
                    <option value="personal">Personal</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                </div>
              </div>

              {/* Start Date and End Date Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
                  />
                </div>
              </div>

              {/* Display Calculated Total Working Days */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant">Total Days</label>
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className={`font-bold text-2xl ${totalDays > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {totalDays}
                  </span>
                  <span className="text-sm text-outline">Working Days</span>
                </div>
              </div>
            </div>

            {/* Description textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">Reason for Leave</label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the reason for your request..."
                rows="4"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md resize-none outline-none"
              />
            </div>

            {/* Buttons for actions */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-4">
              <Link
                to="/dashboard"
                className="w-full md:w-auto px-8 py-2.5 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors text-center cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-10 py-2.5 bg-primary text-on-primary rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-55"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Policy Checklist Panel */}
        <div className="mt-6 p-6 bg-tertiary-fixed rounded-xl flex items-start gap-4 border border-tertiary/10">
          <span className="material-symbols-outlined text-tertiary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
          <div>
            <h5 className="text-sm font-bold text-on-tertiary-fixed uppercase tracking-wide mb-1">Quick Policy Check</h5>
            <p className="text-sm text-on-tertiary-fixed-variant opacity-90 leading-relaxed">
              Please submit annual leave at least 7 days in advance. Sick leave should be submitted within 48 hours of returning to work.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestLeave;
