CREATE TABLE `users` (
    `id` integer PRIMARY KEY AUTOINCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL
);

CREATE TABLE `tasks` (
    `id` integer PRIMARY KEY AUTOINCREMENT,
    `owner_id` integer,
    `name` varchar(255) NOT NULL,
    `description` text,
    `priority` int NOT NULL,
    `points` int NOT NULL,
    `startDate` date,
    `endDate` date,
    `done` boolean NOT NULL
);

-- fake entries

INSERT INTO users (name, email, password) VALUES
    ('John Doe', 'john@example.com', 'password123'),
    ('Jane Smith', 'jane@example.com', 'qwerty123'),
    ('Fulano Siclano', 'fulano@example.com', 'brasil123'),
    ('Luizo Henrico', 'luizeco@example.com', 'abc123');

INSERT INTO tasks (owner_id, name, description, priority, points, startDate, endDate, done) VALUES
    (1, 'Task 1', 'This is task 1', 1, 10, '2023-01-01', '2023-01-15', 0),
    (3, 'Task 2', 'This is task 2', 2, 20, '2023-01-05', '2023-01-20', 0),
    (1, 'Task 3', 'This is task 3', 3, 30, '2023-01-10', '2023-01-25', 0),
    (2, 'Task 4', 'This is task 4', 3, 40, '2023-01-10', '2023-01-29', 0),
    (1, 'Task 5', 'This is task 5', 3, 50, '2023-01-10', '2023-02-01', 0);