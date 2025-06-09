const pool = require("./pool.js");


const dateFormat = "Mon dd yyyy";


async function getAllBooks() {
    const {rows} = await pool.query(
        "SELECT ba.book_id, title, TO_CHAR(pub_date, $1) AS pub_date, CONCAT(first_name, ' ', last_name) AS author, img_url FROM books AS b JOIN book_authors AS ba ON ba.book_id = b.id JOIN authors AS a ON a.id = ba.author_id",
        [dateFormat]
    );
    console.log(rows)
    return rows;
};


async function getAllAuthors() {
    const {rows} = await pool.query("SELECT * FROM authors");
    return rows;
};


async function getAllGenres() {
    const {rows} = await pool.query("SELECT * FROM genres");
    return rows;
};


async function addBook(title, pub_date, img_url) {
    const {rows} = await pool.query(
        "INSERT INTO books (title, pub_date, img_url) VALUES ($1, $2, $3) RETURNING id",
        [title, pub_date, img_url]
    );
    return rows[0].id;
};


async function addAuthor(firstName, lastName) {
    const {rows} = await pool.query(
        "INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING id",
        [firstName, lastName]
    );
    return rows[0].id;
};


async function addGenre(name) {
    const {rows} = await pool.query(
        "INSERT INTO genres (name) VALUES ($1) RETURNING id",
        [name]
    );
    return rows[0].id;
};


async function updateBook(id, title, pub_date, img_url) {
    await pool.query(
        "UPDATE books SET title = $1, pub_date = $2, img_url = $3 WHERE id = $4",
        [title, pub_date, img_url, id]
    );
};


async function updateAuthor(id, firstName, lastName) {
    await pool.query(
        "UPDATE authors SET first_name = $1, last_name = $2 WHERE id = $3",
        [firstName, lastName, id]
    );
};


async function updateGenre(id, name) {
    await pool.query(
        "UPDATE genres SET name = $1 WHERE id = $2",
        [name, id]
    );
};


async function deleteBook(id) {
    await pool.query(
        "DELETE FROM books WHERE id = $1",
        [id]
    );
};


async function deleteAuthor(id) {
    await pool.query(
        "DELETE FROM authors WHERE id = $1",
        [id]
    );
};


async function deleteGenre(id) {
    await pool.query(
        "DELETE FROM genres WHERE id = $1",
        [id]
    );
};


async function createAuthorLink(book_id, author_id) {
    await pool.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
        [book_id, author_id]
    );
};


async function createGenreLink(book_id, genre_id) {
    await pool.query(
        "INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)",
        [book_id, genre_id]
    );
};


async function checkBookExists(title, authorId) {
    const {rows} = await pool.query(
        "SELECT * FROM books AS b JOIN book_authors AS ba ON ba.book_id = b.id WHERE title = $1 AND ba.author_id = $2",
        [title, authorId]
    );
    return rows.length === 1;
};


async function checkAuthorExists(id) {
    const {rows} = await pool.query(
        "SELECT * FROM authors WHERE id = $1",
        [id]
    );
    return rows.length === 1;
};


async function checkGenreExists(id) {
    const {rows} = await pool.query(
        "SELECT * FROM genres WHERE id = $1",
        [id]
    );
    return rows.length === 1;
};


async function checkPassword(password) {
    const {rows} = await pool.query("SELECT * FROM admin;");

    const adminPassword = rows[0].password;
    return password === adminPassword;
};


module.exports = {
    getAllBooks,
    getAllAuthors,
    getAllGenres,
    addBook,
    addAuthor,
    addGenre,
    updateBook,
    updateAuthor,
    updateGenre,
    deleteBook,
    deleteAuthor,
    deleteGenre,
    createAuthorLink,
    createGenreLink,
    checkPassword,
    checkBookExists,
    checkAuthorExists,
    checkGenreExists,
};