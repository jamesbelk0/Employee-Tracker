const connection = require('./config/connection');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Initial Prompt
connection.connect((error) => {
    if (error) throw error;
    console.log(`=====================================================`);
    console.log(`Employee Tracker`);
    console.log(`By: James Belk`);
    console.log(`=====================================================`);
    promptUser();
})
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
            console.log(choices);
            if (choices === 'View all Employees') {
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
                updateEmployeeManager();
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
    department.department_name AS department,
    role.salary
    FROM employee, role, department
    WHERE department.id = role.department_id
    AND role.id = employee.role_id
    ORDER BY employee.id ASC;
    `
    connection.query(sql, (error, response) => {
        if (error) throw error;
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
department_name AS department
FROM role
INNER JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((role) => { console.log(role.title); });
        console.log(`=====================================================`);
        promptUser();
    });
};
// // View all Departments
const viewAllDepartments = () => {
    const sql = `
    SELECT department.id AS id,
    department_name AS department
    FROM department`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        console.log(`=====================================================`);
        console.log(`All Departments:`);
        console.log(`=====================================================`);
        console.table(response);
        console.log(`=====================================================`);
        promptUser();
    });
};
// // View all Employees by Department
const viewEmployeesByDepartment = () => {
    const sql = `
    SELECT employee.first_name,
    employee.last_name,
    department_name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
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
    connection.query(sql, (error, response) => {
        if (error) throw error;
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
            connection.query(roleSql, (error, data) => {
                if (error) throw error;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
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
                        connection.query(managerSql, (error, data) => {
                            if (error) throw (error);
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
                                    connection.query(sql, name, (error) => {
                                        if (error) throw error;
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
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let deptArray = [];
        response.forEach((department) => { deptArray.push(department.department_name); });
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
                if (answer.departmentName === 'Create Department') {
                    this.addDepartment();
                } else {
                    addRoleResume(answer);
                }
            });
        const addRoleResume = (departmentData) => {
            inquirer.prompt([
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
                        if (departmentData.departmentName === department.department_name) { departmentId = department.id; }
                    });

                    let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    let crit = [createdRole, answer.salary, departmentId];
                    connection.query(sql, crit, (error) => {
                        if (error) throw error;
                        console.log(`=====================================================`);
                        console.log(`Role successfully created!`);
                        console.log(`=====================================================`);
                        viewAllRoles();
                    });
                });
        };
    });
};
// Add a Department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of your new Department?',
        }
    ])
        .then((answer) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            connection.query(sql, answer.newDepartment, (error, response) => {
                if (error) throw error;
                console.log(`=====================================================`);
                console.log(answer.newDepartment + ` Department successfully created!`);
                console.log(`=====================================================`);
                viewAllDepartments();
            });
        });
};
//Update an Employee's Role
const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name} ${employee.last_name}`); });

        let sql = `SELECT role.id, role.title FROM role`;
        connection.query(sql, (error, response) => {
            if (error) throw error;
            let rolesArray = [];
            response.forEach((role) => { rolesArray.push(role.title); });

            inquirer.prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee has a new role>',
                    choices: employeeArray
                },
                {
                    name: 'chosenRole',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: rolesArray
                }
            ])
                .then((answer) => {
                    let newTitleId, employeeId;
                    response.forEach((role) => {
                        if (answer.chosenRole === role.title) {
                            newTitleId = role.id;
                        }
                    });
                    response.forEach((employee) => {
                        if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                            employeeId = employee.id;
                        }
                    });
                    let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                    connection.query(
                        sqls,
                        [newTitleId, employeeId], (error) => {
                            if (error) throw error;
                            console.log(`=====================================================`);
                            console.log(`Employee Role Updated`);
                            console.log(`=====================================================`);
                            promptUser();
                        }
                    );
                });
        });
    });
};
// Update an Employee's Manager
const updateEmployeeManager = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name} ${employee.last_name}`); });
        inquirer.prompt([
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee has a new manager?',
                choices: employeeArray
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who is their manager?',
                choices: employeeArray
            }
        ])
            .then((answer) => {
                let employeeId, managerId;
                response.forEach((employee) => {
                    if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                        employeeId = employee.id;
                    }
                    if (answer.newManager === `${employee.first_name} ${employee.last_name}`) {
                        managerId = employee.id;
                    }
                });
                let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`
                connection.query(sql, [managerId, employeeId], (error) => {
                    if (error) throw error;
                    console.log(`=====================================================`);
                    console.log(`Employee Manager Updated`);
                    console.log(`=====================================================`);
                    promptUser();
                });
            });
    });
};
// Delete an Employee
const removeEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => { employeeArray.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer.prompt([
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employeeArray
            }
        ])
            .then((answer) => {
                let employeeId;
                response.forEach((employee) => {
                    if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                        employeeId = employee.id;
                    }
                });

                let sql = `DELETE FROM employee
            WHERE employee.id = ?`;
                connection.query(sql, [employeeId], (error) => {
                    if (error) throw error;
                    console.log(`=====================================================`);
                    console.log(`Employee Removed`);
                    console.log(`=====================================================`);
                    viewAllEmployees();
                });
            });
    });
};
// Delete a Role
const removeRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let roleTitleArray = [];
        response.forEach((role) => { roleTitleArray.push(role.title); });

        inquirer.prompt([
            {
                name: 'chosenRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: roleTitleArray
            }
        ])
            .then((answer) => {
                let roleId;
                response.forEach((role) => {
                    if (answer.chosenRole === role.title) {
                        roleId = role.id;
                    }
                });
                let sql = `DELETE FROM role WHERE role.id = ?`;
                connection.query(sql, [roleId], (error) => {
                    if (error) throw error;
                    console.log(`=====================================================`);
                    console.log(`Role Removed`);
                    console.log(`=====================================================`);
                    viewAllRoles();
                });
            });
    });
};
// Delete a Department
const removeDepartment = () => {
    let sql = `SELECT department.id, department.department_name FROM department`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let departmentArray = [];
        response.forEach((department) => { departmentArray.push(department.department_name); });

        inquirer.prompt([
            {
                name: 'chosenDept',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: departmentArray
            }
        ])
            .then((answer) => {
                let departmentId;
                response.forEach((department) => {
                    if (answer.chosenDept === department.department_name) {
                        departmentId = department.id;
                    }
                });
                let sql = `DELETE FROM department WHERE department.id = ?`;
                connection.query(sql, [departmentId], (error) => {
                    if (error) throw error;
                    console.log(`=====================================================`);
                    console.log(`Department Removed`);
                    console.log(`=====================================================`);
                    viewAllDepartments();
                });
            });
    });
};