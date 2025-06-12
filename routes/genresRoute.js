const {Router} = require("express");
const genresController = require("../controllers/genresController.js");



const genresRoute = Router();


genresRoute.use("/{:genreId}", genresController.genresGet);



module.exports = genresRoute;