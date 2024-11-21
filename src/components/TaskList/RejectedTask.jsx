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
      high: "bg-red-200 text-red-900 border-red-300 ring-2 ring-red-500/20",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-500/20", 
      low: "bg-green-200 text-green-900 border-green-300 ring-2 ring-green-500/20"
    };
    return colors[priority.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200 ring-2 ring-gray-500/20";
  };

  const handleAcceptTask = (task) => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const updatedTasks = allTasks.map(t => {
        if (t.id === task.id) {
          return { ...t, status: "accepted" };
        }
        return t;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('tasksUpdated'));
      setSelectedTask(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            Rejected Tasks
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-2xl">
            View and manage tasks that have been rejected. These tasks may need revision or reconsideration.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
        <div className="min-w-full align-middle">
          {rejectedTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No Rejected Tasks</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                There are currently no rejected tasks to display. All your tasks are either in progress or completed.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300/50">
              <thead className="bg-gradient-to-r from-red-50/90 via-pink-50/90 to-purple-50/90">
                <tr>
                  <th scope="col" className="py-5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Task Details</th>
                  <th scope="col" className="px-3 py-5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-5 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th scope="col" className="px-3 py-5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th scope="col" className="px-3 py-5 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 bg-white/50">
                {rejectedTasks.map((task, index) => {
                  const isOverdue = moment(task.dueDate).isBefore(moment(), 'day');
                  const daysRemaining = moment(task.dueDate).diff(moment(), 'days');

                  return (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50/90 transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm">
                        <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                        <div className="text-gray-500 mt-1 line-clamp-2 max-w-md">{task.description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 ring-2 ring-blue-500/20 capitalize">
                          {task.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        <div className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                          {moment(task.dueDate).format("MMM DD, YYYY")}
                        </div>
                        <div className={`text-xs mt-1.5 ${
                          isOverdue 
                            ? "text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block" 
                            : "text-gray-500"
                        }`}>
                          {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        <div className="text-gray-900">{moment(task.assignedDate).format("MMM DD, YYYY")}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {moment(task.assignedDate).fromNow()}
                        </div>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div 
            className="bg-white/95 rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:shadow-indigo-500/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 py-2 border-b border-gray-100 z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Task Details
              </h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium text-indigo-600 mb-2">Title</h3>
                <p className="text-gray-900 text-xl font-semibold">{selectedTask.title}</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium text-indigo-600 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedTask.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Category</h3>
                  <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 ring-2 ring-blue-500/20">
                    {selectedTask.category || "General"}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Priority</h3>
                  <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Status</h3>
                  <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700 ring-2 ring-red-500/20">
                    Rejected
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Due Date</h3>
                  <div>
                    <p className="text-gray-900 font-semibold">
                      {moment(selectedTask.dueDate).format("MMM DD, YYYY")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {moment(selectedTask.dueDate).fromNow()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => handleAcceptTask(selectedTask)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Accept Task
                </button>
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