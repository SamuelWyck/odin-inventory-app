const {Router} = require("express");
const newController = require("../controllers/newController.js");

const newRoute = Router();


newRoute.get("/book", newController.newBookGet);
newRoute.post("/book", newController.newBookPost);


module.exports = newRoute;