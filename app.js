const { param } = require("express/lib/request");
const res = require("express/lib/response");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require('console.table');

//connect to db
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Di$ney4life",
      database: "employee_tracker",
    },
    console.log("Connected to the employee_tracker database.")
);

function promptUser() {
  inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add department",
        "add new role",
        "add new employee",
        "update an employee's role",
        "exit",
      ],
    },
  ])

}

promptUser();