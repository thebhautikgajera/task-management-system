import moment from 'moment';

const employeesData = [
    {
      "id": 101,
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe", 
      "email": "john.doe@company.com",
      "password": "123",
      "department": "Finance",
      "role": "Financial Analyst",
      "joinDate": moment("2023-01-15").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Prepare monthly report",
          "taskDescription": "Compile the sales and revenue data for the last month.",
          "deadline": moment().add(19, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Reporting",
          "active": true,
          "newTask": false,
          "completed": false,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Team meeting",
          "taskDescription": "Participate in the weekly team sync-up.",
          "deadline": moment().add(17, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Meetings", 
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "Low"
        }
      ],
      "taskCount": {
        "active": 2,
        "new": 1,
        "completed": 0,
        "failed": 0
      }
    },
    {
      "id": 102,
      "firstName": "Jane",
      "lastName": "Smith",
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "password": "123",
      "department": "Human Resources",
      "role": "HR Manager",
      "joinDate": moment("2023-02-01").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Update client database",
          "taskDescription": "Ensure all client contact information is up-to-date.",
          "deadline": moment().add(18, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Database Management",
          "active": false,
          "newTask": true,
          "completed": true,
          "failed": false,
          "priority": "Medium"
        },
        {
          "taskTitle": "Onboard new employee",
          "taskDescription": "Assist with orientation for the new hire.",
          "deadline": moment().add(20, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "HR",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "High"
        }
      ],
      "taskCount": {
        "active": 1,
        "new": 2,
        "completed": 1,
        "failed": 0
      }
    },
    {
      "id": 103,
      "firstName": "Michael",
      "lastName": "Brown",
      "name": "Michael Brown",
      "email": "michael.brown@company.com", 
      "password": "123",
      "department": "Engineering",
      "role": "Software Developer",
      "joinDate": moment("2023-03-15").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Fix website bugs",
          "taskDescription": "Resolve issues reported in the feedback section.",
          "deadline": moment().add(21, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Development",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Conduct user testing",
          "taskDescription": "Organize and evaluate the outcomes of testing.",
          "deadline": moment().add(23, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Quality Assurance",
          "active": false,
          "newTask": true,
          "completed": false,
          "failed": true,
          "priority": "Medium"
        }
      ],
      "taskCount": {
        "active": 1,
        "new": 2,
        "completed": 0,
        "failed": 1
      }
    },
    {
      "id": 104,
      "firstName": "Emily",
      "lastName": "Davis",
      "name": "Emily Davis",
      "email": "emily.davis@company.com",
      "password": "123",
      "department": "Design",
      "role": "Senior Designer",
      "joinDate": moment("2023-04-01").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Design logo concepts",
          "taskDescription": "Create three design options for the new brand logo.",
          "deadline": moment().add(25, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Design",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Prepare client pitch",
          "taskDescription": "Develop a compelling presentation for the upcoming pitch.",
          "deadline": moment().add(19, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Sales",
          "active": false,
          "newTask": false,
          "completed": true,
          "failed": false,
          "priority": "High"
        }
      ],
      "taskCount": {
        "active": 1,
        "new": 1,
        "completed": 1,
        "failed": 0
      }
    },
    {
      "id": 105,
      "firstName": "Daniel",
      "lastName": "Jones",
      "name": "Daniel Jones",
      "email": "daniel.jones@company.com",
      "password": "123",
      "department": "Operations",
      "role": "Operations Manager",
      "joinDate": moment("2023-05-15").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Inventory management",
          "taskDescription": "Check and update the inventory stock levels.",
          "deadline": moment().add(22, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Operations",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "Medium"
        },
        {
          "taskTitle": "Coordinate vendor meeting",
          "taskDescription": "Set up a meeting with vendors to discuss supply chain issues.",
          "deadline": moment().add(21, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Logistics",
          "active": false,
          "newTask": false,
          "completed": false,
          "failed": true,
          "priority": "Low"
        }
      ],
      "taskCount": {
        "active": 1,
        "new": 1,
        "completed": 0,
        "failed": 1
      }
    },
    {
      "id": 106,
      "firstName": "Test",
      "lastName": "Employee",
      "name": "Test Employee",
      "email": "employee@company.com",
      "password": "123",
      "department": "Marketing",
      "role": "Marketing Specialist",
      "joinDate": moment("2023-06-01").format("MMM D, YYYY"),
      "tasks": [
        {
          "taskTitle": "Marketing campaign planning",
          "taskDescription": "Develop strategy for Q1 2024 marketing initiatives.",
          "deadline": moment().add(24, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Social media content creation",
          "taskDescription": "Create and schedule content for next month's social media posts.",
          "deadline": moment().add(27, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": true,
          "newTask": true,
          "completed": false,
          "failed": false,
          "priority": "Medium"
        },
        {
          "taskTitle": "Email newsletter campaign",
          "taskDescription": "Complete the monthly email newsletter campaign.",
          "deadline": moment().subtract(2, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(10, 'days').format('YYYY-MM-DD'),
          "completedDate": moment().subtract(1, 'days').format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": false,
          "newTask": false,
          "completed": true,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Website redesign project",
          "taskDescription": "Complete the website redesign for Q4 launch.",
          "deadline": moment().subtract(5, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(30, 'days').format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": false,
          "newTask": false,
          "completed": false,
          "failed": true,
          "priority": "High"
        },
        {
          "taskTitle": "Brand guidelines update",
          "taskDescription": "Update company brand guidelines with new visual elements.",
          "deadline": moment().subtract(3, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(15, 'days').format('YYYY-MM-DD'),
          "completedDate": moment().subtract(2, 'days').format('YYYY-MM-DD'),
          "category": "Research",
          "active": false,
          "newTask": false,
          "completed": true,
          "failed": false,
          "priority": "Medium"
        },
        {
          "taskTitle": "Marketing analytics report",
          "taskDescription": "Generate comprehensive Q4 marketing performance report.",
          "deadline": moment().subtract(4, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(20, 'days').format('YYYY-MM-DD'),
          "completedDate": moment().subtract(3, 'days').format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": false,
          "newTask": false,
          "completed": true,
          "failed": false,
          "priority": "High"
        },
        {
          "taskTitle": "Customer feedback analysis",
          "taskDescription": "Analyze Q4 customer feedback and prepare improvement recommendations.",
          "deadline": moment().subtract(6, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(25, 'days').format('YYYY-MM-DD'),
          "category": "Research",
          "active": false,
          "newTask": false,
          "completed": false,
          "failed": true,
          "priority": "High"
        },
        {
          "taskTitle": "SEO optimization project",
          "taskDescription": "Implement SEO improvements across all marketing channels.",
          "deadline": moment().subtract(8, 'days').format('YYYY-MM-DD'),
          "assignedDate": moment().subtract(28, 'days').format('YYYY-MM-DD'),
          "category": "Marketing",
          "active": false,
          "newTask": false,
          "completed": false,
          "failed": true,
          "priority": "Medium"
        }
      ],
      "taskCount": {
        "active": 2,
        "new": 2,
        "completed": 3,
        "failed": 3
      }
    }
];

const adminData = [
    {
      "id": 1,
      "firstName": "Admin",
      "lastName": "User",
      "name": "Admin User",
      "email": "admin@company.com",
      "password": "123"
    }
];

export const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employeesData));
  localStorage.setItem("admin", JSON.stringify(adminData));
};

export const getLocalStorage = () => {
  return {
    employees: JSON.parse(localStorage.getItem("employees")) || employeesData,
    admin: JSON.parse(localStorage.getItem("admin")) || adminData
  };
};
