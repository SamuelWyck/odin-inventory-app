const asyncHandler = require("express-async-handler");


const indexGet = asyncHandler(async function(req, res) {
    //get all books from db
    return res.render("index", {books: []});
});


module.exports = {
    indexGet
};
