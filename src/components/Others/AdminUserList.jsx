"use client";

import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get employees data from localStorage
    const employeesData = JSON.parse(localStorage.getItem('employees') || '[]');
    const existingEmployeesData = JSON.parse(localStorage.getItem('existingEmployees') || '[]');
    
    // Get tasks data from localStorage
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '[]');

    // Combine all employee data
    const allEmployees = [...employeesData, ...existingEmployeesData];

    // Combine employee and task data
    const usersWithTasks = allEmployees.map(employee => {
      const userTasks = tasksData.filter(task => task.assignedTo === `${employee.firstName} ${employee.lastName}`);
      return {
        ...employee,
        tasks: userTasks
      };
    });

    setUsers(usersWithTasks);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            User Management
          </h1>
          <p className="mt-2 text-base text-gray-400">
            View and manage all users including their roles, departments and status
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300/50">
              <thead className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90">
                <tr>
                  <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 bg-white/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/90 transition-all duration-200 ease-in-out">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                          <span className="text-white font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{user.role}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.department}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(user.joinDate).format('MMM D, YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminUserList.propTypes = {
  loggedInUser: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    department: PropTypes.string,
    joinDate: PropTypes.string
  })
};

export default AdminUserList;
