const { json } = require("express");
const express = require("express");
const handle_bars = require("express-handlebars");
const app = express();

app.engine("handlebars", handle_bars({defaultLayout: "main"}));//głównym plikiem w którym jest szablon strony bedzie main.handlebars
app.set("view engine", "handlebars");//uzywam handlebarsów

app.use( express.static("public") );



app.get("/", function(req, res) {

    res.render("home", {
        title: "tytuł strony",
        content: "kotent strony"
    });

});

app.listen(8080, function() {

    console.log("Serwer został uruchomiony pod adresem http://localhost:8080");

});