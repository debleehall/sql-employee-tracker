INSERT INTO 
    department (name)
VALUES
    ('Retail'),
    ('Food & Beverages'),
    ('Finance');

INSERT INTO 
    employee_role (title, salary, department_id)
VALUES
    ('Retail Manager', 500000, 1),
    ('Retail Team Lead', 20000, 1),
    ('Cash Room Lead', 20000, 3),
    ('Cash Room Manager', 800000, 3),
    ('F&B Operations Manager', 500000, 2),
    ('F&B Supervisor', 30000, 2);

INSERT INTO 
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Lisa', 'Jones', 1, NULL),
    ('Laura', 'Beauchamp', 4, NULL),
    ('Melissa', 'McGarrigle', 5, NULL),
    ('Ashley', 'Arnett', 2, 1),
    ('Kevin', 'Dudley', 6, 5),
    ('Rachael', 'Hall', 3, 3);