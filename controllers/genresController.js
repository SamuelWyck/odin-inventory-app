const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const db = require("../db/querys.js");
const capitalize = require("../utils/capitalize.js");



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



const newGenreGet = asyncHandler(async function(req, res) {
    return res.render("genreForm", {
        title: "New Genre",
        edit: false
    });
});



const validateGenre = [
    body("genreName").trim()
        .notEmpty().withMessage("Genre Name must not be empty")
        .isLength({max: 50}).withMessage("Genre Name must be less than 50 characters")
];


const newGenrePost = asyncHandler(async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("genreForm", {
            title: "New Genre",
            edit: false,
            genreName: req.body.genreName,
            errors: errors.array()
        });
    }

    const genreName = capitalize(req.body.genreName);
    const genreExists = await db.checkGenreExistsByName(genreName);

    if (genreExists) {
        return res.render("genreForm", {
            title: "New Genre",
            edit: false,
            genreName: req.body.genreName,
            errors: [{msg: "Genre already on shelf"}]
        });
    }

    await db.addGenre(genreName);
    return res.redirect("/genres");
});



module.exports = {
    genresGet,
    newGenreGet,
    newGenrePost: [
        validateGenre,
        newGenrePost
    ]
};