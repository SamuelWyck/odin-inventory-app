const {Router} = require("express");
const genresController = require("../controllers/genresController.js");



const genresRoute = Router();


genresRoute.get("/new", genresController.newGenreGet);
genresRoute.post("/new", genresController.newGenrePost);
genresRoute.get("/{:genreId}", genresController.genresGet);



module.exports = genresRoute;