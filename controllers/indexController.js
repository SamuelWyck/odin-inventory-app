const asyncHandler = require("express-async-handler");
const db = require("../db/querys.js");


const indexGet = asyncHandler(async function(req, res) {
    const books = await db.getAllBooks();
    return res.render("index", {books: books});
});


module.exports = {
    indexGet
};
