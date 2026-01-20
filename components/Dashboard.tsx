
import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getSecurityAdvice } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [advice, setAdvice] = useState<string>('Loading AI security insights...');

  useEffect(() => {
    const fetchAdvice = async () => {
      const msg = await getSecurityAdvice(user.name);
      setAdvice(msg);
    };
    fetchAdvice();
  }, [user.name]);

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 text-sm mb-6">{user.email}</p>
          <div className="w-full space-y-3">
            <button 
              onClick={onLogout}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 text-sm font-medium"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Security Box */}
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI Security Assistant
            </h3>
            <p className="text-slate-300 leading-relaxed italic text-sm">
              "{advice}"
            </p>
          </div>

          {/* Stats / Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Account Created</span>
              <p className="text-lg font-semibold text-white mt-1">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Security Status</span>
              <p className="text-lg font-semibold text-green-400 mt-1">Excellent</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">Session Login</p>
                      <p className="text-xs text-slate-500">Chrome on macOS • Today</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
