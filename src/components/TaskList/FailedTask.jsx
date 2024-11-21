"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const FailedTask = ({ loggedInUser }) => {
  const [failedTasks, setFailedTasks] = useState(() => {
    // Get tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      return allTasks.filter(task => 
        task.status.toLowerCase() === "failed" &&
        task.assignedTo === loggedInUser.name
      );
    }
    return [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const allTasks = JSON.parse(savedTasks);
        const userFailedTasks = allTasks.filter(task => 
          task.status.toLowerCase() === "failed" &&
          task.assignedTo === loggedInUser.name
        );
        setFailedTasks(userFailedTasks);
      }
    };

    // Listen for storage changes from other components
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for direct localStorage changes
    const tasksStorageListener = () => {
      handleStorageChange();
    };
    window.addEventListener('tasksUpdated', tasksStorageListener);

    // Listen for employee changes
    const employeeChangeListener = () => {
      handleStorageChange();
    };
    window.addEventListener('employeeUpdated', employeeChangeListener);
    
    handleStorageChange(); // Initial load
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasksUpdated', tasksStorageListener);
      window.removeEventListener('employeeUpdated', employeeChangeListener);
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

  const updateTaskStatus = (taskTitle, newStatus) => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const updatedTasks = allTasks.map(task => {
        if (task.title === taskTitle) {
          if (newStatus === 'in_progress') {
            return { 
              ...task, 
              status: 'accepted',
              acceptedAt: new Date().toISOString()
            };
          }
          return { ...task, status: newStatus };
        }
        return task;
      });
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Update employee status based on new task status
      if (newStatus === 'in_progress') {
        updateEmployeeStatus(loggedInUser.name, 'busy');
      } else if (newStatus === 'cancelled') {
        updateEmployeeStatus(loggedInUser.name, 'available');
      }
      
      // Dispatch events to notify other components
      window.dispatchEvent(new Event('tasksUpdated'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Failed Tasks
          </h1>
          <p className="mt-2 text-base text-gray-400">
            View and manage your failed tasks
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="min-w-full align-middle">
          {failedTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No failed tasks</h3>
              <p className="mt-1 text-sm text-gray-500">You haven&apos;t failed any tasks yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 p-6 md:grid-cols-2">
              {failedTasks.map((task) => (
                <div 
                  key={task.title}
                  className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-red-500 ${getBackgroundColor(task.priority)}`}
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
                      <div>Failed on: {moment(task.failedAt || task.dueDate).format('MMM D, YYYY')}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTaskStatus(task.title, 'in_progress')}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateTaskStatus(task.title, 'cancelled')}
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
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

FailedTask.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};

export default FailedTask;
