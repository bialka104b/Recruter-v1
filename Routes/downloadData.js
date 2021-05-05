
const express = require("express");
let app = express.Router();

app.get("/", (req, res)=> {
    console.log("działa logowanie");
    res.render("home", {
        title: "POMOCNIK REKRUTERA",
        content: "kotent strony",
        copywright: "by Marta Jamróz Kulig",
        pathCss: "/css/main.css",
    });
});

module.exports = app;