USE employees;

INSERT INTO department (name)
VALUES ('Marketing'), ('Sales');
    

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 68000, 1),('Salesperson', 100000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Beau', 'Ryan', 1, NULL),
       ('Anthony', 'Andy', 2, 1);