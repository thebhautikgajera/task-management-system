"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const AcceptTask = ({ loggedInUser }) => {
  const [acceptedTasks, setAcceptedTasks] = useState(() => {
    // Get tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      return allTasks.filter(task => 
        task.status === "accepted" && 
        task.assignedTo === loggedInUser.name
      );
    }
    return [];
  });

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const userAcceptedTasks = allTasks.filter(task => 
        task.status === "accepted" &&
        task.assignedTo === loggedInUser.name
      );
      setAcceptedTasks(userAcceptedTasks);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      loadTasks();
    };

    // Listen for storage changes from other components
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('taskUpdated', handleStorageChange);
    window.addEventListener('taskCreated', handleStorageChange);
    window.addEventListener('taskDeleted', handleStorageChange);
    window.addEventListener('employeeUpdated', handleStorageChange);
    window.addEventListener('statusChanged', handleStorageChange);
    
    handleStorageChange(); // Initial load
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('taskUpdated', handleStorageChange);
      window.removeEventListener('taskCreated', handleStorageChange);
      window.removeEventListener('taskDeleted', handleStorageChange);
      window.removeEventListener('employeeUpdated', handleStorageChange);
      window.removeEventListener('statusChanged', handleStorageChange);
    };
  }, [loggedInUser.name]);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-200 text-red-900 border-red-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      low: "bg-green-200 text-green-900 border-green-300"
    };
    return colors[priority.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getBackgroundColor = (priority) => {
    const colors = {
      high: "bg-red-100 border-red-200",
      medium: "bg-yellow-50 border-yellow-100",
      low: "bg-green-100 border-green-200"
    };
    return colors[priority.toLowerCase()] || "bg-gray-50 border-gray-100";
  };

  const handleMarkCompleted = (taskTitle) => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const updatedTasks = allTasks.map(task => {
        if (task.title === taskTitle) {
          return { 
            ...task, 
            status: 'completed',
            completedAt: new Date().toISOString(),
            completedBy: loggedInUser.name,
            section: 'completed'
          };
        }
        return task;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Update local state to remove completed task
      setAcceptedTasks(prev => prev.filter(task => task.title !== taskTitle));
      
      // Dispatch events for real-time updates
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('taskUpdated'));
      window.dispatchEvent(new Event('employeeUpdated'));
      window.dispatchEvent(new Event('statusChanged'));
      
      // Reload tasks
      loadTasks();
    }
  };

  const handleMarkFailed = (taskTitle) => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const updatedTasks = allTasks.map(task => {
        if (task.title === taskTitle) {
          return { 
            ...task, 
            status: 'failed',
            failedAt: new Date().toISOString(),
            failedBy: loggedInUser.name,
            failedReason: 'Task marked as failed by employee',
            section: 'failed'
          };
        }
        return task;
      });
      
      // Save updated tasks to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Remove failed task from accepted tasks list
      setAcceptedTasks(prev => prev.filter(task => task.title !== taskTitle));
      
      // Dispatch events for real-time updates
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('taskUpdated'));
      window.dispatchEvent(new Event('employeeUpdated'));
      window.dispatchEvent(new Event('statusChanged'));

      // Reload tasks
      loadTasks();
    }
  };

  const taskCategories = [...new Set(acceptedTasks.map(task => task.category))];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Accepted Tasks
          </h1>
          <p className="mt-2 text-base text-gray-400">
            View and manage your accepted tasks
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="min-w-full align-middle">
          {acceptedTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No accepted tasks</h3>
              <p className="mt-1 text-sm text-gray-500">You haven&apos;t accepted any tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {taskCategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Categories</h3>
                  <div className="flex gap-2 flex-wrap">
                    {taskCategories.map(category => (
                      <span key={category} className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {acceptedTasks.map((task) => (
                <div 
                  key={task.title} 
                  className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 border ${getBackgroundColor(task.priority)}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                      <span className="text-sm text-blue-600">{task.category}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <div>Due Date: {moment(task.dueDate).format('MMM D, YYYY')}</div>
                      <div>Accepted on: {moment(task.acceptedAt).format('MMM D, YYYY')}</div>
                    </div>
                    
                    <div className="space-x-4">
                      <button
                        onClick={() => handleMarkCompleted(task.title)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => handleMarkFailed(task.title)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Mark as Failed
                      </button>
                    </div>
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

AcceptTask.propTypes = {
  loggedInUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default AcceptTask;
