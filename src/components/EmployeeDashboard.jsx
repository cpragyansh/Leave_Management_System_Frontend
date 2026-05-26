import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaveHistory } from '../services/leaveService';
import { getProfile } from '../services/authService';
import { formatDates } from '../utils/helpers';

/**
 * EmployeeDashboard Component
 * 
 * This is the dashboard shown to regular employees.
 * It displays their remaining leave balances, their recent leave request history,
 * and a list of upcoming holidays.
 */
const EmployeeDashboard = () => {
  // State variables for history data, remaining days, and loading indicator
  const [history, setHistory] = useState([]);
  const [balances, setBalances] = useState({ annual: 0, sick: 0, personal: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch balances and history when the dashboard opens
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both balance and history in parallel to speed things up
        const [historyRes, profileRes] = await Promise.all([
          getLeaveHistory(),
          getProfile()
        ]);
        setHistory(historyRes.data.data);
        setBalances(profileRes.data.data.leaveBalances || { annual: 0, sick: 0, personal: 0 });
      } catch (err) {
        console.error('Could not load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Helper function to get theme colors and icons for each leave category.
   * 
   * @param {string} type - The leave category (annual, sick, or personal).
   * @returns {Object} Icon name and style classes.
   */
  const getLeaveInfo = (type) => {
    if (type === 'annual') {
      return { icon: 'beach_access', bgColor: 'bg-primary/10', textColor: 'text-primary', name: 'Annual Leave' };
    } else if (type === 'sick') {
      return { icon: 'medical_services', bgColor: 'bg-error/10', textColor: 'text-error', name: 'Sick Leave' };
    } else {
      return { icon: 'potted_plant', bgColor: 'bg-tertiary/10', textColor: 'text-tertiary', name: 'Personal Leave' };
    }
  };



  /**
   * Small badge component showing status colored state.
   */
  const StatusBadge = ({ status }) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Pending
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Request Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Leave Overview</h1>
          <p className="text-body-md text-on-surface-variant">Manage your time off and track your balances.</p>
        </div>
        <Link
          to="/request-leave"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Request New Leave
        </Link>
      </div>

      {/* Remaining Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Annual Leave Card */}
        <div className="soft-depth-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>beach_access</span>
            </div>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">20 Days Total</span>
          </div>
          <div>
            <h3 className="font-semibold text-on-surface-variant mb-1">Annual Leave</h3>
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg text-on-surface">{balances.annual}</span>
              <span className="text-body-md text-on-surface-variant">Days Remaining</span>
            </div>
          </div>
          {/* <div className="w-full bg-surface-container rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (balances.annual / 20) * 100)}%` }}
            ></div>
          </div> */}
        </div>

        {/* Sick Leave Card */}
        <div className="soft-depth-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">10 Days Total</span>
          </div>
          <div>
            <h3 className="font-semibold text-on-surface-variant mb-1">Sick Leave</h3>
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg text-on-surface">{balances.sick}</span>
              <span className="text-body-md text-on-surface-variant">Days Remaining</span>
            </div>
          </div>
          {/* <div className="w-full bg-surface-container rounded-full h-2">
            <div
              className="bg-error h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (balances.sick / 10) * 100)}%` }}
            ></div>
          </div> */}
        </div>

        {/* Personal Leave Card */}
        <div className="soft-depth-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            </div>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">3 Days Total</span>
          </div>
          <div>
            <h3 className="font-semibold text-on-surface-variant mb-1">Personal Leave</h3>
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg text-on-surface">{balances.personal}</span>
              <span className="text-body-md text-on-surface-variant">Days Remaining</span>
            </div>
          </div>
          {/* <div className="w-full bg-surface-container rounded-full h-2">
            <div
              className="bg-tertiary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (balances.personal / 3) * 100)}%` }}
            ></div>
          </div> */}
        </div>
      </div>

      {/* Main Grid: Request History & Holidays Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side: Recent Requests List */}
        <div className="xl:col-span-3 soft-depth-card overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Requests</h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-on-surface-variant">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">You have no leave requests yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {history.map((req) => {
                    const info = getLeaveInfo(req.type);
                    return (
                      <tr key={req._id} className="hover:bg-surface-container-low/50 transition-colors">
                        {/* Leave Type details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${info.bgColor} ${info.textColor} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-[18px]">{info.icon}</span>
                            </div>
                            <span className="font-medium text-on-surface">{info.name}</span>
                          </div>
                        </td>
                        {/* Duration Period */}
                        <td className="px-6 py-4 text-body-md text-on-surface-variant">
                          {formatDates(req.startDate, req.endDate)}
                        </td>
                        {/* Duration Days */}
                        <td className="px-6 py-4 text-body-md text-on-surface-variant">
                          {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                        </td>
                        {/* Status badge and rejection text */}
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                          {req.status === 'rejected' && req.rejectionReason && (
                            <div className="text-xs text-red-500 mt-1 italic">Reason: {req.rejectionReason}</div>
                          )}
                        </td>
                        {/* Explanation Reason */}
                        <td className="px-6 py-4 text-body-md text-on-surface-variant max-w-xs break-words whitespace-normal">
                          {req.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Upcoming Holidays List */}
        <div className="soft-depth-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">event_note</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Upcoming Holidays</h2>
            </div>

            <div className="space-y-4">
              {/* Thanksgiving holiday card */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center bg-surface-container text-primary w-14 h-14 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold">Nov</span>
                  <span className="text-lg font-bold leading-none">23</span>
                </div>
                <div className="flex-1 border-b border-outline-variant/30 pb-4">
                  <h4 className="font-bold text-on-surface">Thanksgiving Day</h4>
                  <p className="text-sm text-on-surface-variant">Thursday, Global</p>
                </div>
              </div>

              {/* Christmas holiday card */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center bg-surface-container text-primary w-14 h-14 rounded-xl">
                  <span className="text-[10px] uppercase font-semibold">Dec</span>
                  <span className="text-lg font-bold leading-none">25</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Christmas Day</h4>
                  <p className="text-sm text-on-surface-variant">Monday, Global</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tip Widget */}
          <div className="mt-8 p-4 bg-primary-fixed/35 rounded-xl border border-primary/10">
            <p className="text-sm text-on-primary-fixed-variant leading-relaxed">
              <span className="font-bold">Pro Tip:</span> Planning to bridge these holidays? Submit your request early!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
