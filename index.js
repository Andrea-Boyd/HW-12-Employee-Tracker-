const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: " ",
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
    connection.query(query, async function (err, res) {
        if (err) throw err;
        let department = await res;
        console.table(department);
        startApp();
    })
};

function displayRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, async function (err, res) {
        if (err) throw err;
        let role = await res;
        console.table(role);
        startApp();
    })
};

function displayEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, async function (err, res) {
        if (err) throw err;
        let employee = await res;
        console.table(employee);
        startApp();
    })
};

var roleArr = [];
var nameArr = [];
function preLoad() {
    roleArr = [];
    nameArr = [];
    let query = "SELECT * FROM employee";
    connection.query(query, async function (err, res) {
        if (err) throw err;
        let employee = await res;
        for (i = 0; i < employee.length; i++) {
            nameArr.push(employee[i].first_name + " " + employee[i].last_name)
        }
    })

    let queryTwo = "SELECT * FROM role";
    connection.query(queryTwo, async function (err, res) {
        if (err) throw err;
        let role = await res;
        for (j = 0; j < role.length; j++) {
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
        prompt({
            name: "role",
            type: "list",
            message: "What role would you like to assign this employee?",
            choices: roleArr
        }).then(function (resRole) {
            var employeeID = nameArr.indexOf(resName.update) + 1;
            var roleID = roleArr.indexOf(resRole.role) + 1;
            updateRoleTable(employeeID, roleID)
        })
    })
};

function updateRoleTable(name, role) {
    let query = "UPDATE employee SET role_id = ? WHERE employee.id = ?"
    connection.query(query, [role, name], (err, res) => {
        if (err) throw err;
        console.log("\nUpdated, bro");
        // preLoad();
        startApp();
    })
};

function addChoices() {
    prompt({
        name: "add",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "New Department",
            "New Role",
            "New Employee",
            "Return to Main Menu"
        ]
    }).then(function (res) {
        switch (res.add) {
            case "New Department":
                addNewDepartment();
                break;

            case "New Role":
                addNewRole();
                break;

            case "New Employee":
                addNewEmployee();
                break;

            case "Return to Main Menu":
                startApp();
                break;
        }
    })
};



function addNewDepartment() { 

        prompt({
            name: "name",
            type: "input",
            message: "Enter the Name of the New Department: "
        
        }).then(function (res) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: res.name,
                },
                function (err) {
                    if (err) throw err;
                    startApp();
                }
            );
        });
    };



function addNewRole() {
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        var depts = res;

        prompt([{
            name: "title",
            type: "input",
            message: "Enter the Title of the new Role: "
        },
        {
            name: "salary",
            type: "input",
            message: "Enter the Salary for this new Role: "
        },
        {
            name: "id",
            type: "list",
            message: "Select the Department to which the new Role will Belong: ",
            choices: depts.map(({id, name}) => ({name: name, value: id}))
        }]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: res.id
                },
                function (err) {
                    if (err) throw err;
                    startApp();
                }
            );
        });
    });
};


function addNewEmployee() {
    let query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        var roles = res;

    let query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        var emps = res;

        prompt([{
            name: "first",
            type: "input",
            message: "Enter the Employee's First Name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the Employee's Last Name: "
        },
        {
            name: "role",
            type: "list",
            message: "Select the Role to which the new Employee will Belong: ",
            choices: roles.map(({id, title}) => ({name: title, value: id}))
        },
        {
            name: "manager",
            type: "list",
            message: "Select the Manager to which the new Employee will Report: ",
            choices: emps.map(({id, first_name, last_name}) => ({name: [first_name + " " + last_name], value: id}))
        }
    
    ]).then(function (res) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: res.first,
                    last_name: res.last,
                    role_id: res.role,
                    manager_id: res.manager
                },
                function (err) {
                    if (err) throw err;
                    startApp();
                }
            );
        });
    });
});
};


