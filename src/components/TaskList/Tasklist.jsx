"use client";

import AcceptTask from './AcceptTask';
import NewTask from './NewTask';
import FailedTask from './FailedTask';
import CompleteTask from './CompleteTask';
import RejectedTask from './RejectedTask';
import DiscussionPanel from './DiscussionPanel';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Tasklist = ({ loggedInUser }) => {
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new', label: 'New Tasks', component: <NewTask loggedInUser={loggedInUser} /> },
    { id: 'active', label: 'Active Tasks', component: <AcceptTask loggedInUser={loggedInUser} /> },
    { id: 'completed', label: 'Completed Tasks', component: <CompleteTask loggedInUser={loggedInUser} /> },
    { id: 'failed', label: 'Failed Tasks', component: <FailedTask loggedInUser={loggedInUser} /> },
    { id: 'rejected', label: 'Rejected Tasks', component: <RejectedTask loggedInUser={loggedInUser} /> },
    { id: 'discussion', label: 'Discussion', component: <DiscussionPanel /> }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

Tasklist.propTypes = {
  loggedInUser: PropTypes.shape({
    tasks: PropTypes.arrayOf(PropTypes.shape({
      taskTitle: PropTypes.string,
      taskDescription: PropTypes.string,
      assignedDate: PropTypes.string,
      deadline: PropTypes.string,
      active: PropTypes.bool,
      priority: PropTypes.string
    }))
  }).isRequired
};

export default Tasklist;