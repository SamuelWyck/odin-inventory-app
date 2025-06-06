require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const indexRoute = require("./routes/indexRoute.js");
const newRoute = require("./routes/newRoute.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({extended: true}));


app.use("/", indexRoute);
app.use("/new", newRoute)


const PORT = process.env.PORT;

app.listen(PORT, function() {console.log(`Server listening on port ${PORT}!`)});
