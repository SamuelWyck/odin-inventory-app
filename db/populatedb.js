const {Client} = require("pg");
const path = require("node:path");
const {argv} = require("node:process");



let SQL = [
    "CREATE TABLE IF NOT EXISTS books (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "title VARCHAR(150) NOT NULL,",
    "pub_date DATE,",
    "img_url VARCHAR(150)",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS authors (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "first_name VARCHAR(50) NOT NULL,",
    "last_name VARCHAR(50) NOT NULL",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS genres (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "name VARCHAR(50) NOT NULL",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS book_authors (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "book_id INTEGER NOT NULL,",
    "author_id INTEGER NOT NULL,",
    "CONSTRAINT fk_book_id FOREIGN KEY (book_id)",
    "REFERENCES books(id) ON DELETE CASCADE,",
    "CONSTRAINT fk_author_id FOREIGN KEY (author_id)",
    "REFERENCES authors(id) ON DELETE CASCADE",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS book_genres (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "book_id INTEGER NOT NULL,",
    "genre_id INTEGER NOT NULL,",
    "CONSTRAINT fk_book_id FOREIGN KEY (book_id)",
    "REFERENCES books(id) ON DELETE CASCADE,",
    "CONSTRAINT fk_genre_id FOREIGN KEY (genre_id)",
    "REFERENCES genres(id) ON DELETE CASCADE",
    ");",
    "",
    "INSERT INTO genres (name) ",
    "VALUES ('thriller'), ('history'), ('mistery'), ('fantasy'), ('science fiction');",
    "",
    "INSERT INTO books (title, pub_date, img_url) ",
    "VALUES ",
    `('the westing game', '1978-05-01', '${path.resolve("../public/book-imgs/the-westing-game.jpeg")}'), `,
    `('the eye of the world', '1990-01-15', '${path.resolve("../public/book-imgs/the-eye-of-the-world.jpeg")}'), `,
    `('the foundation trilogy', '1953-01-01', '${path.resolve("../public/book-imgs/the-foundation-trilogy.jpeg")}'), `,
    `('the martian', '2014-02-11', '${path.resolve("../public/book-imgs/the-martian.jpeg")}'), `,
    `('the return of the king', '1955-10-20', '${path.resolve("../public/book-imgs/the-return-of-the-king.jpeg")}'), `,
    `('unbroken', '2010-11-16', '${path.resolve("../public/book-imgs/unbroken.jpeg")}');`,
    "",
    "INSERT INTO book_genres (book_id, genre_id) ",
    "VALUES (1, 3), (2, 4), (3, 5), (4, 1), (5, 4), (6, 2);",
    "",
    "INSERT INTO authors (first_name, last_name) ",
    "VALUES ",
    "('laura', 'hillenbrand'),",
    "('john', 'tolkien'),",
    "('robert', 'jordan'),",
    "('isaac', 'asimov'),",
    "('ellen', 'raskin'),",
    "('andy', 'weir');",
    "",
    "INSERT INTO book_authors (book_id, author_id) ",
    "VALUES (1, 5), (2, 3), (3, 4), (4, 6), (5, 2), (6, 1);"
];


SQL = SQL.join("");



async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: `postgresql://${argv[4]}:${argv[5]}@${argv[2]}/${argv[3]}`
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
};


main();