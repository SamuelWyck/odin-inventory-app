const {Router} = require("express");
const indexController = require("../controllers/indexController.js");

const indexRoute = Router();


indexRoute.get("/", indexController.indexGet);


module.exports = indexRoute;