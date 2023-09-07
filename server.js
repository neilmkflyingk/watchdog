const mysql = require('mysql2');
const inquirer = require('inquirer');

// DB connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);



function init () {
  inquirer.prompt({
    name: 'initialQuestion',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']

  }).then((answers) => {
    switch (answers.initialQuestion) {
      case 'view all departments':
        viewAllDepartments()
        break;
      case 'view all roles':
        viewAllRoles()
        break;
      case 'view all employees':
        viewAllEmployees()
        break;
      case 'add a department':
        addDepartment()
        break;
      case 'add a role':
        addRole()
        break;
      case 'add an employee':
        addEmployee()
        break;
      case 'update an employee role':
        updateEmployeeRole()
        break;
    }

  })
}

function viewAllDepartments () {
  console.log('Here are the departments');
}

function viewAllRoles () {
  console.log('Here are the rolls');
}

function viewAllEmployees () {
  console.log('Here are the employees');
}

function addDepartment () {
  console.log('');
}

function addRole () {
  console.log('');
}

function addEmployee () {
  console.log('');
}

function updateEmployeeRole () {
  console.log('');
}

init();