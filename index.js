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
const client = new mongo.MongoClient("mongodb://localhost:27017", {
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

//W tym miejscu zdefiniujmy lokalizację przechowywania naszych plików
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
    // var lista = fs.createReadStream(data, {
    //   encoding: "utf8"
    // })
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
  //   console.log('sciezka', dirname);
});
//console.log(readFileDataDir);

//obserwowanie pliku Lista.json i zapisywanie danych do pliku baza.json
//działa tylko po zapisaniu pliku w edytorze
//FUNKCJA DO PARSOWANIA
function parsuj(data) {
  const dane = JSON.parse(data);
  return dane;
}
fs.watch(file("Lista.json"), function (eventType, filename) {
  fs.readFile(file(filename), function (err, data) {
    //JSON.parse()pobiera ciąg JSON i przekształca go w obiekt JavaScript.
    //JSON.stringify()pobiera obiekt JavaScript i przekształca go w ciąg JSON.
    console.log("jaki typ1", typeof data);
    if (!err) {
      let dane = data;
      //const hhh = JSON.parse(JSON.stringify(dane));
      // console.log("jaki typ", typeof dane);
      // console.log("hh techn", dane);
      // const buffer = Buffer.from(data, 'utf-8')
      // console.log("bufferh: ", buffer.toString());
      // const hhh = JSON.parse(dane.toString());
      //console.log("hhh: ", hhh);

      const jsonText = parsuj(JSON.stringify(dane)); //.toString()
      console.log("technologia typ", typeof jsonText);
      console.log("technologia", jsonText.technologie);

      fs.readFile(file("baza.json"), "utf-8", (err, data) => {
        if (!err) {
          // console.log("data przed stringi", data);
          // data = JSON.stringify(jsonText);
          // console.log("data po stringi", jsonText);
          // console.log("typ jsonText", typeof jsonText);

          //odczytuje zawartośc Lista json
          const zmienna = fs.readFileSync(file("Lista.json").toString());
          const zmienna1 = zmienna.toString();
          const listaJson = parsuj(zmienna1);
          console.log("listaJson: ", listaJson);
          //console.log("listaJson.lp", listaJson.lp); //w tym miejscu dostałam sie do obiektów tego jsona

          //odczytajmy jeszcze dane z pliku baza.json aby połaczyć dane z obu plików
          const bazaJson = fs.readFileSync(file("baza.json").toString());
          const bazaJson1 = bazaJson.toString();
          const bazaJsonObject = parsuj(bazaJson1);
          console.log("bazaJsonObject", bazaJsonObject);

          //tworze nazwy pusty obiekt ktory trafi docelowo do pliku baza.json
          let polaczonyBazaILista = {};

          //następuje tutaj zamiana obiektu bazaJsonObiekt na tablice
          let arr = [];
          for (let key in bazaJsonObject) {
            //petle te iteruja od 0
            //console.log("ile wynosi to key bazaJSONOBJECT? ", key);
            arr.push(bazaJsonObject[key.toString()]);
            //console.log("arr", arr[key]);
          }
          polaczonyBazaILista = arr; //przypisuje przetworzona tablice do tego co ma wylądowac w pliku baza.json
          //console.log("polaczonyBazaILista po petli", polaczonyBazaILista);

          //następuje tutaj zamiana obiektu listaJson na tablice
          let arrayZmienna2 = [];
          for (let key in listaJson) {
            //petle te iteruja od 0
            arrayZmienna2.push(listaJson[key.toString()]);
            console.log("arr zmienna2", arrayZmienna2[key]);
          }
          console.log("arrayZmienna2[0]", arrayZmienna2[0]);
          for (const key in arrayZmienna2) {
            polaczonyBazaILista.push(arrayZmienna2[key]);
          }
          console.log("polaczonyBazaILista po push arrayzmienna2", polaczonyBazaILista);

          //Tutaj mam kodowanie obiektu JS na buffer
          const moje_dane = JSON.stringify(polaczonyBazaILista);
          const buf1 = Buffer.from(moje_dane);
          //console.log("odkodowane", buf1);

          //tutaj następuje automatyczny zapis do pliku z odkodowanym bufferem,callback słuzy tylko do obsługi błędów
          fs.writeFile(file("baza.json"), buf1, "utf-8", (err) => {
            if (err) {
              console.log("cos poszło nie tak przy zapisywaniu baza.json", err.message);
            } else {
              console.log("Plik zapisany pomyślnie\n");
              // console.log("Napis ma następującą zawartość:");
              // console.log(parsuj(fs.readFileSync(file("baza.json"), "utf8")));
            }
          });
        } else {
          console.log(err.message);
          return err.message;
        }
      });
      // if (!err) {
      //   var dane = data;
      //   console.log("dane ", dane);
      //   const jsonText = parsuj(dane);
      //   console.log("dane do zapisu", jsonText);
      //   fs.writeFile(file("baza.json"), data, () => {
      //       console.log("mamamamamam");
      //   });
      // }
      // else {
      //   console.log("mój error", err.message);
      // }
    }

    // if (!err) {
    //   fs.writeFile(file("baza.json"), data, () => {
    //     console.log(data);
    //   });
    // }
    //file(filename).close();
  });
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
      const technologie = req.query.technologie;
      const specjalnosc = req.query.specjalnosc; // narazie brak pola w bazie danych
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
      //console.log("co zawiera angielski teraz", angielski);

      //NIEMIECKI
      const niemieckiLevel = req.query.niemieckiLevel;
      let niemiecki = sprawdzCzyJezykZaznaczony(req.query.Niemiecki, niemieckiLevel); //trim obcina biale znaki na poczatku i koncu
      if (niemiecki != false) {
        niemiecki = capitalize(niemiecki.trim());
      }
      //console.log("co zawiera niemiecki teraz", niemiecki);

      //INNE JĘZYKI
      let pozostalejezyki = req.query.Pozostale_Jezyki;
      //console.log("co zawiera pozostale teraz", pozostalejezyki);
      console.log("polaczenie udane z bazą strona główna");

      //FUNKCJA POTRZEBNA DO RENDEROWANIA INFORMACJI Z BAZY DANYCH NA STRONE
      
      function findInMongoDb(params) {
        kandydaci.find(params).toArray((err, dataFromMongo) => {
          //POD PARAMETREM dataFromMongo DOSTAJE MÓJ OBIEKT TABLICOWY Z DANYMI
          //OBIEKT DO RENDEROWANIA
          const objectRender = {
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
      console.time('poczatek');
      if (technologie != "") {
        //NAZWISKO PUSTE
        if (specjalnosc == "") {
          
          if(angielski == ""){
            // 1 000 000  - pierwsza 8
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({ Technologie: { $regex: technologie } });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: miejscowosc },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            //1 001 000 - druga 8
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski == "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
          }
          
          if(angielski != ""){
            // 1 010 000  - trzecia 8
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki == "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }

            //1 011 000 - czwarta 8
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki == "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko == "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc == ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
              });
            }
            if (
              technologie != "" &&
              specjalnosc == "" &&
              angielski != "" &&
              niemiecki != "" &&
              pozostalejezyki != "" &&
              nazwisko != "" &&
              miejscowosc != ""
            ) {
              findInMongoDb({
                Technologie: { $regex: technologie },
                Angielski: { $regex: angielski },
                Niemiecki: { $regex: niemiecki },
                Pozostale_Jezyki: { $regex: pozostalejezyki },
                Nazwisko: { $regex: nazwisko },
                Miejscowosc: { $regex: miejscowosc },
              });
            }
          }
        }

        if(specjalnosc != ""){
          // 1 100 000  - piata 8
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }

          //1 101 000 - szosta 8
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }

          // 1 110 000 - siodma 8
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }

          //1 111 000 - osma 8
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie != "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Technologie: { $regex: technologie },
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
        }
      }
      console.timeEnd('poczatek');

      //_________________________________________________________________________________________
      //TECHNOLOGIE NIE SĄ WPROWADZONE
      if (technologie == "") {
        
        if(specjalnosc == "") {
          // 0 000 000  - pierwsza 8
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({});
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          //0 001 000 - druga 8
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
  
          // 0 010 000  - trzecia 8
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({ Angielski: { $regex: angielski } });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({ Angielski: { $regex: angielski }, Miejscowosc: { $regex: miejscowosc } });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({ Angielski: { $regex: angielski }, Nazwisko: { $regex: nazwisko } });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
  
          //0 011 000 - czwarta 8
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({ Angielski: { $regex: angielski }, Niemiecki: { $regex: niemiecki } });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc == "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
        }
        
        if(specjalnosc != ""){
          // 0 100 000  - piata 8
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
  
          //0 101 000 - szosta 8
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski == "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
  
          // 0 110 000 - siodma 8
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki == "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
  
          //0 111 000 - osma 8
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki == "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko == "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc == ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
            });
          }
          if (
            technologie == "" &&
            specjalnosc != "" &&
            angielski != "" &&
            niemiecki != "" &&
            pozostalejezyki != "" &&
            nazwisko != "" &&
            miejscowosc != ""
          ) {
            findInMongoDb({
              Specjalnosc: { $regex: specjalnosc },
              Angielski: { $regex: angielski },
              Niemiecki: { $regex: niemiecki },
              Pozostale_Jezyki: { $regex: pozostalejezyki },
              Nazwisko: { $regex: nazwisko },
              Miejscowosc: { $regex: miejscowosc },
            });
          }
        }
      }
      
      // kandydaci.find({}).toArray((err, data) => {
      //   if (err) console.log("błąd", err.message);
      //   else {
      //     console.log("moje dane", data);
      //     // let noweNazwisko = [];
      //     // for (const key in data) {
      //     //   console.log(data[key]);
      //     //   noweNazwisko.push(Object.values(data[key])[2]);
      //     //   //console.log("noweNazwisko", noweNazwisko);
      //     // }
      //   }
      // });
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
  const id = req.query._id;
  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia database");
      client.close();
    } else {
      const db = client.db("test"); //pobieram nazwe bazy danych test
      const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
      kandydaci.find({_id: mongo.ObjectID(id)}).toArray((err, dataFromMongo) => {
        //POD PARAMETREM dataFromMongo DOSTAJE MÓJ OBIEKT TABLICOWY Z DANYMI
        //JEŚLI JEST ERROR TO WYŚWIETL MI GO
        if (err) console.log("błąd", err.message);
        //JEŚLI NIEMA ERRORA TO WYRENDERUJ DANE
        else {
          console.log("wszystko ok /editUser", dataFromMongo);
          res.render("editUser", {
            id : id,
            person : dataFromMongo,
            title: "POMOCNIK REKRUTERA",
            content: "kotent strony",
            copywright: "by Marta Jamróz Kulig",
            pathCss: "/css/main.css",
            pathCss2: "/css/editUser.css"
          });
          client.close();
          console.log("zamknieto baze /editUser");
        }
      }
    )};
  });
  //WYSŁANIE UPDATE DO BAZY DANYCH
  const saveDatabase = require('./Routes/saveDatabase');
  app.use('/saveDatabase',saveDatabase);
});

app.get("/", function (req, res) {
  res.render("home", {
    title: "POMOCNIK REKRUTERA",
    content: "kotent strony",
    copywright: "by Marta Jamróz Kulig",
    pathCss: "/css/main.css",
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
