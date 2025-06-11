const {Router} = require("express");
const authorsController = require("../controllers/authorsController.js");



const authorsRoute = Router();


authorsRoute.get("/new", authorsController.newAuthorGet);
authorsRoute.post("/new", authorsController.newAuthorPost);
authorsRoute.get("/edit/:authorid", authorsController.editAuthorGet);
authorsRoute.post("/edit", authorsController.editAuthorPost);
authorsRoute.get("/{:authorId}", authorsController.authorsGet);



module.exports = authorsRoute;