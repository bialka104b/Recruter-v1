//FIREBASE SOBIE RACZEJ ODINSTALUJ
const { json } = require("express");
const fs = require("fs");
const express = require("express");
const handle_bars = require("express-handlebars");
const multer = require("multer");
const path = require("path");
const helpers = require("./helpers");
const process = require("process");
const mongo = require("mongodb"); //import biblioteki mongo
const client = new mongo.MongoClient("mongodb://51.195.103.100:27017", {
  // "mongodb://localhost:27017",
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //bez tych opcji w klamerkach nie zadziała

//inicjalizacja biblioteki expres.js
const app = express();
app.engine("handlebars", handle_bars({ defaultLayout: "main" })); //głównym plikiem w którym jest szablon strony bedzie main.handlebars
app.set("view engine", "handlebars"); //uzywam handlebarsów

var MyProfile = require("./moduly/myprofile"); //import modułu mojego pliku myProfile
MyProfile.profileRequest.end(); //wywołanie mojej funkcji z pliku myProfile

var myContact = require("./moduly/myContact"); //import modułu mojego pliku myContact
// myContact.profileRequestContact.end();//wywołanie mojej funkcji z pliku myContact

var contactVantity = require("./moduly/contactVantityName"); //import modułu mojego pliku contactVantityName
//contactVantity.profileVantityName.end();//wywołanie mojej funkcji z pliku contactVantityName

app.use(express.static("public"));

//W tym miejscu zdefiniujmy lokalizację przechowywania naszych plików wgrywanych na strone
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/`);
  },
  filename: function (req, file, cb) {
    //tutaj ustawiam nowa nazwe pliku wraz z rozszerzeniem, nazwa będzie Lista.js
    //cb(null, file.originalname + path.extname(file.originalname));//tu by była taka sama jak przy wgrywaniu
    cb(null, "Lista" + path.extname(file.originalname));
  },
});

var dirname = path.join(__dirname, "/upload");
//funkcja pomocnicza do odczytywania ścieżki pliku
function file(filename) {
  return path.join(__dirname, "upload", filename);
}

const readFileDataDir = fs.readdir(dirname, (err, files) => {
  //console.log(root.dir);
  //funkcja odczytuje mi plik Lista.json wgrany na serwer
  //utf-8 jest do rozkodowywania, ale domyslnie informacje sa przesyłane w postaci buffera
  const readFileData = fs.readFile(file("Lista.json"), "utf8", function (err, data) {
    if (err) {
      //console.log("dirname", __dirname);
      console.log("bła", `Wystąpił błąd: ${err.message}`);
      throw err;
    }
    //funkcja do zapisywania danych do innego pliku
    function storedata(data, path) {
      try {
        fs.writeFileSync(path, data).close();
      } catch (err) {
        console.error(err);
      }
    }
    //storedata(data, path.join(__dirname, '/bazadanych/baza.json'));
    //process.once('beforeExit', storedata(data, path.join(__dirname, '/bazadanych/baza.json')));
    const dane = data.toString();
    return dane;
  });

  //   if(err) {
  //     return cb(err, dirname)
  //   }
  //   var counter = 0;
  //   files.forEach(function(file, index){
  //     console.log('file', file);
  //     console.log('file', file[index].length);

  //     fs.readFile(path.join(dirname, file), function(err) {
  //       if(!err) {
  //         counter++;
  //       }
  //       if(index+1 === files.length && counter !== files.length) {
  //         return cb(new Error("nie wszystkie pliki udało się odczytać"), dir)
  //       }
  //       if(counter === files.length){
  //         return rmdir(dir, cb);
  //       }
  //       console.log('file', file[index].length);
  //     });
  //   })
});

//obserwowanie pliku Lista.json i zapisywanie danych do mongoDB
//działa tylko po zapisaniu pliku w edytorze
//FUNKCJA DO PARSOWANIA
function parsuj(data) {
  const dane = JSON.parse(data);
  return dane;
}
//JSON.parse()pobiera ciąg JSON i przekształca go w obiekt JavaScript.
//JSON.stringify()pobiera obiekt JavaScript i przekształca go w ciąg JSON.
fs.watch(file("Lista.json"), function (eventType, filename) {
  const bazaJson = fs.readFileSync(file("Lista.json").toString());
  const bazaJson1 = JSON.stringify(bazaJson.toString());
  const bazaJsonObject = JSON.parse(bazaJson1);

  var array = [];
  for (var key in bazaJsonObject) {
    array.push(JSON.parse(bazaJsonObject));
  }
  console.log("array", typeof array);
  console.log("array 0 ", array[0]);

  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia /manySaveDatabase");
      client.close();
    } else {
      console.log("niby działa");
      const db = client.db("test");
      const kandydaci = db.collection("kandydaci");
      console.log("polaczenie udane z bazą /manySaveDatabase");
      try {
        if (array.length != 0) {
          kandydaci.insertMany(array[0], { ordered: false });
        }
      } catch (e) {
        console.log("wystąpil blad e: ", e);
        e.getWriteErrors().forEach(function (err) {
          if (err.code != 11000) {
            throw e;
          }
        });
      }
    }
  });

  // fs.readFile(file(filename), function (err, data) {
  //   // if (!err) {
  //   console.log("read file dział");
  //   const bazaJson = data;
  //   const bazaJson1 = bazaJson.toString();
  //   const bazaJsonObject = parsuj(bazaJson1);
  //   console.log("bazaJson1", bazaJsonObject);

  //   client.connect((err) => {
  //     if (err) {
  //       console.log("błąd polaczenia /manySaveDatabase");
  //       client.close();
  //     } else {
  //       console.log("niby działa");
  //       const db = client.db("test"); //pobieram nazwe bazy danych test
  //       const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
  //       console.log("polaczenie udane z bazą /manySaveDatabase");

  //       try {
  //         kandydaci.insertMany(bazaJsonObject, {
  //           ordered: false,
  //         });
  //       } catch (e) {
  //         console.log("wystąpil blad e: ", e);
  //       }
  //     }
  //   });

  //   // fs.readFile(file("baza.json"), "utf-8", (err, data) => {
  //   //   if (!err) {
  //   //     // console.log("data przed stringi", data);
  //   //     // data = JSON.stringify(jsonText);
  //   //     // console.log("data po stringi", jsonText);
  //   //     // console.log("typ jsonText", typeof jsonText);

  //   //     //odczytuje zawartośc Lista json
  //   //     // const zmienna = fs.readFileSync(file("Lista.json").toString());
  //   //     // const zmienna1 = zmienna.toString();
  //   //     // const listaJson = parsuj(zmienna1);
  //   //     // console.log("listaJson: ", listaJson);
  //   //     //console.log("listaJson.lp", listaJson.lp); //w tym miejscu dostałam sie do obiektów tego jsona

  //   //     //odczytajmy jeszcze dane z pliku baza.json aby połaczyć dane z obu plików
  //   //     // const bazaJson = fs.readFileSync(file("baza.json").toString());
  //   //     // const bazaJson1 = bazaJson.toString();
  //   //     // const bazaJsonObject = parsuj(bazaJson1);
  //   //     // console.log("bazaJsonObject", bazaJsonObject);

  //   //     //tworze nazwy pusty obiekt ktory trafi docelowo do pliku baza.json
  //   //     let polaczonyBazaILista = {};

  //   //     //następuje tutaj zamiana obiektu bazaJsonObiekt na tablice
  //   //     let arr = [];
  //   //     for (let key in bazaJsonObject) {
  //   //       //petle te iteruja od 0
  //   //       //console.log("ile wynosi to key bazaJSONOBJECT? ", key);
  //   //       arr.push(bazaJsonObject[key.toString()]);
  //   //       //console.log("arr", arr[key]);
  //   //     }
  //   //     polaczonyBazaILista = arr; //przypisuje przetworzona tablice do tego co ma wylądowac w pliku baza.json
  //   //     //console.log("polaczonyBazaILista po petli", polaczonyBazaILista);

  //   //     //następuje tutaj zamiana obiektu listaJson na tablice
  //   //     let arrayZmienna2 = [];
  //   //     for (let key in listaJson) {
  //   //       //petle te iteruja od 0
  //   //       arrayZmienna2.push(listaJson[key.toString()]);
  //   //       console.log("arr zmienna2", arrayZmienna2[key]);
  //   //     }
  //   //     console.log("arrayZmienna2[0]", arrayZmienna2[0]);
  //   //     for (const key in arrayZmienna2) {
  //   //       polaczonyBazaILista.push(arrayZmienna2[key]);
  //   //     }
  //   //     console.log("polaczonyBazaILista po push arrayzmienna2", polaczonyBazaILista);

  //   //     //Tutaj mam kodowanie obiektu JS na buffer
  //   //     const moje_dane = JSON.stringify(polaczonyBazaILista);
  //   //     const buf1 = Buffer.from(moje_dane);
  //   //     //console.log("odkodowane", buf1);

  //   //     //tutaj następuje automatyczny zapis do pliku z odkodowanym bufferem,callback słuzy tylko do obsługi błędów
  //   //     // fs.writeFile(file("baza.json"), buf1, "utf-8", (err) => {
  //   //     //   if (err) {
  //   //     //     console.log("cos poszło nie tak przy zapisywaniu baza.json", err.message);
  //   //     //   } else {
  //   //     //     console.log("Plik zapisany pomyślnie\n");
  //   //     //     // console.log("Napis ma następującą zawartość:");
  //   //     //     // console.log(parsuj(fs.readFileSync(file("baza.json"), "utf8")));
  //   //     //   }
  //   //     // });
  //   //   } else {
  //   //     console.log(err.message);
  //   //     return err.message;
  //   //   }
  //   // });
  //   //   res.send(`
  //   //       <div class="row finish">
  //   //         <h1>POMOCNIK REKRUTERA</h1>
  //   //         <h4>Aktualizacje zakończono pomyślnie</h4>
  //   //         <a class="back_home" href="../downloadData">&#9194; Powróć do strony głównej</a>
  //   //       </div>
  //   //       `);
  //   // }
  // });
});

