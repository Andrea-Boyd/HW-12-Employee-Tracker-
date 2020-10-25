USE employee_db;

INSERT INTO department (name)
VALUES ("Admin"), ("Developer"), ("Intern");

INSERT INTO role (title, salary, department_id)
VALUES  ("CEO", 100000, 1),
        ("CFO", 90000, 1),
        ("Senior Developer", 70000, 2),
        ("Junior Developer", 55000, 2),
        ("Intern", 35000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Darry", "Curtis", 1, null),
        ("Dallas", "Winston", 2, 1),
        ("Soda Pop", "Curtis", 3, 2),
        ("Pony Boy", "Curtis", 4, 3),
        ("Johnny", "Cade", 5, 3);

    

