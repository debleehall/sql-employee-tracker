//connect to db
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: process.env.DB_PW,
      database: "employee_tracker",
    },
    console.log("Connected to the employee_tracker database.")
);