//21.04 metoda post do obsłużenia formularza Wybierz imię
const url = require("url");
var qs = require("querystring");

app.get("/wyslijimie", (req, res) => {
  //połączenie sie z baza mongo db

  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia database");
      client.close();
    } else {
      const db = client.db("test"); //pobieram nazwe bazy danych test
      const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji

      //FUNKCJA KTÓRA ZAMIENIA PIERWSZĄ LITERE NA DUŻĄ, PRZYJMUJE WARTOSC STRING
      const capitalize = require("./moduly/capitalizeFunction");

      //TECHNOLOGIE
      const adobe = req.query.adobe;
      const agile = req.query.agile;
      const android = req.query.android;
      const angular = req.query.angular;
      const aws = req.query.aws;
      const bash = req.query.bash;
      const bootstrap = req.query.bootstrap;
      const css = req.query.css;
      const csharp = req.query.csharp;
      const cpp = req.query.cpp;
      const c = req.query.c;
      const delphi = req.query.delphi;
      const html = req.query.html;
      const ios = req.query.ios;
      const java = req.query.java;
      const javascript = req.query.javascript;
      const jQuery = req.query.jQuery;
      const kanban = req.query.kanban;
      const less = req.query.less;
      const linux = req.query.linux;
      const dotNet = req.query.dotNet;
      const node = req.query.node;
      const oracle = req.query.oracle;
      const perl = req.query.perl;
      const photoshop = req.query.photoshop;
      const php = req.query.php;
      const powershell = req.query.powershell;
      const python = req.query.python;
      const react = req.query.react;
      const ruby = req.query.ruby;
      const sass = req.query.sass;
      const scala = req.query.scala;
      const scrum = req.query.scrum;
      const scss = req.query.scss;
      const spring = req.query.spring;
      const sql = req.query.sql;
      const swift = req.query.swift;
      const vue = req.query.vue;
      const vb = req.query.vb;
      const windows = req.query.windows;
      const specjalnosc = req.query.specjalnosc;
      const nazwisko = req.query.nazwisko;
      const miejscowosc = req.query.miejscowosc;

      //FUNKCJA SPRAWDZA CZY JEZYKI SĄ ZAZNACZONE CZY NIE
      const sprawdzCzyJezykZaznaczony = require("./moduly/sprawdzCzyJezykZaznaczony");

      //ZMIENNE DO CHECKBOX JĘZYKI OBCE
      //ANGIELSKI
      const angielskiLevel = req.query.angielskiLevel;
      let angielski = sprawdzCzyJezykZaznaczony(req.query.Angielski, angielskiLevel); //trim obcina biale znaki na poczatku i koncu
      if (angielski != false) {
        angielski = capitalize(angielski.trim());
      }

      //NIEMIECKI
      const niemieckiLevel = req.query.niemieckiLevel;
      let niemiecki = sprawdzCzyJezykZaznaczony(req.query.Niemiecki, niemieckiLevel); //trim obcina biale znaki na poczatku i koncu
      if (niemiecki != false) {
        niemiecki = capitalize(niemiecki.trim());
      }

      //INNE JĘZYKI
      let pozostalejezyki = req.query.Pozostale_Jezyki;
      //console.log("co zawiera pozostale teraz", pozostalejezyki);
      console.log("polaczenie udane z bazą strona główna");

      //FUNKCJA POTRZEBNA DO RENDEROWANIA INFORMACJI Z BAZY DANYCH NA STRONE
      function findInMongoDb(params) {
        //tablica posortowana będzie od A do Z po nazwiskach
        kandydaci
          .find(params)
          .sort({ Nazwisko: 1 })
          .toArray((err, dataFromMongo) => {
            //POD PARAMETREM dataFromMongo DOSTAJE MÓJ OBIEKT TABLICOWY Z DANYMI
            //OBIEKT DO RENDEROWANIA
            const objectRender = {
              // script: () => {
              //   var myTrigger = function (ready) {
              //     FreshUrl.waitsFor(function () {
              //       return window.myLib;
              //     }).then(ready);
              //   };
              //   var _freshenUrlAfter = ["googleAnalytics", myTrigger];
              // },
              person: dataFromMongo,
              title: "POMOCNIK REKRUTERA",
              content: "kotent strony",
              pathCss: "/css/main.css",
            };
            //JEŚLI JEST ERROR TO WYŚWIETL MI GO
            if (err) console.log("błąd", err.message);
            //JEŚLI NIEMA ERRORA TO WYRENDERUJ DANE
            else {
              res.render("home", objectRender);
            }
          });
      }

      //_________________________________________________________________________________________
      //TU MAMY PRZYPADKI GDZIE POLE TECHNOLOGIE JEST WPROWADZONE
      // Technologie są css, php i jquery. program ignoruje wielkośc liter
      // { $and: [{ Technologie: { $regex: "css", $options: 'i' }},{ Technologie: { $regex: "php", $options: 'i' }},{ Technologie: { $regex: "jquery", $options: 'i' }}]  }
      //ZAUTOMATYZAWANA OBSŁUGA 128 IFÓW do wyświetlania danych
      const tablicaAtrybutowPelnych = [
        specjalnosc,
        angielski,
        niemiecki,
        pozostalejezyki,
        nazwisko,
        miejscowosc,
        adobe,
        agile,
        android,
        angular,
        aws,
        bash,
        bootstrap,
        css,
        csharp,
        cpp,
        c,
        delphi,
        html,
        ios,
        java,
        javascript,
        jQuery,
        kanban,
        less,
        linux,
        dotNet,
        node,
        oracle,
        perl,
        photoshop,
        php,
        powershell,
        python,
        react,
        ruby,
        sass,
        scala,
        scrum,
        spring,
        sql,
        scss,
        swift,
        vue,
        vb,
        windows,
      ];
      const arrayObjectPush = new Array();
      let mojObiekt; //pusta tablica
      for (let index = 0; index < tablicaAtrybutowPelnych.length; index++) {
        const emptyObject = {};

        if (tablicaAtrybutowPelnych[index] != "" && index < 6) {
          if (index == 0) {
            emptyObject.Specjalnosc = { $regex: specjalnosc, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 1) {
            emptyObject.Angielski = { $regex: angielski, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 2) {
            emptyObject.Niemiecki = { $regex: niemiecki, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 3) {
            emptyObject.Pozostale_Jezyki = { $regex: pozostalejezyki, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 4) {
            emptyObject.Nazwisko = { $regex: nazwisko, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 5) {
            emptyObject.Miejscowosc = { $regex: miejscowosc, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          mojObiekt = arrayObjectPush;
        }
        if (index > 5) {
          //TECHNOLOGIE
          if (index == 6 && sprawdzCzyJezykZaznaczony(adobe, "")) {
            emptyObject.Technologie = { $regex: adobe, $options: "i" };
            arrayObjectPush.push(emptyObject);
            console.log(adobe);
          }
          if (index == 7 && sprawdzCzyJezykZaznaczony(agile, "")) {
            emptyObject.Technologie = { $regex: agile, $options: "i" };
            arrayObjectPush.push(emptyObject);
            console.log(agile);
          }
          if (index == 8 && sprawdzCzyJezykZaznaczony(android, "")) {
            emptyObject.Technologie = { $regex: android, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 9 && sprawdzCzyJezykZaznaczony(angular, "")) {
            emptyObject.Technologie = { $regex: angular, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 10 && sprawdzCzyJezykZaznaczony(aws, "")) {
            emptyObject.Technologie = { $regex: aws, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 11 && sprawdzCzyJezykZaznaczony(bash, "")) {
            emptyObject.Technologie = { $regex: bash, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 12 && sprawdzCzyJezykZaznaczony(bootstrap, "")) {
            emptyObject.Technologie = { $regex: bootstrap, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 13 && sprawdzCzyJezykZaznaczony(css, "")) {
            emptyObject.Technologie = { $regex: css, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 14 && sprawdzCzyJezykZaznaczony(csharp, "")) {
            emptyObject.Technologie = { $regex: csharp, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 15 && sprawdzCzyJezykZaznaczony(cpp, "")) {
            emptyObject.Technologie = { $regex: cpp };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 16 && sprawdzCzyJezykZaznaczony(c, "")) {
            emptyObject.Technologie = { $regex: c };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 17 && sprawdzCzyJezykZaznaczony(delphi, "")) {
            emptyObject.Technologie = { $regex: delphi, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 18 && sprawdzCzyJezykZaznaczony(html, "")) {
            emptyObject.Technologie = { $regex: html, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 19 && sprawdzCzyJezykZaznaczony(ios, "")) {
            emptyObject.Technologie = { $regex: ios, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 20 && sprawdzCzyJezykZaznaczony(java, "")) {
            emptyObject.Technologie = { $regex: java, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 21 && sprawdzCzyJezykZaznaczony(javascript, "")) {
            emptyObject.Technologie = { $regex: javascript, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 22 && sprawdzCzyJezykZaznaczony(jQuery, "")) {
            emptyObject.Technologie = { $regex: jQuery, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 23 && sprawdzCzyJezykZaznaczony(kanban, "")) {
            emptyObject.Technologie = { $regex: kanban, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 24 && sprawdzCzyJezykZaznaczony(less, "")) {
            emptyObject.Technologie = { $regex: less, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 25 && sprawdzCzyJezykZaznaczony(linux, "")) {
            emptyObject.Technologie = { $regex: linux, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 26 && sprawdzCzyJezykZaznaczony(dotNet, "")) {
            emptyObject.Technologie = { $regex: dotNet, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 27 && sprawdzCzyJezykZaznaczony(node, "")) {
            emptyObject.Technologie = { $regex: node, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 28 && sprawdzCzyJezykZaznaczony(oracle, "")) {
            emptyObject.Technologie = { $regex: oracle, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 29 && sprawdzCzyJezykZaznaczony(perl, "")) {
            emptyObject.Technologie = { $regex: perl, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 30 && sprawdzCzyJezykZaznaczony(photoshop, "")) {
            emptyObject.Technologie = { $regex: photoshop, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 31 && sprawdzCzyJezykZaznaczony(php, "")) {
            emptyObject.Technologie = { $regex: php, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 32 && sprawdzCzyJezykZaznaczony(powershell, "")) {
            emptyObject.Technologie = { $regex: powershell, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 33 && sprawdzCzyJezykZaznaczony(python, "")) {
            emptyObject.Technologie = { $regex: python, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 34 && sprawdzCzyJezykZaznaczony(react, "")) {
            emptyObject.Technologie = { $regex: react, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 35 && sprawdzCzyJezykZaznaczony(ruby, "")) {
            emptyObject.Technologie = { $regex: ruby, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 36 && sprawdzCzyJezykZaznaczony(sass, "")) {
            emptyObject.Technologie = { $regex: sass, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 37 && sprawdzCzyJezykZaznaczony(scala, "")) {
            emptyObject.Technologie = { $regex: scala, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 38 && sprawdzCzyJezykZaznaczony(scrum, "")) {
            emptyObject.Technologie = { $regex: scrum, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 39 && sprawdzCzyJezykZaznaczony(spring, "")) {
            emptyObject.Technologie = { $regex: spring, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 40 && sprawdzCzyJezykZaznaczony(sql, "")) {
            emptyObject.Technologie = { $regex: sql, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 41 && sprawdzCzyJezykZaznaczony(scss, "")) {
            emptyObject.Technologie = { $regex: scss, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 42 && sprawdzCzyJezykZaznaczony(swift, "")) {
            emptyObject.Technologie = { $regex: swift, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 43 && sprawdzCzyJezykZaznaczony(vue, "")) {
            emptyObject.Technologie = { $regex: vue, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 44 && sprawdzCzyJezykZaznaczony(vb, "")) {
            emptyObject.Technologie = { $regex: vb, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          if (index == 45 && sprawdzCzyJezykZaznaczony(windows, "")) {
            emptyObject.Technologie = { $regex: windows, $options: "i" };
            arrayObjectPush.push(emptyObject);
          }
          mojObiekt = arrayObjectPush;
        }
      }
      if (mojObiekt.length == 0) {
        findInMongoDb({});
      } else {
        findInMongoDb(JSON.parse(JSON.stringify({ $and: mojObiekt })));
      }
      //WYGLĄD PRZEKAZYWANEGO OBIEKTU mojObiekt
      //  [
      //     { Technologie: { $regex: "css", $options: 'i' }},
      //     { Technologie: { $regex: "php", $options: 'i' }},
      //     {Imie: "Mateusz"}
      //   ]
    }
  });
});

// var onRequest = function (req, res) {
//   var data = '';
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   if (req.method === "GET") {
//       res.end(
//           getResponse(
//               getRoute(req),
//               getQueryParams(req)
//           )
//       );
//   } else if (req.method === "POST") {
//       //obsługa post-a
//       req.setEncoding('utf-8');
//       req.on('data', function (_data) {
//           data += _data;
//       });
//       req.on('end', function() {
//           data = qs.parse(data);
//           res.end(
//               //nasza odpowiedź
//               getResponse(
//                   getRoute(req),
//                   data
//               )
//           );

//       });
//       console.log("data z geta", data)
//   }
// }
//Ze względów bezpieczeństwa będziemy chcieli sprawdzić poprawność plików przed przesłaniem ich na nasze serwery. Wyedytujmy index.js plik i dodajmy obie funkcjonalności:
app.post("/upload-file", (req, res) => {
  // 'my_file_upload' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single(
    "my_file_upload",
  );

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    // to wysyła na strone jakiś kawałek kodu jak się uda przesyłanie pliku
    res.send(`Upload zakończono pomyślnie, Twoje dane są juz na serwerze &#128515;
      <hr/>
      <p width="500">${req.file.originalname}</p>
      <hr />
      <a class="back_home" href="./">&#9194; Powróć do strony głównej</a>`);
  });
});

app.get("/editUser", (req, res) => {
  const id = req.query.editUser;
  console.log("Id klienta index /editUser", id);
  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia database");
      client.close();
    } else {
      const db = client.db("test"); //pobieram nazwe bazy danych test
      const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
      kandydaci.find({ _id: mongo.ObjectID(id) }).toArray((err, dataFromMongo) => {
        //POD PARAMETREM dataFromMongo DOSTAJE MÓJ OBIEKT TABLICOWY Z DANYMI
        //JEŚLI JEST ERROR TO WYŚWIETL MI GO
        if (err) console.log("błąd", err.message);
        //JEŚLI NIEMA ERRORA TO WYRENDERUJ DANE
        else {
          console.log("wszystko ok /editUser", dataFromMongo);
          res.render("editUser", {
            //nazwa handlebarsa ktory ma byc wyrenderowany
            id: dataFromMongo._id,
            person: dataFromMongo,
            title: "POMOCNIK REKRUTERA",
            content: "kotent strony",
            copywright: "by Marta Jamróz Kulig",
            pathCss: "/css/main.css",
            pathCss2: "/css/editUser.css",
          });
        }
      });
    }
  });
  //WYSŁANIE UPDATE DO BAZY DANYCH
  const saveDatabase = require("./Routes/saveDatabase");
  app.use("/saveDatabase", saveDatabase);
});

//Usuwanie wybranego kandydata z bazy
const deleteDatabase = require("./Routes/deleteDatabase");
//const { nextTick } = require("process");
app.use("/deleteUser", deleteDatabase);

//Dodawanie nowego kandydata do bazy
app.post("/addedToDatabase", (req, res) => {
  //nazwa actiona i ścieżki
  res.render("addedUser", {
    //nazwa handlebarsa ktory ma byc wyrenderowany
    title: "POMOCNIK REKRUTERA",
    content: "kotent strony",
    copywright: "by Marta Jamróz Kulig",
    pathCss: "/css/main.css",
    pathCss2: "/css/editUser.css",
    pathCss3: "/css/addedToDatabase.css",
  });
  const addUserToDatabase = require("./Routes/addedToDatabase");
  app.use("/addedUser", addUserToDatabase);
});

console.time("geter");
app.get("/", function (req, res) {
  res.render("login", {
    title: "POMOCNIK REKRUTERA",
    content: "kotent strony",
    copywright: "by Marta Jamróz Kulig",
    pathCss: "/css/main.css",
    pathCss2: "/css/login.css",
  });
  const downloadData = require("./Routes/downloadData.js");
  app.use("/downloadData", downloadData);
});
console.timeEnd("geter");

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
