"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const TaskListCount = ({ loggedInUser }) => {
  const [taskCounts, setTaskCounts] = useState({
    new: 0,
    accepted: 0,
    completed: 0,
    failed: 0,
    rejected: 0
  });

  useEffect(() => {
    const updateTaskCounts = () => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const allTasks = JSON.parse(savedTasks);
        const userTasks = allTasks.filter(task => task.assignedTo === loggedInUser.name);
        
        setTaskCounts({
          new: userTasks.filter(task => task.status === "new").length,
          accepted: userTasks.filter(task => task.status === "active").length,
          completed: userTasks.filter(task => task.status === "completed").length,
          failed: userTasks.filter(task => task.status === "failed").length,
          rejected: userTasks.filter(task => task.status === "rejected").length
        });
      }
    };

    updateTaskCounts();

    window.addEventListener('storage', updateTaskCounts);
    return () => window.removeEventListener('storage', updateTaskCounts);
  }, [loggedInUser.name]);

  const countCards = [
    {
      title: 'New Tasks',
      count: taskCounts.new,
      bgColor: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-50',
      borderColor: 'border-indigo-400/30',
      icon: (
        <svg className="w-10 h-10 text-indigo-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      ),
      animation: 'hover:scale-105'
    },
    {
      title: 'Active Tasks',
      count: taskCounts.accepted, 
      bgColor: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-50',
      borderColor: 'border-sky-400/30',
      icon: (
        <svg className="w-10 h-10 text-sky-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      animation: 'hover:scale-105'
    },
    {
      title: 'Completed Tasks',
      count: taskCounts.completed,
      bgColor: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-50',
      borderColor: 'border-emerald-400/30',
      icon: (
        <svg className="w-10 h-10 text-emerald-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
      ),
      animation: 'hover:scale-105'
    },
    {
      title: 'Failed Tasks',
      count: taskCounts.failed,
      bgColor: 'from-rose-500 to-red-600',
      textColor: 'text-rose-50',
      borderColor: 'border-rose-400/30',
      icon: (
        <svg className="w-10 h-10 text-rose-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      ),
      animation: 'hover:scale-105'
    },
    {
      title: 'Rejected Tasks',
      count: taskCounts.rejected,
      bgColor: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-50', 
      borderColor: 'border-amber-400/30',
      icon: (
        <svg className="w-10 h-10 text-amber-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      ),
      animation: 'hover:scale-105'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {countCards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 bg-gradient-to-br ${card.bgColor} shadow-xl hover:shadow-2xl transition-all duration-300 transform ${card.animation} relative overflow-hidden border ${card.borderColor}`}
          >
            <div className="relative z-10">
              <h3 className={`text-lg font-medium ${card.textColor} mb-2`}>
                {card.title}
              </h3>
              <div className="flex items-baseline">
                <p className="text-4xl font-bold text-white">
                  {card.count}
                </p>
                <span className="ml-2 text-lg font-medium text-white/80">
                  {card.count === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TaskListCount.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default TaskListCount;
