"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from 'prop-types';

const RejectedTask = ({ loggedInUser }) => {
  const [rejectedTasks, setRejectedTasks] = useState(() => {
    // Get tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const rejected = allTasks.filter(task => 
        task.status === "rejected" &&
        task.assignedTo === loggedInUser.name
      );
      return rejected;
    }
    return [];
  });

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const allTasks = JSON.parse(savedTasks);
        const rejected = allTasks.filter(task => 
          task.status === "rejected" &&
          task.assignedTo === loggedInUser.name
        );
        setRejectedTasks(rejected);
      }
    };

    // Listen for storage changes from other components
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for direct localStorage changes
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

  const updateTaskStatus = (taskId, newStatus) => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const updatedTasks = allTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Dispatch events to notify other components
      window.dispatchEvent(new Event('tasksUpdated'));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('employeeUpdated')); // Add this line to update employee status
      
      setSelectedTask(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Rejected Tasks
          </h1>
          <p className="mt-2 text-base text-gray-400">
            View all tasks that have been rejected
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="min-w-full align-middle">
          {rejectedTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected tasks</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no rejected tasks to display.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300/50">
              <thead className="bg-gradient-to-r from-red-50/90 to-pink-50/90">
                <tr>
                  <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Task</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 bg-white/50">
                {rejectedTasks.map((task, index) => {
                  const isOverdue = moment(task.dueDate).isBefore(moment(), 'day');
                  const daysRemaining = moment(task.dueDate).diff(moment(), 'days');

                  return (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50/90 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-gray-500">{task.description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {task.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                          {moment(task.dueDate).format("MMM DD, YYYY")}
                        </div>
                        <div className={`text-xs mt-1 ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                          {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {moment(task.assignedDate).format("MMM DD, YYYY")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:shadow-indigo-500/10">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 py-2 border-b border-gray-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Task Details</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium text-indigo-500 mb-2">Title</h3>
                <p className="text-gray-900 text-lg font-medium">{selectedTask.title}</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium text-indigo-500 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedTask.description || "No description provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Category</h3>
                  <p className="text-gray-900 font-medium">{selectedTask.category || "General"}</p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Priority</h3>
                  <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold ${
                    selectedTask.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 ring-2 ring-red-500/20' :
                    selectedTask.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500/20' :
                    'bg-green-100 text-green-700 ring-2 ring-green-500/20'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Status</h3>
                  <div className="flex space-x-2">
                    <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700 ring-2 ring-red-500/20">
                      Rejected
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Due Date</h3>
                  <p className="text-gray-900 font-medium">
                    {moment(selectedTask.dueDate).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RejectedTask.propTypes = {
  loggedInUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default RejectedTask;
