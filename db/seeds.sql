INSERT INTO department (id, name)
VALUES ("quality-assurance"),
("accounting"),
("marketing"),
("sales")

SELECT * FROM department;

INSERT INTO role(title, salary, department_id)
VALUES ("qa manager", 100000, 1),
("qa-team-lead", 80000, 1),
("qa-member", 65000, 1),
("head-accountant", 110000, 2),
("accountant", 90000, 2),
("junior-accountant", 60000, 2),
("market-lead", 100000, 3),
("market-rep", 70000, 3),
("sales-manager", 80000, 4),
("sales-rep", 50000, 4);

SELECT FROM * role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Thomas", "Brown", 1, NULL),
("Stephen", "Green", 1, 1),
("Mary", "Blue", 1, 1),
("Stephanie", "Red", 2, NULL),
("James", "Mustard", 2, 2),
("Dina", "White", 2, 2),
("Taylor", "Violet", 3, NULL),
("Debra", "Pink", 3, 3),
("Ethan", "Black", 4, NULL),
("Lucy", "Grey", 4, 4);

SELECT FROM * employee;