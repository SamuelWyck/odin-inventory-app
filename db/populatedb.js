const {Client} = require("pg");
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
    "author_id INTEGER DEFAULT 0,",
    "CONSTRAINT fk_book_id FOREIGN KEY (book_id)",
    "REFERENCES books(id) ON DELETE CASCADE,",
    "CONSTRAINT fk_author_id FOREIGN KEY (author_id)",
    "REFERENCES authors(id) ON DELETE SET DEFAULT",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS book_genres (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "book_id INTEGER NOT NULL,",
    "genre_id INTEGER DEFAULT 0,",
    "CONSTRAINT fk_book_id FOREIGN KEY (book_id)",
    "REFERENCES books(id) ON DELETE CASCADE,",
    "CONSTRAINT fk_genre_id FOREIGN KEY (genre_id)",
    "REFERENCES genres(id) ON DELETE SET DEFAULT",
    ");",
    "",
    "INSERT INTO genres (id, name) ",
    "OVERRIDING SYSTEM VALUE VALUES (0, 'No Genre');",
    "",
    "INSERT INTO genres (name) ",
    "VALUES ('Thriller'), ('History'), ('Mistery'), ('Fantasy'), ('Science Fiction');",
    "",
    "INSERT INTO books (title, pub_date, img_url) ",
    "VALUES ",
    `('The Westing Game', '1978-05-01', '/book-imgs/the-westing-game.jpeg'), `,
    `('The Eye of the World', '1990-01-15', '/book-imgs/the-eye-of-the-world.jpeg'), `,
    `('The Foundation Trilogy', '1953-01-01', '/book-imgs/the-foundation-trilogy.jpeg'), `,
    `('The Martian', '2014-02-11', '/book-imgs/the-martian.jpeg'), `,
    `('The Return of the King', '1955-10-20', '/book-imgs/the-return-of-the-king.jpeg'), `,
    `('Unbroken', '2010-11-16', '/book-imgs/unbroken.jpeg');`,
    "",
    "INSERT INTO book_genres (book_id, genre_id) ",
    "VALUES (1, 3), (2, 4), (3, 5), (4, 1), (5, 4), (6, 2);",
    "",
    "INSERT INTO authors (id, first_name, last_name) ",
    "OVERRIDING SYSTEM VALUE VALUES (0, 'Unknown', 'Author');",
    "",
    "INSERT INTO authors (first_name, last_name) ",
    "VALUES ",
    "('Laura', 'Hillenbrand'),",
    "('John', 'Tolkien'),",
    "('Robert', 'Jordan'),",
    "('Isaac', 'Asimov'),",
    "('Ellen', 'Raskin'),",
    "('Andy', 'Weir');",
    "",
    "INSERT INTO book_authors (book_id, author_id) ",
    "VALUES (1, 5), (2, 3), (3, 4), (4, 6), (5, 2), (6, 1);",
    "",
    "CREATE TABLE IF NOT EXISTS admin (",
    "id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,",
    "password VARCHAR(20) NOT NULL",
    ");",
    "",
    "INSERT INTO admin (password) VALUES ('books');"
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