"use client";

import { useState, useEffect } from "react";

const AdminStats = () => {
  const [overallStats, setOverallStats] = useState({
    total: 0,
    averageTasksPerEmployee: 0,
    completionRate: 0,
    urgentTasks: 0,
    overdue: 0,
    byStatus: {
      completed: 0,
      "in progress": 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      failed: 0
    },
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    mostProductiveEmployee: {
      name: "",
      completedTasks: 0,
    },
  });

  const [taskStats, setTaskStats] = useState({});

  useEffect(() => {
    // Get tasks from localStorage
    const tasksStr = localStorage.getItem('tasks');
    if (!tasksStr) return;

    const tasks = JSON.parse(tasksStr);
    
    // Calculate overall stats
    const stats = {
      total: tasks.length,
      byStatus: { completed: 0, "in progress": 0, pending: 0, rejected: 0, accepted: 0, failed: 0 },
      byPriority: { high: 0, medium: 0, low: 0 },
      urgentTasks: 0,
      overdue: 0,
    };

    const employeeStats = {};

    // Group tasks by employee
    const tasksByEmployee = tasks.reduce((acc, task) => {
      if (!acc[task.assignedTo]) {
        acc[task.assignedTo] = [];
      }
      acc[task.assignedTo].push(task);
      return acc;
    }, {});

    Object.entries(tasksByEmployee).forEach(([employee, employeeTasks]) => {
      const employeeStat = {
        total: employeeTasks.length,
        byStatus: { completed: 0, "in progress": 0, pending: 0, rejected: 0, accepted: 0, failed: 0 },
        byPriority: { high: 0, medium: 0, low: 0 },
        completionRate: 0,
        upcomingDue: 0,
        overdue: 0,
        failedTasks: 0
      };

      employeeTasks.forEach((task) => {
        // Update status counts
        const status = task.status.toLowerCase();
        stats.byStatus[status]++;
        employeeStat.byStatus[status]++;

        // Update priority counts
        stats.byPriority[task.priority.toLowerCase()]++;
        employeeStat.byPriority[task.priority.toLowerCase()]++;

        // Check for urgent/overdue tasks
        const dueDate = new Date(task.deadline);
        const today = new Date();
        
        if (status !== 'completed' && status !== 'rejected') {
          if (dueDate < today) {
            stats.overdue++;
            employeeStat.overdue++;
          }
          
          // Check if due within next 3 days or high priority
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(today.getDate() + 3);
          
          if ((dueDate <= threeDaysFromNow && dueDate >= today) || task.priority.toLowerCase() === 'high') {
            stats.urgentTasks++;
            employeeStat.upcomingDue++;
          }
        }

        // Calculate failed tasks (overdue or rejected)
        if (status === 'rejected' || (status !== 'completed' && dueDate < today)) {
          employeeStat.failedTasks++;
          employeeStat.byStatus.failed++;
          stats.byStatus.failed++;
        }
      });

      // Calculate completion rate for employee (excluding rejected tasks)
      const completedTasks = employeeStat.byStatus.completed;
      const totalExcludingRejected = employeeStat.total - employeeStat.byStatus.rejected;
      employeeStat.completionRate = Math.round((completedTasks / totalExcludingRejected) * 100);
      employeeStats[employee] = employeeStat;
    });

    // Calculate overall completion rate and average tasks (excluding rejected)
    const totalEmployees = Object.keys(tasksByEmployee).length || 1;
    const totalCompletedTasks = stats.byStatus.completed;
    const totalExcludingRejected = stats.total - stats.byStatus.rejected;
    
    stats.completionRate = Math.round((totalCompletedTasks / totalExcludingRejected) * 100);
    stats.averageTasksPerEmployee = Math.round(stats.total / totalEmployees);

    // Find most productive employee
    let maxCompleted = 0;
    let mostProductiveEmployee = { name: "", completedTasks: 0 };

    Object.entries(employeeStats).forEach(([name, stat]) => {
      if (stat.byStatus.completed > maxCompleted) {
        maxCompleted = stat.byStatus.completed;
        mostProductiveEmployee = { name, completedTasks: maxCompleted };
      }
    });

    setOverallStats({
      ...stats,
      mostProductiveEmployee: mostProductiveEmployee,
    });
    setTaskStats(employeeStats);
  }, []);

  return (
    <div className="mb-8 px-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
          Overall Task Performance & Analytics Dashboard
        </h1>
        <p className="mt-2 text-base text-gray-400 mb-6">
          Comprehensive overview of task distribution, completion metrics, and
          employee performance statistics across all departments
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Key Metrics */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-2 tracking-tight">{overallStats.total}</h3>
            <p className="text-blue-100 text-lg font-semibold">Total Tasks</p>
            <div className="mt-4 text-sm bg-white/20 rounded-lg p-2">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Average: {overallStats.averageTasksPerEmployee} per employee
              </p>
            </div>
          </div>
        </div>

        {/* Completion Status */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-2 tracking-tight">
              {overallStats.completionRate}%
            </h3>
            <p className="text-green-100 text-lg font-semibold">Completion Rate</p>
            <div className="mt-4 text-sm bg-white/20 rounded-lg p-2">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Completed: {overallStats.byStatus.completed} tasks
              </p>
            </div>
          </div>
        </div>

        {/* Urgent Matters */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-2 tracking-tight">
              {overallStats.urgentTasks}
            </h3>
            <p className="text-red-100 text-lg font-semibold">Urgent Tasks</p>
            <div className="mt-4 text-sm bg-white/20 rounded-lg p-2">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Overdue: {overallStats.overdue} tasks
              </p>
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-2 tracking-tight line-clamp-1">
              {overallStats.mostProductiveEmployee.name}
            </h3>
            <p className="text-purple-100 text-lg font-semibold">Top Performer</p>
            <div className="mt-4 text-sm bg-white/20 rounded-lg p-2">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Completed: {overallStats.mostProductiveEmployee.completedTasks} tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-8">
        {/* Priority Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 ml-4">
              Priority Distribution
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">High Priority</span>
                <span className="text-sm font-bold text-red-600">{overallStats.byPriority.high} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byPriority.high / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Medium Priority</span>
                <span className="text-sm font-bold text-yellow-600">{overallStats.byPriority.medium} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byPriority.medium / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Low Priority</span>
                <span className="text-sm font-bold text-green-600">{overallStats.byPriority.low} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byPriority.low / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 ml-4">
              Status Overview
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Completed</span>
                <span className="text-sm font-bold text-green-600">{overallStats.byStatus.completed} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byStatus.completed / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">In Progress</span>
                <span className="text-sm font-bold text-blue-600">{overallStats.byStatus["in progress"] + overallStats.byStatus.accepted} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((overallStats.byStatus["in progress"] + overallStats.byStatus.accepted) / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pending</span>
                <span className="text-sm font-bold text-yellow-600">{overallStats.byStatus.pending} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byStatus.pending / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Rejected</span>
                <span className="text-sm font-bold text-gray-600">{overallStats.byStatus.rejected} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byStatus.rejected / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Failed</span>
                <span className="text-sm font-bold text-gray-600">{overallStats.byStatus.failed} tasks</span>
              </div>
              <div className="relative w-full">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(overallStats.byStatus.failed / overallStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Statistics Cards */}
      <div className="mb-8 mt-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
          Employee Performance & Task Distribution Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(taskStats).map(([employee, stats]) => (
            <div
              key={employee}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{employee}</h3>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    stats.completionRate >= 70
                      ? "bg-green-300 text-green-800 group-hover:bg-green-400"
                      : stats.completionRate >= 40
                      ? "bg-yellow-300 text-yellow-800 group-hover:bg-yellow-400"
                      : "bg-red-300 text-red-800 group-hover:bg-red-400"
                  }`}
                >
                  {stats.completionRate}% Complete
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300">
                  <span className="text-gray-700 font-medium">Total Tasks</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stats.total}</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">
                    Priority Breakdown
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="text-red-600 text-lg font-bold mb-1">
                        {stats.byPriority.high}
                      </div>
                      <div className="text-xs font-medium text-gray-500">High</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="text-yellow-600 text-lg font-bold mb-1">
                        {stats.byPriority.medium}
                      </div>
                      <div className="text-xs font-medium text-gray-500">Medium</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="text-green-600 text-lg font-bold mb-1">
                        {stats.byPriority.low}
                      </div>
                      <div className="text-xs font-medium text-gray-500">Low</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">
                    Status Overview
                  </h4>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full transition-all duration-500 ease-out"
                      style={{
                        width: "100%",
                        background: `linear-gradient(to right, 
                             #10B981 0%,
                             #10B981 ${(stats.byStatus.completed / stats.total) * 100}%,
                             #3B82F6 ${(stats.byStatus.completed / stats.total) * 100}%,
                             #3B82F6 ${((stats.byStatus.completed + stats.byStatus["in progress"] + stats.byStatus.accepted) / stats.total) * 100}%,
                             #F59E0B ${((stats.byStatus.completed + stats.byStatus["in progress"] + stats.byStatus.accepted) / stats.total) * 100}%,
                             #F59E0B ${((stats.byStatus.completed + stats.byStatus["in progress"] + stats.byStatus.accepted + stats.byStatus.pending) / stats.total) * 100}%,
                             #6B7280 ${((stats.byStatus.completed + stats.byStatus["in progress"] + stats.byStatus.accepted + stats.byStatus.pending) / stats.total) * 100}%,
                             #6B7280 100%)`,
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mt-2 font-medium">
                    <div className="flex flex-col items-center">
                      <span className="text-green-600">{stats.byStatus.completed}</span>
                      <span>Completed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{stats.byStatus["in progress"] + stats.byStatus.accepted}</span>
                      <span>In Progress</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-yellow-600">{stats.byStatus.pending}</span>
                      <span>Pending</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-gray-600">{stats.byStatus.rejected}</span>
                      <span>Rejected</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors group-hover:shadow-md">
                    <span className="text-lg font-bold text-orange-600">
                      {stats.upcomingDue}
                    </span>
                    <span className="text-sm ml-2 text-orange-600 font-medium">due soon</span>
                  </div>
                  <div className="bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors group-hover:shadow-md">
                    <span className="text-lg font-bold text-red-600">{stats.overdue}</span>
                    <span className="text-sm ml-2 text-red-600 font-medium">overdue</span>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group-hover:shadow-md">
                    <span className="text-lg font-bold text-gray-600">{stats.byStatus.failed}</span>
                    <span className="text-sm ml-2 text-gray-600 font-medium">failed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
