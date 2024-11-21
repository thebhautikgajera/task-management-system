"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const CompleteTask = ({ loggedInUser }) => {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      return allTasks.filter(task => 
        task.status === "completed" &&
        task.assignedTo === loggedInUser.name
      );
    }
    return [];
  });

  const loadCompletedTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const userCompletedTasks = allTasks.filter(task => 
        task.status === "completed" &&
        task.assignedTo === loggedInUser.name
      );
      setCompletedTasks(userCompletedTasks);
    }
  };

  const updateEmployeeStatus = (employeeName, newStatus) => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    const updatedEmployees = storedEmployees.map(emp => {
      if (emp.name === employeeName) {
        return {
          ...emp,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return emp;
    });
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    window.dispatchEvent(new Event('employeeUpdated'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      loadCompletedTasks();
      // Update employee status to available when tasks are completed
      updateEmployeeStatus(loggedInUser.name, 'available');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('taskUpdated', handleStorageChange);
    window.addEventListener('taskCreated', handleStorageChange);
    window.addEventListener('taskDeleted', handleStorageChange);
    window.addEventListener('employeeUpdated', handleStorageChange);
    
    loadCompletedTasks();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('taskUpdated', handleStorageChange);
      window.removeEventListener('taskCreated', handleStorageChange);
      window.removeEventListener('taskDeleted', handleStorageChange);
      window.removeEventListener('employeeUpdated', handleStorageChange);
    };
  }, [loggedInUser.name]);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-all duration-300",
      medium: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-all duration-300",
      low: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-all duration-300"
    };
    return colors[priority.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 transition-all duration-300";
  };

  const getBackgroundColor = (priority) => {
    const colors = {
      high: "bg-red-50/90 border-red-100 hover:bg-red-50 hover:shadow-red-100/50 transition-all duration-300",
      medium: "bg-amber-50/90 border-amber-100 hover:bg-amber-50 hover:shadow-amber-100/50 transition-all duration-300",
      low: "bg-emerald-50/90 border-emerald-100 hover:bg-emerald-50 hover:shadow-emerald-100/50 transition-all duration-300"
    };
    return colors[priority.toLowerCase()] || "bg-gray-50/90 border-gray-100 hover:bg-gray-50 hover:shadow-gray-100/50 transition-all duration-300";
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY');
  };

  const categories = [...new Set(completedTasks.map(task => task.category))];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-12">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Completed Tasks
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            View and manage your completed tasks
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl shadow-xl bg-white/90 backdrop-blur-lg border border-gray-200/50">
        <div className="min-w-full align-middle p-6">
          {completedTasks.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No completed tasks</h3>
              <p className="mt-2 text-lg text-gray-500">You haven&apos;t completed any tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map(category => (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-8 text-gray-800 flex items-center">
                    <span className="inline-block w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></span>
                    {category}
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {completedTasks.filter(task => task.category === category).map(task => (
                      <div
                        key={task.title}
                        className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${getBackgroundColor(task.priority)}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-semibold text-gray-800 leading-tight line-clamp-2">{task.title}</h4>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{task.description}</p>
                        
                        <div className="text-sm space-y-3 text-gray-500 border-t border-gray-200/80 pt-4">
                          <div className="flex items-center">
                            <span className="w-24 font-medium">Assigned:</span>
                            <span className="text-gray-700">{formatDate(task.assignedDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 font-medium">Deadline:</span>
                            <span className="text-gray-700">{formatDate(task.deadline)}</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <span className="w-24 font-medium">Completed:</span>
                            <span className="font-medium">{formatDate(task.completedAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CompleteTask.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default CompleteTask;
