"use client";

import { useState } from "react";
import AdminHeader from "../Others/AdminHeader";
import AdminStats from "../Others/AdminStats";
import AdminAllTasklist from "../Others/AdminAllTasklist";
import AdminUserList from "../Others/AdminUserList";
import AdminDiscussionPanel from "../Others/AdminDiscussionPanel";

const AdminDashboard = () => {
  const [currentSection, setCurrentSection] = useState('main'); // 'main' or 'discussion'

  return (
    <>
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => setCurrentSection('main')}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            currentSection === 'main' 
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-indigo-500/40'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Main Dashboard
          </div>
        </button>
        <button
          onClick={() => setCurrentSection('discussion')}
          className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            currentSection === 'discussion'
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-indigo-500/40'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Discussion Panel
          </div>
        </button>
      </div>

      {currentSection === 'main' ? (
        // Main Dashboard Section
        <div className="mt-8">
          <div className="mt-12">
            <AdminStats />
          </div>

          <div className="mt-12">
            <AdminAllTasklist />
          </div>

          <div className="mt-12 mb-16">
            <AdminUserList />
          </div>
        </div>
      ) : (
        // Discussion Panel Section
        <div className="mt-8">
          <AdminDiscussionPanel />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
