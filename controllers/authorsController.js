const asyncHandler = require("express-async-handler");
const db = require("../db/querys.js");



const authorsGet = asyncHandler(async function(req, res) {
    const authorId = (req.params.authorId) ? req.params.authorId : 1;

    const result = await Promise.all([
        db.getAllAuthors(),
        db.getAllBooksByAuthor(authorId)
    ]);
    const [authors, books] = result;


    return res.render("category", {
        books: books,
        title: `Books by ${books[0].author}`,
        barTitle: "Authors",
        categoryList: authors,
        categoryName: "authors"
    });
});



module.exports = {
    authorsGet
}