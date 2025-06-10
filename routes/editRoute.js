const {Router} = require("express");
const editController = require("../controllers/editController.js");


const editRoute = Router();


editRoute.get("/book/:bookid", editController.bookEditGet);


module.exports = editRoute;