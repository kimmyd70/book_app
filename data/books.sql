
DROP TABLE IF EXISTS books;

CREATE table books(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image VARCHAR(255),
    description TEXT,
    bookshelf VARCHAR(255)
);