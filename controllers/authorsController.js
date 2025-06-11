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

    if (!author) {
        return res.redirect("/authors");
    }

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
        .isLength({max: 50}).withMessage("Firstname must be shorter than 50 characters"),
    body("lastname").trim()
        .notEmpty().withMessage("Lastname must not be empty")
        .isLength({max: 50}).withMessage("Lastname must be shorter than 50 characters")
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

    const firstname = capitalize(req.body.firstname);
    const lastname = capitalize(req.body.lastname);

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



const editAuthorGet = asyncHandler(async function(req, res) {
    const authorId = Number(req.params.authorid);

    if (authorId === 0) {
        return res.redirect("/authors");
    }

    const author = await db.getAuthor(authorId);

    if (!author) {
        return res.redirect("/authors");
    }

    return res.render("authorForm", {
        title: "Edit Author",
        edit: true,
        firstname: author.first_name.toLowerCase(),
        lastname: author.last_name.toLowerCase(),
        authorId: author.id
    });
});



const editAuthorPost = asyncHandler(async function(req, res, next) {
    const password = req.body.password;
    const authorId = Number(req.body.id);

    if (authorId === 0) {
        return res.redirect("/authors");
    }

    const passwordValid = await db.checkPassword(password);
    if (!passwordValid) {    
        return res.render("authorForm", {
            title: "Edit Author",
            edit: true,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            authorId: authorId,
            errors: [{msg: "Incorrect password"}]
        });
    }

    if (req.body.delete) {
        return next();
    }

    const firstName = capitalize(req.body.firstname);
    const lastName = capitalize(req.body.lastname);

    const errors = validationResult(req);
    const authorExists = await db.checkAuthorExistsByName(firstName, lastName);
    if (!errors.isEmpty() || authorExists) {
        let errMessages = [];
        if (authorExists) {
            authorError = [{msg: "Author already on shelf"}];
            errMessages = errMessages.concat(authorError);
        }
        if (!errors.isEmpty()) {
            errMessages = errMessages.concat(errors.array());
        }
        
        return res.render("authorForm", {
            title: "Edit Author",
            edit: true,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            authorId: authorId,
            errors: errMessages
        });
    }

    await db.updateAuthor(authorId, firstName, lastName);
    return res.redirect("/authors");
});



const deleteAuthorPost = asyncHandler(async function(req, res) {
    const authorId = Number(req.body.id);

    await db.deleteAuthor(authorId);

    return res.redirect("/authors");
});



module.exports = {
    authorsGet,
    newAuthorGet,
    newAuthorPost: [
        validateAuthor,
        newAuthorPost
    ],
    editAuthorGet,
    editAuthorPost: [
        validateAuthor,
        editAuthorPost,
        deleteAuthorPost
    ]
}