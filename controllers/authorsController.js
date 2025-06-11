const asyncHandler = require("express-async-handler");
const db = require("../db/querys.js");
const {body, validationResult} = require("express-validator");
const capitalize = require("../utils/capitalize.js");



const authorsGet = asyncHandler(async function(req, res) {
    const authorId = (req.params.authorId) ? req.params.authorId : 1;

    const result = await Promise.all([
        db.getAllAuthors(),
        db.getAllBooksByAuthor(authorId),
        db.getAuthor(authorId)
    ]);
    const [authors, books, author] = result;

    return res.render("category", {
        books: books,
        title: `Books by ${author.name}`,
        barTitle: "Authors",
        categoryList: authors,
        categoryName: "authors"
    });
});



const newAuthorGet = asyncHandler(async function(req, res) {
    return res.render("authorForm", {
        edit: false,
        title: "New Author",
    });
});



const validateAuthor = [
    body("firstname").trim()
        .notEmpty().withMessage("Firstname must not be empty")
        .matches(/^\w+$/).withMessage("Firstname must be a single word"),
    body("lastname").trim()
        .notEmpty().withMessage("Lastname must not be empty")
        .matches(/^\w+$/).withMessage("Lastname must be a single word")
];


const newAuthorPost = asyncHandler(async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("authorForm", {
            title: "New Author",
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            edit: false,
            errors: errors.array()
        });
    }

    const firstname = capitalize(req.body.firstname.toLowerCase());
    const lastname = capitalize(req.body.lastname.toLowerCase());

    const authorExists = await db.checkAuthorExistsByName(firstname, lastname);

    if (authorExists) {
        return res.status(400).render("authorForm", {
            title: "New Author",
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            edit: false,
            errors: [{msg: "Author already on shelf"}]
        });
    }

    await db.addAuthor(firstname, lastname);

    return res.redirect("/authors");
});



module.exports = {
    authorsGet,
    newAuthorGet,
    newAuthorPost: [
        validateAuthor,
        newAuthorPost
    ]
}