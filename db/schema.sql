DROP DATABASE IF EXISTS emplyoee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INTEGER PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
);

CREATE TABLE employee(
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL
    last_name VARCHAR(30) NOT NULL
    role_id INTEGER NOT NULL
    manager_id INTEGER
);