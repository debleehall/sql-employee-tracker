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
  .then((answers) => {
    var endProgram = false;
    switch (answers.action) {

// ALL DEPARTMENTS
      case "view all departments": {
        const sql = `SELECT * FROM department;`;
        db.query(sql, (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
          console.log("\n");
          promptUser();
        });
        break;
      }

// ALL ROLES
      case "view all roles": {
        const sql = `SELECT * FROM employee_role;`;
        db.query(sql, (err, results) =>{
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
          console.log("\n");
          promptUser();
        });
        break;
      }
      case "view all employees": {
        const sql = `SELECT * FROM employee;`;
        db.query(sql, (err, results) =>{
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
          console.log("\n");
          promptUser();
        });
        break;
      }

// ADD DEPARTMENT
      case "add department": {
        inquirer
        .prompt([
          {
            type: "input",
            name: "department",
            message: "name of department:",
          },
        ])
        .then(({ department }) => {
          const sql = `INSERT INTO department (name) VALUES (?)`;
          const params = [department];

          db.query(sql, params, (err, results) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`added ${department} to the database`);
              promptUser();
            }
          });
        });
        break;
      }

// ADD ROLE
      case "add new role": {
        inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "role title:",
          },
          {
            type: "input",
            name: "salary",
            message: "role's salary:",
          },
        ])
        .then((answers) => {
          const { title, salary, department } = answers;
          const sql = `INSERT INTO employee_role (title, salary, department_id) VALUES (?,?,?)`;
          var id;
          const deptsql = `SELECT * FROM department`;

          db.query(deptsql, (err,results) => {
            if (err) {
              console.log(err);
            } else {
              inquirer
              .prompt({
                type: "list",
                message: "Select department: ",
                name: "department",
                choices: results,
              })
              .then((input) => {
                const { department } = input;
                results.forEach((row) => {
                  if (row.name === department) {
                    id = row.id;
                  }
                });
              const params = [title, salary, id];
              db.query(sql, params, (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`Added ${title} to the database`);
                  promptUser();
                }
              });
              });
            }
          });
        });
        break;
      }
      case "add new employee":
    }
  })
}

promptUser();

// "add department"
// "add new role"
// "add new employee"
// "update an employee's role"
// "exit"