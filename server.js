const connection = require('./config/connection');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

// Initial Prompt
const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select an pathway:',
            choices: [
                'View all Employees',
                'View all Roles',
                'View all Departments',
                'View all Employees by Department',
                'View Department Budgets',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Quit',
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;
            if (choices === 'View All Employees') {
                viewAllEmployees();
            }
            if (choices === 'View all Departments') {
                viewAllDepartments();
            }
            if (choices === 'View all Employees by Department') {
                viewEmployeesByDepartment();
            }
            if (choices === 'Add Employee') {
                addEmployee();
            }
            if (choices === 'Remove Employee') {
                removeEmployee();
            }
            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }
            if (choices === 'Update Employee Manager') {
                updateEmployeemanager();
            }
            if (choices === 'View all Roles') {
                viewAllRoles();
            }
            if (choices === 'Add Role') {
                addRole();
            }
            if (choices === 'Removw Role') {
                removeRole();
            }
            if (choices === 'Add Department') {
                addDepartment();
            }
            if (choices === 'View Department Budgets') {
                viewDepartmentBudget();
            }
            if (choices === 'Remove Department') {
                removeDepartment();
            }
            if (choices === 'Quit') {
                connection.end()
            }
        });
};

// View All Employees
const viewAllEmployees = () => {
    let sql = `
    SELECT employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.department_name AS 'department,
    role.salary
    FROM employee, role, department
    WHERE department.id = role.department_id
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`;
    connection.promise().query(sql, (err, response) => {
        if (err) throw err;
        console.log(`=====================================================`);
        console.log(`Current Employees:`);
        console.log(`=====================================================`);
        console.table(response);
        console.log(`=====================================================`);
        promptUser();
    });
};

// View all Roles
const viewAllRoles = () => {
    console.log(`=====================================================`);
    console.log(`Current Employee Roles:`);
    console.log(`=====================================================`);
    const sql = `
SELECT role.id,
role.title,
deparment.department_name AS department
FROM role
INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (err, response) => {
        if (err) throw err;
        response.forEach((role) => { console.log(role.title); });
        console.log(`=====================================================`);
        promptUser();
    });
};
// View all Departments
const viewAllDepartments = () => {
    const sql = `
    SELECT department.id AS id,
    department.department_name AS department
    FROM department`;
    connection.promise().query(sql, (err, response) => {
        if (err) throw err;
        console.log(`=====================================================`);
        console.log(`All Departments:`);
        console.log(`=====================================================`);
        console.table(response);
        console.log(`=====================================================`);
        promptUser();
    });
};

// View all Employees by Department
const viewEmployeesByDepartments = () => {
    const sql = `
    SELECT employee.first_name,
    employee.last_name,
    department.department_name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (err, response) => {
        if (err) throw err;
        console.log(`=====================================================`);
        console.log(`Employees by Department:`);
        console.log(`=====================================================`);
        console.table(response);
        console.log(`=====================================================`);
        promptUser();
    });
};

// View all Departments by Budget
const viewDepartmentBudget = () => {
    console.log(`=====================================================`);
    console.log(`Budget By Department:`);
    console.log(`=====================================================`);
    const sql = `
    SELECT department_id AS id,
    department.department_name AS department,
    SUM(salary) AS budget
    FROM role
    INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id
    `;
    connection.query(sql, (err, response) => {
        if (err) throw err;
        console.table(response);
        console.log(`=====================================================`);
        promptUser();
    });
};
// Add an Employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?'
        }
    ])
        .then(answer => {
            const name = [answer.firstName, answer.lastName]
            const roleSql = `SELECT role.id, role.title FROM role`;
            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ id, title }) => ({ name: title, valie: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        name.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw (err);
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    name.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                                    connection.suery(sql, name, (err) => {
                                        if (err) throw err;
                                        console.log("Employee has been added")
                                        viewAllEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};
// Add a Role
const addRole = () => {
    const sql = `
    SELECT * FROM department`
    connection.promiser().query(sql, (err, response) => {
        if (err) throw err;
        let deptArray = [];
        response.forEach((department) => {deptArray.push(department.department_name);});
        deptArray.push('Create Department');
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'Which department is theis new role in?',
                choices: deptArray
            }
        ])
        .then((answer) => {
            if(answer.departmentName === 'Create Department') {
                this.addDepartment();
            } else {
                addRoleResume(answer);
            }
        });
        const addRoleResume = (departmentData) => {
            inquierer.prompt([
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'What is the name of the new role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of the new role?'
                },
            ])
            .then((answer) => {
                let createdRole = answer.newRole;
                let departmentId;
                response.forEach((department) => {
                    if(departmentData.departmentName === department.department.name) {departmentId = department.id;}                })
            });
            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let crit = [createdRole, answer.salary, departmentId];
            connection.promise().query(sql, crit, (err) => {
                if (er) throw err;
                console.log(`=====================================================`);
                console.log(`Role successfully created!`);
                console.log(`=====================================================`);
                viewAllRoles();
            });
        };
    });
};

// Add a Department

//Update an Employee's Role

// Update an Employee's Manager

// Delete an Employee

// Delete a Role

// Delete a Department