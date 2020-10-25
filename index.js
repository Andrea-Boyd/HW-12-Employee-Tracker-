const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "056abg$%",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    startApp();
});

const prompt = inquirer.createPromptModule();

function startApp() {
    console.log();
    prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View departments, roles, and/ or employees",
            "Update employee roles",
            "Add departments, roles, and/ or employees"
        ]
    }).then(function (res) {
        switch (res.start) {
            case "View departments, roles, and/ or employees":
                viewChoices();
                break;

            case "Update employee roles":
                updateRoles();
                break;

            case "Add departments, roles, and/ or employees":
                addChoices();
                break;
        }
    })
};


function viewChoices() {
    prompt({
        name: "choices",
        type: "list",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees",
            "Return to Main Menu"
        ]
    }).then(function (res) {
        switch (res.choices) {
            case "Departments":
                displayDepartments();
                break;

            case "Roles":
                displayRoles();
                break;

            case "Employees":
                displayEmployees();
                break;
            
            case "Return to Main Menu":
                startApp();
                break;
        }
    })
};

function displayDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, async function(err, res) {
        if (err) throw err;
        let department = await res;
        console.table(department);
        startApp();
})};




