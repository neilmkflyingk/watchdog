use employee_db;

insert into department (name) values
('range'),
('feed_lot');

insert into role (title, salary, department_id) values
('lot_manager', 80000, 2),
('range_boss', 80000, 1),
('lot_hand', 50000, 2),
('range_hand', 50000, 1);

insert into employee (first_name, last_name, role_id, manager_id) values
('Duke', 'Jones', 1, null),
('Haus', 'Clemens', 2, null),
('Jim', 'Burns', 3, 1),
('Bruno', 'Schulz', 4, 2);


