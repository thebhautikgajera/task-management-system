"use client";

import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { AuthContext } from "../../context/AuthProvider";

const AdminAllTasklist = () => {
  const authData = useContext(AuthContext);
  
  // Load employees from localStorage or initialize empty array
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      return JSON.parse(savedEmployees);
    }
    return authData?.employees || [];
  });

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium", 
    category: "General",
    dueDate: moment().add(7, 'days').format('YYYY-MM-DD')
  });

  // Available categories
  const categories = [
    "General",
    "Development",
    "Design", 
    "Marketing",
    "Sales",
    "Support",
    "HR",
    "Finance", 
    "Operations"
  ];

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Load initial employees from authData if available
  useEffect(() => {
    if (authData?.employees && !localStorage.getItem('employees')) {
      setEmployees(authData.employees);
      localStorage.setItem('employees', JSON.stringify(authData.employees));
    }
  }, [authData?.employees]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert("Please fill in all required fields");
      return;
    }

    const task = {
      ...newTask,
      status: "pending"
    };

    const updatedTasks = [task, ...tasks]; // Changed to add new task at beginning
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Update employee's tasks in localStorage
    const updatedEmployees = employees.map(emp => {
      if (emp.name === task.assignedTo) {
        const newEmployeeTask = {
          taskTitle: task.title,
          taskDescription: task.description,
          priority: task.priority,
          category: task.category,
          deadline: task.dueDate,
          completed: false,
          active: false,
          status: task.status
        };

        return {
          ...emp,
          tasks: emp.tasks ? [newEmployeeTask, ...emp.tasks] : [newEmployeeTask] // Changed to add new task at beginning
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    setShowNewTaskModal(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "Medium",
      category: "General", 
      dueDate: moment().add(7, 'days').format('YYYY-MM-DD')
    });
  };

  const handleEditTask = () => {
    if (!editingTask.title || !editingTask.assignedTo) {
      alert("Please fill in all required fields");
      return;
    }

    // Preserve the original status when updating
    const updatedTask = {
      ...editingTask,
      status: selectedTask.status
    };

    const updatedTasks = tasks.map(task => {
      if (task.title === selectedTask.title && task.assignedTo === selectedTask.assignedTo) {
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Update employee's tasks in localStorage
    const updatedEmployees = employees.map(emp => {
      if (emp.name === updatedTask.assignedTo) {
        const updatedTasks = (emp.tasks || []).map(task => {
          if (task.taskTitle === selectedTask.title) {
            return {
              taskTitle: updatedTask.title,
              taskDescription: updatedTask.description,
              priority: updatedTask.priority,
              category: updatedTask.category,
              deadline: updatedTask.dueDate,
              completed: task.completed,
              active: task.active,
              status: task.status
            };
          }
          return task;
        });

        return {
          ...emp,
          tasks: updatedTasks
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setShowEditTaskModal(false);
    setEditingTask(null);
  };

  const handleUpdateStatus = (taskTitle, assignedTo, newStatus) => {
    // Update tasks array
    const updatedTasks = tasks.map(task => {
      if (task.title === taskTitle && task.assignedTo === assignedTo) {
        return {
          ...task,
          status: newStatus
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Update employee's tasks
    const updatedEmployees = employees.map(emp => {
      if (emp.name === assignedTo) {
        const updatedEmployeeTasks = emp.tasks.map(task => {
          if (task.taskTitle === taskTitle) {
            return {
              ...task,
              status: newStatus,
              completed: newStatus.toLowerCase() === 'completed',
              active: newStatus.toLowerCase() === 'in progress'
            };
          }
          return task;
        });

        return {
          ...emp,
          tasks: updatedEmployeeTasks
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const handleDeleteTask = (taskTitle, assignedTo) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const taskToDelete = tasks.find(task => task.title === taskTitle && task.assignedTo === assignedTo);
      const updatedTasks = tasks.filter(task => !(task.title === taskTitle && task.assignedTo === assignedTo));
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Remove task from employee's tasks in localStorage
      if (taskToDelete) {
        const updatedEmployees = employees.map(emp => {
          if (emp.name === taskToDelete.assignedTo) {
            return {
              ...emp,
              tasks: (emp.tasks || []).filter(task => task.taskTitle !== taskTitle)
            };
          }
          return emp;
        });
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      }
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowViewTaskModal(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setEditingTask({...task});
    setShowEditTaskModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  // Filter tasks based on search query and date range
  const filteredTasks = tasks.filter(task => {
    const searchStr = searchQuery ? searchQuery.toLowerCase() : '';
    const taskDate = moment(task.dueDate);
    const isInDateRange = (!startDate || taskDate.isSameOrAfter(startDate, 'day')) && 
                         (!endDate || taskDate.isSameOrBefore(endDate, 'day'));
    
    return (
      isInDateRange && (
        task.title.toLowerCase().includes(searchStr) ||
        task.description.toLowerCase().includes(searchStr) ||
        task.assignedTo.toLowerCase().includes(searchStr) ||
        task.category.toLowerCase().includes(searchStr) ||
        task.priority.toLowerCase().includes(searchStr) ||
        task.status.toLowerCase().includes(searchStr)
      )
    );
  });

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Task Management Dashboard</h1>
          <p className="mt-2 text-base text-gray-500">View and manage all tasks including their status, priority, assignees and due dates</p>
        </div>
        <button 
          onClick={() => setShowNewTaskModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
        >
          Add New Task
        </button>
      </div>

      {/* Search and Date Filter Bar */}
      <div className="mb-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-purple-500/20">
          <div className="flex flex-wrap gap-4">
            <div className="relative group flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-gray-100 px-4 py-2 pl-10 pr-10 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-400 hover:bg-white/20"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="relative group w-[180px]">
              <label className="absolute -top-2 left-2 bg-gray-900 px-1 text-xs text-purple-400 group-hover:text-purple-300 transition-colors duration-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/10 text-gray-100 px-3 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-white/20"
              />
            </div>
            
            <div className="relative group w-[180px]">
              <label className="absolute -top-2 left-2 bg-gray-900 px-1 text-xs text-purple-400 group-hover:text-purple-300 transition-colors duration-300">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/10 text-gray-100 px-3 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-white/20"
              />
            </div>

            {(searchQuery || startDate || endDate) && (
              <button
                onClick={handleClearSearch}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

       

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all duration-300 animate-modal-enter scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Edit Task</h2>
              <button 
                onClick={() => setShowEditTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Title *</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 shadow-sm"
                  placeholder="Enter task title"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full text-base text-gray-700 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 resize-none shadow-sm"
                  rows="4"
                  placeholder="Enter task description"
                />
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Assign To *</label>
                <select
                  value={editingTask.assignedTo}
                  onChange={(e) => setEditingTask({...editingTask, assignedTo: e.target.value})}
                  className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Category</label>
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                  className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                    className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Due Date</label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                    className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">Status</label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                  className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTask}
                className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create New Task</h2>
              <button 
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign To *</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Task Modal */}
       {showViewTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:shadow-indigo-500/10">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 py-2 border-b border-gray-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Task Details</h2>
              <button 
                onClick={() => setShowViewTaskModal(false)}
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
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Assigned To</h3>
                  <p className="text-gray-900 font-medium">{selectedTask.assignedTo}</p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Category</h3>
                  <p className="text-gray-900 font-medium">{selectedTask.category || "General"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
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

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-medium text-indigo-500 mb-2">Status</h3>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleUpdateStatus(selectedTask.title, selectedTask.assignedTo, e.target.value)}
                    className="w-full text-sm text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 cursor-pointer shadow-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium text-indigo-500 mb-2">
                  {selectedTask.status === "completed" ? "Completed Date" : "Due Date"}
                </h3>
                <p className="text-gray-900 font-medium">
                  {selectedTask.status === "completed" 
                    ? moment().format("MMM DD, YYYY")
                    : moment(selectedTask.dueDate).format("MMM DD, YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const daysRemaining = moment(task.dueDate).diff(moment(), 'days');
                  const isOverdue = daysRemaining < 0 && task.status.toLowerCase() !== "completed";
                  
                  return (
                    <tr key={`${task.title}-${task.assignedTo}`} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors duration-150" onClick={() => handleViewTask(task)}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {task.assignedTo.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">{task.assignedTo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {task.category || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                            task.status.toLowerCase() === "completed" ? "bg-green-500" :
                            task.status.toLowerCase() === "in progress" ? "bg-blue-500" :
                            "bg-red-500"
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                          {moment(task.dueDate).format("MMM DD, YYYY")}
                        </div>
                        <div className={`text-xs mt-1 ${isOverdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
                          {task.status.toLowerCase() === "completed" 
                            ? "Task completed"
                            : isOverdue 
                              ? `${Math.abs(daysRemaining)} days overdue` 
                              : `${daysRemaining} days remaining`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleOpenEditModal(task)}
                            className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center border border-indigo-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.title, task.assignedTo)}
                            className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center border border-red-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium">No tasks found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                      <button
                        onClick={handleClearSearch}
                        className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAllTasklist;
