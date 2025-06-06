const asyncHandler = require("express-async-handler");
const multer = require("multer");


const upload = multer({dest: "../public/book-imgs"});


const newBookGet = asyncHandler(async function(req, res) {
    //get authors and genres

    return res.render("bookForm", {
        title: "New Book",
        authors: null,
        genres: null,
        edit: false
    });
});


const newBookPost = asyncHandler(async function(req, res) {
    //todo
});


module.exports = {
    newBookGet,
    newBookPost: [
        upload.single("book-img"),
        newBookPost
    ]
};