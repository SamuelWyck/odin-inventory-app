require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const booksRoute = require("./routes/booksRoute.js");
const authorsRoute = require("./routes/authorsRoute.js");
const genresRoute = require("./routes/genresRoute.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({extended: true}));


app.use("/authors", authorsRoute);
app.use("/genres", genresRoute);
app.use("/", booksRoute);


app.use(function(req, res) {
    return res.render("errorPage", {
        errorMessage: "Error 404: Page not Found"
    });
});

app.use(function(error, req, res, next) {
    console.log(error);
    res.render("errorPage", {
        errorMessage: "Error 500: Internal Server Error"
    });
});


const PORT = process.env.PORT;

app.listen(PORT, function() {console.log(`Server listening on port ${PORT}!`)});
