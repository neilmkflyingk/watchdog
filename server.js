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

// query roles to be called later
async function queryRoles() {
  return new Promise((resolve, reject) => {
    db.query('select * from role', function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

//query employees to be called later
async function queryEmployees() {
  return new Promise((resolve, reject) => {
    db.query('select * from employee', function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

//query departments to be called later
async function queryDepartments() {
  return new Promise((resolve, reject) => {
    db.query('select * from department', function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

// function containing program
function init () {
  //initial question
  inquirer.prompt({
    name: 'initialQuestion',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'view all departments', 
      'view all roles', 
      'view all employees', 
      'add a department', 
      'add a role', 
      'add an employee', 
      'update an employee role', 
      'EXIT'
    ]
  }).then((answers) => {
    // calls function according to user response
    switch (answers.initialQuestion) {
      case 'view all departments':
        viewAllDepartments();
        break;
      case 'view all roles':
        viewAllRoles();
        break;
      case 'view all employees':
        viewAllEmployees();
        break;
      case 'add a department':
        addDepartment();
        break;
      case 'add a role':
        addRole();
        break;
      case 'add an employee':
        addEmployee();
        break;
      case 'update an employee role':
        updateEmployeeRole();
        break;
      case 'EXIT':
        db.end();
        break;
      default:
        break;
    }

  })
}

// shows department table
function viewAllDepartments () {
  db.query('select * from department', function (err,res) {
    console.log('Here are the departments');
    console.table(res);
    init();
  }) 
}

// shows role table
function viewAllRoles () {
  db.query('select * from role', function (err,res) {
    console.log('Here are the roles');
    console.table(res);
    init();
  }) 
}

// shows employee table
function viewAllEmployees () {
  db.query('select * from employee', function (err, res) {
    console.log('Here are the employees');
    console.table(res);
    init();
  })
}

// adds new department to department table
function addDepartment () {
  inquirer.prompt({
    type: 'input',
    name: 'newDeptName',
    message: 'Enter the New Department Name',
}).then((answer) => {
  db.query('INSERT INTO department SET ?',
    {name: answer.newDeptName},
    function (err) {
        if (err) throw err;
        init();
      }
    )
  })
}

// ads role to role table
async function addRole () {
  const departments = await queryDepartments();
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the title of the new role?'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the salary of the new role?'
    },
    {
      name: 'departmentId',
      type: 'list',
      message: 'What is the department id for the new role?',
      choices: departments.map((department) => ({name: department.name, value: department.id}))
    },
  ]).then((answers) => {
    db.query('INSERT INTO role SET ?',
      {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.departmentId,
      },
      function (err) {
        if (err) throw err;
        init();
      }
    )
  })
}

// adds employee to employee table
async function addEmployee () {
  const roles = await queryRoles()
  const employees = await queryEmployees()
  inquirer.prompt([
    {
      name: 'firstName',
      type: 'input',
      message: 'What is the new employees first name?'
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'What is the new employees last name?'
    },
    {
      name: 'roleId',
      type: 'list',
      message: 'What is the new employees role?',
      choices: roles.map((role) => ({name: role.title, value: role.id}))
    },
    {
      name: 'managerId',
      type: 'input',
      message: 'What is the new employees manager id?',
    },
  ]).then((answers) => {
    db.query('INSERT INTO employee SET ?',
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: answers.roleId,
        manager_id: answers.managerId
      },
      function (err) {
        if (err) throw err;
        init();
      }
    )
  })
}

// changes an employees role in employee table
async function updateEmployeeRole () {
  const roles = await queryRoles();
  const employees = await queryEmployees();
  inquirer.prompt([
    {
      name: 'employeeToUpdate',
      message: 'Which employees role would you like to update?',
      type: 'list',
      choices: employees.map((employee) => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}))
    },
    {
      name: 'roleId',
      type: 'list',
      message: 'What is the employees new role?',
      choices: roles.map((role) => ({name: role.title, value: role.id})),
    }
  ]).then((answers) => {
    db.query('UPDATE employee SET ? WHERE ?',
      [
        {
          role_id: answers.roleId,
        },
        {
          id: answers.employeeToUdate,
        }
      ],
      function (err) {
        if (err) throw err;
        init();
      }
    )
  })
}

// initializes program when node server ran
init();