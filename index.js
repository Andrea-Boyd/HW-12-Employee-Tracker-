const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
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

function displayRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, async function(err, res) {
        if (err) throw err;
        let role = await res;
        console.table(role);
        startApp();
})};

function displayEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, async function(err, res) {
        if (err) throw err;
        let employee = await res;
        console.table(employee);
        startApp();
})};

var roleArr= [];
var nameArr= [];
function preLoad() {
    roleArr = [];
    nameArr = [];
    let query = "SELECT * FROM employee";
    connection.query(query, async function (err, res) {
        if (err) throw err;
        let employee = await res;
        for (i=0; i<employee.length; i++) {
            nameArr.push(employee[i].first_name + " " + employee[i].last_name)
        }
    })

    let queryTwo = "SELECT * FROM role";
    connection.query(queryTwo, async function(err, res) {
        if(err) throw err;
        let role = await res;
        for (j=0; j<role.length; j++){
            roleArr.push(role[j].title)
        }
    })
};

preLoad();

function updateRoles() {
    prompt({
        name: "update",
        type: "list",
        message: "Which employee would you like to update?",
        choices: nameArr
    }).then(function (resName) {
        prompt ({
        name: "role",
        type: "list",
        message: "What would you like to view?",
        choices: roleArr
    }).then(function (resRole) {
        var employeeID = nameArr.indexOf(resName.update) +1;
        var roleID = roleArr.indexOf(resRole.role) +1;
        updateRoleTable(employeeID, roleID)
    })
})
};

function updateRoleTable(name, role) {
    let query = "UPDATE employee SET role_id = ? WHERE employee.id = ?"
    connection.query(query, [role, name], (err, res) => {
        if(err) throw err;
        console.log("\nUpdated, bro");
        // preLoad();
        startApp();
    })
};






