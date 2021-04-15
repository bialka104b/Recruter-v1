const { json } = require("express");
const fs = require("fs");
const express = require("express");
const handle_bars = require("express-handlebars");
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');
//var fileupload = require('fileupload').createFileUpload('/uploadDir').middleware;
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

//W tym miejscu zdefiniujmy lokalizację przechowywania naszych plików
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//Ze względów bezpieczeństwa będziemy chcieli sprawdzić poprawność plików przed przesłaniem ich na nasze serwery. Wyedytujmy index.js plik i dodajmy obie funkcjonalności:
app.post('/upload-profile-pic', (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

  upload(req, res, function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any

      if (req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else if (!req.file) {
          return res.send('Please select an image to upload');
      }
      else if (err instanceof multer.MulterError) {
          return res.send(err);
      }
      else if (err) {
          return res.send(err);
      }

      // to wysyła na strone jakiś kawałek kodu jak się uda przesyłanie pliku
      res.send(`Upload zakończono pomyślnie, Twoje dane są juz na serwerze <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Powróć do strony głównej</a>`);
  });
});
app.get("/", function (req, res) {
  res.render("home", {
    title: "tytuł strony",
    content: "kotent strony",
    pathCss: "/css/main.css",
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
