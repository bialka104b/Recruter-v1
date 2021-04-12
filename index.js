const { json } = require("express");
const express = require("express");
const handle_bars = require("express-handlebars");
const app = express();

app.engine("handlebars", handle_bars({ defaultLayout: "main" })); //głównym plikiem w którym jest szablon strony bedzie main.handlebars
app.set("view engine", "handlebars"); //uzywam handlebarsów

var MyProfile = require('./moduly/myprofile');//import modułu mojego pliku myProfile
MyProfile.profileRequest.end();//wywołanie mojej funkcji z pliku myProfile

var myContact = require('./moduly/myContact');//import modułu mojego pliku myContact
// myContact.profileRequestContact.end();//wywołanie mojej funkcji z pliku myContact

var contactVantity = require('./moduly/contactVantityName');//import modułu mojego pliku contactVantityName
//contactVantity.profileVantityName.end();//wywołanie mojej funkcji z pliku contactVantityName

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("home", {
    title: "tytuł strony",
    content: "kotent strony",
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
