const asyncHandler = require("express-async-handler");
const multer = require("multer");
const {body, validationResult} = require("express-validator");
const db = require("../db/querys.js");
const {format} = require("date-fns");


const storage = multer.diskStorage({
    destination: "public/book-imgs",
    filename: function(req, file, cb) {
        cb(null, Date.now() + ".jpeg");
    }
});
const upload = multer({storage: storage});


const defaultImg = "book-imgs/default-img.jpeg";
const bookImgDir = "book-imgs/";



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
        .notEmpty().withMessage("Title cannot be empty"),
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
            genreId: req.body.genre,
            authorId: req.body.author,
            edit: false,
            bookTitle: req.body.title,
            bookDate: req.body.pub_date,
            errors: errors.array()
        });
    }

    const title = titleCase(req.body.title);
    const authorId = req.body.author;
    const genreId = req.body.genre;

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


function titleCase(string) {
    string = string.toLowerCase().trim();
    const words = string.split(" ");
    const littleWords = new Set([
        "a", "an", "and", "as", "at", "but", "by",
        "for", "in", "nor", "of", "on", "or", "the",
        "up"
    ]);

    for (let i = 0; i < words.length; i += 1) {
        const word = words[i];
        if (i === 0) {
            words[i] = word[0].toUpperCase() + word.slice(1);
            continue;
        }
        if (!littleWords.has(word)) {
            words[i] = word[0].toUpperCase() + word.slice(1);
        }
    }

    return words.join(" ");
};



module.exports = {
    booksGet,
    newBookGet,
    newBookPost: [
        upload.single("book-img"),
        validateBook,
        newBookPost,
    ]
};
