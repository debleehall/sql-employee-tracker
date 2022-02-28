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
          console.log("\n");
          console.table(results);
          console.log("\n");
          console.log("\n");
          promptUser();
        });
        break;
      }

// ALL ROLES
      case "view all roles": {
        const sql = `SELECT * FROM employee_role;`;
        db.query(sql, (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.log("\n");
          console.table(results);
          console.log("\n");
          console.log("\n");
          promptUser();
        });
        break;
      }

// ALL EMPLOYEES
      case "view all employees": {
        const sql = `SELECT * FROM employee;`;
        db.query(sql, (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.log("\n");
          console.table(results);
          console.log("\n");
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
              message: "Enter name of department:",
            },
          ])
          .then(({ department }) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = [department];

            db.query(sql, params, (err, results) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Added ${department} to the database`);
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
              message: "Enter role title: ",
            },
            {
              type: "input",
              name: `salary`,
              message: `Enter the role's salary: `,
            },
          ])
          .then((answers) => {
            const { title, salary, department } = answers;
            const sql = `INSERT INTO employee_role (title, salary, department_id) VALUES (?,?,?)`;
            var id;

            const deptSql = `SELECT * FROM department;`;

            db.query(deptSql, (err, results) => {
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
                      //TODO: get role id and put into params
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

// ADD EMPLOYEE
      case "add new employee": {
        var params = [];

        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: `Please enter employee's first_name: `,
            },
            {
              type: "input",
              name: "last_name",
              message: `Please enter employee's last name`,
            },
          ])
          .then((answers) => {
            const { first_name, last_name } = answers;
            params.push(first_name);
            params.push(last_name);

            //get list of roles
            const sql = `SELECT * FROM employee_role;`;
            db.query(sql, (err, rows) => {
              if (err) {
                console.log(err);
              } else {
                var roles = [];
                rows.forEach((row) => {
                  roles.push(row.title);
                });

                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "role",
                      message: `Please select employee's role: `,
                      choices: roles,
                    },
                  ])
                  .then((answer) => {
                    const { role } = answer;
                    //TODO: get role id and put into params
                    rows.forEach((row) => {
                      if (row.title === role) {
                        params.push(row.id);
                      }
                    });

                    // get employee Names to get manager id.
                    const sql = `SELECT * FROM employee;`;
                    db.query(sql, (err, rows) => {
                      if (err) {
                        console.log(err);
                      } else {
                        var employees = [];
                        //create full names to select from
                        rows.forEach((row) => {
                          employees.push(
                            row.first_name + " " + row.last_name
                          );
                        });
                        //have user select manager name
                        inquirer
                          .prompt([
                            {
                              type: "list",
                              name: "manager",
                              message: `Please select employee's manager: `,
                              choices: employees,
                            },
                          ])
                          .then((answer) => {
                            const { manager } = answer;

                            //find ID for matching full name
                            rows.forEach((row) => {
                              if (
                                row.first_name + " " + row.last_name ===
                                manager
                              ) {
                                params.push(row.id);
                              }
                            });

                            //save to sql database
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`;
                            db.query(sql, params, (err, results) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log(
                                  `${first_name} ${last_name} has been added`
                                );
                                promptUser();
                              }
                            });
                          });
                      }
                    });
                  });
              }
            });
          });
        break;
      }

// UPDATE EMPLOYEE'S ROLE
      case "update an employee's role": {
        var paramEmployee;
        var paramRole;
        //display list of employees to update
        const listSql = "SELECT * FROM employee";
        db.query(listSql, (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            var employees = [];
            //create full names to select from
            rows.forEach((row) => {
              employees.push(row.first_name + " " + row.last_name);
            });
            //display list for selection
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employee",
                  message: `Which employee would you like to update? `,
                  choices: employees,
                },
              ])
              .then((answer) => {
                const { employee } = answer;

                //find ID for matching employee name
                rows.forEach((row) => {
                  if (row.first_name + " " + row.last_name === employee) {
                    paramEmployee = row.id;
                  }
                });

                  //get list of roles to update to
                  const sql = `SELECT * FROM employee_role;`;
                  db.query(sql, (err, rows) => {
                      if (err) {
                          console.log(err);
                      } else {
                          var roles = [];
                          rows.forEach((row) => {
                              roles.push(row.title);
                          });
                          inquirer
                              .prompt([
                                  {
                                      type: "list",
                                      name: "role",
                                      message: `Which role do you want to assign to the selected employee? `,
                                      choices: roles,
                                  },
                              ])
                              .then((answer) => {
                                  const { role } = answer;
                                  //TODO: get role id and put into params
                                  rows.forEach((row) => {
                                      if (row.title === role) {
                                          paramRole = row.id;
                                      }
                                  });

                                  //update employee
                                  const sql = `UPDATE employee SET role_id=? WHERE id=?;`
                                  const params = [paramRole, paramEmployee]

                                  db.query(sql, params, (err, results) => {
                                      if (err) {
                                          console.log(err);
                                      } else {
                                          console.log(`Updated employee's role`);
                                          promptUser();
                                      }
                                  })

                              });
                      }
                  });
              });
          }
        });
        break;
      }

// EXIT
      default: {
        process.exit(1);
      }
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      //promp couldnt be renedered in the current environment
      console.log("promp couldnt be renedered in the current environment");
    } else {
      //something else went wrong
      console.log("something else went wrong");
    }
  });
}

promptUser();
