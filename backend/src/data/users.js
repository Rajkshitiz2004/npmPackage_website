'use strict';

// 60 realistic sample users for search, filtering, and pagination
const roles = ['Admin', 'Developer', 'Designer', 'Product Manager', 'QA Engineer', 'DevOps Specialist'];
const departments = ['Engineering', 'Design', 'Product', 'Infrastructure', 'Security'];

const users = Array.from({ length: 60 }, (_, index) => {
  const id = index + 1;
  const firstNames = [
    'Aarav', 'Ananya', 'Rohan', 'Priya', 'Kabir', 'Aditi', 'Vikram', 'Tanvi', 'Siddharth', 'Ishita',
    'Arjun', 'Sneha', 'Rahul', 'Neha', 'Dev', 'Kavya', 'Reyansh', 'Meera', 'Rishi', 'Diya'
  ];
  const lastNames = [
    'Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Iyer', 'Kapoor', 'Nair', 'Singh', 'Chopra',
    'Bose', 'Gupta', 'Malhotra', 'Deshmukh', 'Joshi'
  ];

  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@devflow.io`;
  const role = roles[index % roles.length];
  const department = departments[index % departments.length];

  return {
    id,
    name,
    email,
    role,
    department,
    isActive: index % 7 !== 0,
    createdAt: new Date(Date.now() - (60 - index) * 86400000).toISOString()
  };
});

module.exports = { users };
