const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const db = require("../db/querys.js");



const genresGet = asyncHandler(async function(req, res) {
    const genreId = (req.params.genreId) ? req.params.genreId : 1;

    const result = await Promise.all([
        db.getAllGenres(),
        db.getBooksByGenre(genreId),
        db.getGenre(genreId)
    ]);
    const [genres, books, genre] = result;

    return res.render("category", {
        title: `${genre.name} Books`,
        books: books,
        categoryList: genres,
        categoryName: "genres"
    });
});



module.exports = {
    genresGet
};