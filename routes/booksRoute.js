const {Router} = require("express");
const booksController = require("../controllers/booksController.js");

const booksRoute = Router();


booksRoute.get("/", booksController.booksGet);
booksRoute.get("/books/new", booksController.newBookGet);
booksRoute.post("/books/new", booksController.newBookPost);


module.exports = booksRoute;