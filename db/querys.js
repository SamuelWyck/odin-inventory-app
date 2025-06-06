const pool = require("./pool.js");


async function getAllBooks() {
    const {rows} = await pool.query("SELECT * FROM books");
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
    await pool.query(
        "INSERT INTO books (title, pub_date, img_url) VALUES ($1, $2, $3)",
        [title, pub_date, img_url]
    );
};


async function addAuthor(firstName, lastName) {
    await pool.query(
        "INSERT INTO authors (first_name, last_name) VALUES ($1, $2)",
        [firstName, lastName]
    );
};


async function addGenre(name) {
    await pool.query(
        "INSERT INTO genres (name) VALUES ($1)",
        [name]
    );
};


async function updateBook(id, title, pub_date, img_url) {

};


async function updateAuthor(id, firstName, lastName) {

};


async function updateGenre(id, name) {

};


async function createAuthorLink(book_id, author_id) {

};


async function createGenreLink(book_id, genre_id) {

};