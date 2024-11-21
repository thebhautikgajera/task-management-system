"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const NewTask = ({ loggedInUser }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Get tasks from localStorage and update on changes
    const loadTasks = () => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const userTasks = storedTasks.filter(task => 
        task.assignedTo === loggedInUser.name && 
        task.status === 'pending'
      );
      setTasks(userTasks);
    };

    loadTasks();
    window.addEventListener('storage', loadTasks);
    window.addEventListener('tasksUpdated', loadTasks);
    window.addEventListener('employeeUpdated', loadTasks);
    return () => {
      window.removeEventListener('storage', loadTasks);
      window.removeEventListener('tasksUpdated', loadTasks);
      window.removeEventListener('employeeUpdated', loadTasks);
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

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY');
  };

  const updateEmployeeStatus = async (employeeName, status) => {
    try {
      const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      const updatedEmployees = storedEmployees.map(emp => {
        if (emp.name === employeeName) {
          return {
            ...emp,
            status: status,
            lastUpdated: new Date().toISOString()
          };
        }
        return emp;
      });
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      window.dispatchEvent(new Event('employeeUpdated'));

      // Add real-time update
      if (typeof window !== 'undefined' && window.socket) {
        window.socket.emit('employeeStatusUpdate', {
          employeeName,
          status,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };

  const handleAcceptTask = (taskTitle) => {
    try {
      // Get both tasks and employees from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');

      // Update task status in tasks array
      const updatedTasks = storedTasks.map(task => {
        if(task.title === taskTitle && task.assignedTo === loggedInUser.name) {
          return {
            ...task,
            status: 'accepted',
            acceptedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
        }
        return task;
      });

      // Update employee's tasks array and status
      const updatedEmployees = storedEmployees.map(emp => {
        if(emp.name === loggedInUser.name) {
          const employeeTasks = emp.tasks || [];
          return {
            ...emp,
            status: 'active',
            lastUpdated: new Date().toISOString(),
            tasks: [
              ...employeeTasks,
              {
                taskTitle: taskTitle,
                status: 'accepted',
                acceptedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
              }
            ]
          };
        }
        return emp;
      });

      // Save both updated arrays back to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      
      // Update local state
      setTasks(tasks.filter(task => task.title !== taskTitle));
      
      // Update employee status with real-time changes
      updateEmployeeStatus(loggedInUser.name, 'active');
      
      // Dispatch events for other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('tasksUpdated'));
      window.dispatchEvent(new Event('employeeUpdated'));
      
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };

  const handleRejectTask = (taskTitle) => {
    try {
      // Get both tasks and employees from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');

      // Update task status in tasks array
      const updatedTasks = storedTasks.map(task => {
        if(task.title === taskTitle && task.assignedTo === loggedInUser.name) {
          return {
            ...task,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
        }
        return task;
      });

      // Update employee's tasks array and status
      const updatedEmployees = storedEmployees.map(emp => {
        if(emp.name === loggedInUser.name) {
          const employeeTasks = emp.tasks || [];
          return {
            ...emp,
            status: 'available',
            lastUpdated: new Date().toISOString(),
            tasks: [
              ...employeeTasks,
              {
                taskTitle: taskTitle,
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
              }
            ]
          };
        }
        return emp;
      });

      // Save both updated arrays back to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      
      // Update local state
      setTasks(tasks.filter(task => task.title !== taskTitle));
      
      // Update employee status with real-time changes
      updateEmployeeStatus(loggedInUser.name, 'available');
      
      // Dispatch events for other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('tasksUpdated'));
      window.dispatchEvent(new Event('employeeUpdated'));
      
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            New Tasks
          </h1>
          <p className="mt-2 text-base text-gray-400">
            View and manage your new tasks
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="min-w-full align-middle">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No new tasks</h3>
              <p className="mt-1 text-sm text-gray-500">You don&apos;t have any new tasks assigned.</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {tasks.map((task) => (
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
                      <div>Assigned: {formatDate(task.assignedDate || new Date())}</div>
                      <div>Deadline: {formatDate(task.dueDate)}</div>
                    </div>
                    
                    <div className="space-x-4">
                      <button
                        onClick={() => handleAcceptTask(task.title)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Accept Task
                      </button>
                      <button
                        onClick={() => handleRejectTask(task.title)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Reject Task
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

NewTask.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default NewTask;
