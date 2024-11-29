"use client";

import { useState, useEffect } from "react";
import moment from 'moment';
import PropTypes from 'prop-types';

const Header = ({ loggedInUser }) => {
  const firstName = loggedInUser.name.split(' ')[0];
  const lastName = loggedInUser.name.split(' ')[1];
  const username = loggedInUser.username;
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setMounted(true);
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateTime = () => {
    const now = moment();
    setCurrentTime(now.format('hh:mm:ss A'));
    setCurrentDate(now.format('MMM DD, YYYY'));
  };

  const getGreeting = () => {
    if (!mounted) return "Hello";
    const hour = moment().hour();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = name => name.split(" ").map(part => part[0]).join("").toUpperCase();

  const handleLogout = () => {
    localStorage.setItem('loggedInUser', '');
    window.location.reload();
  };

  if (!mounted) {
    return (
      <header className="bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 py-6 px-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 drop-shadow-lg">
                Hello, {username}!
              </h1>
              <p className="text-gray-300 text-base font-light">{firstName} {lastName}</p>
              <p className="text-gray-300 text-base font-light">Have a wonderful and productive day ahead</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right backdrop-blur-lg bg-white/10 p-4 rounded-xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                <p className="text-sm text-gray-200 font-medium">Current Date & Time</p>
                <p className="text-base font-semibold text-white animate-pulse">Loading...</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white/30">
                <span className="text-white font-bold text-lg">{getInitials(username)}</span>
              </div>
              <button onClick={handleLogout} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 via-purple-500 to-blue-600 rounded-lg hover:from-violet-600 hover:via-purple-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-xl border border-white/20">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 py-6 px-6 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 drop-shadow-lg">
              {getGreeting()}, {username}!
            </h1>
            <p className="text-gray-300 text-base font-light">{firstName} {lastName}</p>
            <p className="text-gray-300 text-base font-light">Have a wonderful and productive day ahead</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="backdrop-blur-lg bg-white/10 p-4 rounded-xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
              <div className="text-right">
                <p className="text-sm text-gray-200 font-medium">Current Date & Time</p>
                <p className="text-base font-semibold text-white">{currentDate}</p>
                <p className="text-base font-semibold text-white">{currentTime}</p>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white/30">
              <span className="text-white font-bold text-lg">{getInitials(username)}</span>
            </div>
            <button onClick={handleLogout} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 via-purple-500 to-blue-600 rounded-lg hover:from-violet-600 hover:via-purple-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-xl border border-white/20">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired
};

export default Header;
