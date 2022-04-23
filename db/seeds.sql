INSERT INTO department (department_name)
VALUES ("quality-assurance"),
("accounting"),
("marketing"),
("sales");

SELECT * FROM department;

INSERT INTO role(title, salary, department_id)
VALUES ("qa manager", 100000, 1),
("qa-member", 65000, 1),
("head-accountant", 110000, 2),
("accountant", 90000, 2),
("market-lead", 100000, 3),
("market-rep", 70000, 3),
("sales-manager", 80000, 4),
("sales-rep", 50000, 4);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Thomas", "Brown", 1, NULL),
("Stephen", "Green", 2, 2),
("Mary", "Blue", 2, 2),
("Stephanie", "Red", 3, NULL),
("James", "Mustard", 4, 2),
("Dina", "White", 4, 2),
("Taylor", "Violet", 5, NULL),
("Debra", "Pink", 6, 2),
("Ethan", "Black", 7, NULL),
("Lucy", "Grey", 8, 2);

SELECT * FROM employee;