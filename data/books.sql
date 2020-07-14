
DROP TABLE IF EXISTS books;

CREATE table books(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description VARCHAR(500),
    bookshelf VARCHAR(255)
);