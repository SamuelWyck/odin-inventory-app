const {Router} = require("express");
const authorsController = require("../controllers/authorsController.js");



const authorsRoute = Router();


authorsRoute.get("/{:authorId}", authorsController.authorsGet);



module.exports = authorsRoute;