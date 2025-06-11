const asyncHandler = require("express-async-handler");
const multer = require("multer");
const {body, validationResult} = require("express-validator");
const db = require("../db/querys.js");
const {format} = require("date-fns");
const fs = require("fs");
const path = require("node:path");
const titleCase = require("../utils/titleCase.js");



const storage = multer.diskStorage({
    destination: "public/book-imgs",
    filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpeg");
    }
});
const upload = multer({storage: storage});


const defaultImg = "/book-imgs/default-img.jpeg";
const bookImgDir = "/book-imgs/";



const booksGet = asyncHandler(async function(req, res) {
    const books = await db.getAllBooks();
    return res.render("books", {books: books});
});



const newBookGet = asyncHandler(async function(req, res) {
    const result = await Promise.all([
        db.getAllAuthors(),
        db.getAllGenres()
    ]);
    const authors = result[0];
    const genres = result[1];

    return res.render("bookForm", {
        title: "New Book",
        authors: authors,
        authorId: null,
        genres: genres,
        genreId: null,
        edit: false
    });
});



const validateBook = [
    body("title").trim()
        .notEmpty().withMessage("Title cannot be empty")
        .isLength({max: 150}).withMessage("Title must be shorter than 150 characters"),
    body("genre").trim()
        .notEmpty().withMessage("Must select a genre"),
    body("author").trim()
        .notEmpty().withMessage("Must select an author"),
    body("pub_date").notEmpty().withMessage("Must select a date")
];

const newBookPost = asyncHandler(async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const result = await Promise.all([
            db.getAllAuthors(),
            db.getAllGenres()
        ]);
        const authors = result[0];
        const genres = result[1];
        return res.status(400).render("bookForm", {
            title: "New Book",
            authors: authors,
            genres: genres,
            genreId: Number(req.body.genre),
            authorId: Number(req.body.author),
            edit: false,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            errors: errors.array()
        });
    }

    const title = titleCase(req.body.title);
    const authorId = Number(req.body.author);
    const genreId = Number(req.body.genre);

    const result = await Promise.all([
        db.checkAuthorExists(authorId),
        db.checkBookExists(title, authorId),
        db.checkGenreExists(genreId)
    ]);

    const [authorExists, bookExists, genreExists] = result;
    if (!authorExists || bookExists || !genreExists) {
        const result = await Promise.all([
            db.getAllAuthors(),
            db.getAllGenres()
        ]);
        const authors = result[0];
        const genres = result[1];

        let msg = null;
        if (bookExists) {
            msg = "Book is already on the shelf";
        } else if (!authorExists) {
            msg = "Author not found";
        } else if (!genreExists) {
            msg = "Genre not found";
        }

        return res.status(400).render("bookForm", {
            title: "New Book",
            authors: authors,
            genres: genres,
            genreId: genreId,
            authorId: authorId,
            edit: false,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            errors: [{msg: msg}]
        });
    }
    
    const date = format(req.body.pub_date, "yyyy MM dd");
    const img_url = (req.file !== undefined) ? bookImgDir + req.file.filename : defaultImg;
    const bookId = await db.addBook(title, date, img_url);
    await Promise.all([
        db.createAuthorLink(bookId, authorId),
        db.createGenreLink(bookId, genreId)
    ]);
    return res.redirect("/");
});



const editBookGet = asyncHandler(async function(req, res) {
    const bookId = req.params.bookId;
    const result = await Promise.all([
        db.getAllAuthors(),
        db.getAllGenres(),
        db.getBook(bookId)
    ]);
    const [authors, genres, book] = result;

    if (!book) {
        return res.redirect("/");
    }

    return res.render("bookForm", {
        title: "Edit Book",
        edit: true,
        authors: authors,
        genres: genres,
        genreId: book.genreid,
        authorId: book.authorid,
        bookTitle: book.title.toLowerCase(),
        bookDate: book.date,
        bookId: book.id
    });
});



const editBookPost = asyncHandler(async function(req, res, next) {
    const password = req.body.password;
    const bookId = Number(req.body.id);

    const validPassword = await db.checkPassword(password);
    if (!validPassword) {
        const result = await Promise.all([
            db.getAllAuthors(),
            db.getAllGenres(),
        ]);
        const [authors, genres] = result;
        return res.status(400).render("bookForm", {
            title: "Edit Book",
            authors: authors,
            genres: genres,
            genreId: Number(req.body.genre),
            authorId: Number(req.body.author),
            edit: true,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            bookId: bookId,
            errors: [{msg: "Incorrect password"}]
        });
    }
    

    if (req.body.delete) {
        return next();
    }

    
    const errors = validationResult(req);
    if ((!errors.isEmpty())) {
        const result = await Promise.all([
            db.getAllAuthors(),
            db.getAllGenres(),
        ]);
        const [authors, genres] = result;
        return res.status(400).render("bookForm", {
            title: "Edit Book",
            authors: authors,
            genres: genres,
            genreId: Number(req.body.genre),
            authorId: Number(req.body.author),
            edit: true,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            bookId: bookId,
            errors: errors.array()
        });
    }


    const title = titleCase(req.body.title);
    const authorId = Number(req.body.author);
    const genreId = Number(req.body.genre);

    const result = await Promise.all([
        db.checkAuthorExists(authorId),
        db.checkBookExistsExcluding(req.body.id, title, authorId),
        db.checkGenreExists(genreId)
    ]);

    const [authorExists, bookExists, genreExists] = result;
    if (!authorExists || bookExists || !genreExists) {
        const result = await Promise.all([
            db.getAllAuthors(),
            db.getAllGenres(),
        ]);
        const [authors, genres] = result;

        let msg = null;
        if (bookExists) {
            msg = "Book is already on the shelf";
        } else if (!authorExists) {
            msg = "Author not found";
        } else if (!genreExists) {
            msg = "Genre not found";
        }

        return res.status(400).render("bookForm", {
            title: "Edit Book",
            authors: authors,
            genres: genres,
            genreId: genreId,
            authorId: authorId,
            edit: true,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            bookId: bookId,
            errors: [{msg: msg}]
        });
    }


    const book = await db.getBook(req.body.id);
    const date = format(req.body.pub_date, "yyyy MM dd");
    const id = Number(req.body.id);
    const img_url = (req.file !== undefined) ? bookImgDir + req.file.filename : book.img_url;

    if (img_url !== book.img_url && book.img_url !== defaultImg) {
        fs.unlink(path.resolve("public" + book.img_url), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    await Promise.all([
        db.updateBook(id, title, date, img_url),
        db.updateAuthorLink(id, book.authorid, authorId),
        db.updateGenreLink(id, book.genreid, genreId)
    ]);
    return res.redirect("/");
});



const deleteBookPost = asyncHandler(async function(req, res) {
    const book = await db.getBook(req.body.id);
    if (book.img_url !== defaultImg) {
        fs.unlink(path.resolve("public" + book.img_url), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    await db.deleteBook(req.body.id);

    return res.redirect("/");
});



module.exports = {
    booksGet,
    newBookGet,
    newBookPost: [
        upload.single("book-img"),
        validateBook,
        newBookPost,
    ],
    editBookGet,
    editBookPost: [
        upload.single("book-img"),
        validateBook,
        editBookPost,
        deleteBookPost
    ],
};
