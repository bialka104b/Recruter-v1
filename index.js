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
  // if (err) {
  //   console.log("błąd polaczenia database");
  // } else {
  //   console.log("polaczenie udane z bazą");
  //   const db = client.db("test"); //pobieram nazwe bazy danych
  //   const cars = db.collection("cars"); // nazwa naszej kolekcji
  //   //...tu sobie coś kodzimy
  //   let model = Math.random() * 100;
  //   cars.insertOne({ brand: "Samochód", model: model }, (err) => {
  //     if(!err) {
  //       client.close();
  //     }
  //   });

  //zamknij baze po 3 sekundach aby zdążyły wykonać się operacje
  //mongo nie zezwala na wiele połączeń więc jeśli kilka razy chce sie łączyć
  // setTimeout(function () {
  //   client.close();
  // }, 1000);
  // }

  //połączenie sie z baza mongo db
  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia database");
      client.close();
    } else {
      const db = client.db("test"); //pobieram nazwe bazy danych test
      
      const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
      const imie = req.query.imie;
      const nazwisko = req.query.nazwisko;
      const email = req.query.email;
      const miejscowosc = req.query.miejscowosc;
      const telefon = req.query.telefon;
      const specjalnosc = req.query.specjalnosc; // narazie brak pola w bazie danych
      const technologie = req.query.technologie;
      const doswiadczenie = req.query.doswiadczenie;
      
      //ZMIENNE DO CHECKBOX JĘZYKI OBCE
      const angielskiLevel = req.query.angielskiLevel.toLocaleUpperCase();
      const angielski = sprawdzCzyJezykZaznaczony(req.query.angielski, angielskiLevel);
      
      const niemiecki = "";
      const pozostalejezyki = "";
      // const hiszpanski = sprawdzCzyJezykZaznaczony(req.query.hiszpanski);
      // const rosyjski = sprawdzCzyJezykZaznaczony(req.query.rosyjski);
      // const francuski = sprawdzCzyJezykZaznaczony(req.query.francuski);
      // const ukrainski = sprawdzCzyJezykZaznaczony(req.query.ukrainski);
      // const polski = sprawdzCzyJezykZaznaczony(req.query.polski);

      //FUNKCJA SPRAWDZA CZY JEZYKI SĄ ZAZNACZONE CZY NIE
      function sprawdzCzyJezykZaznaczony(params, jezykLvl) {
        if (params) {
          let result = `${params} ${jezykLvl}`;
          console.log("zaznaczone true", result);
          return result;
        } else {
          console.log("zaznaczone false", false);
          return '';
        }
      }

      console.log("co zawiera angielski teraz ", angielski);
      console.log("polaczenie udane z bazą");
  
      
      //SZUKANIE PO ZAWIERANIU SIE SŁOWA
      // const miejscowosc1 = kandydaci.find( { Technologie: {$regex:"HTML"}} ).toArray((err, dataFromMongo) => {
      //   console.log(dataFromMongo);
      // });
      //console.log("RESULT_________________", miejscowosc1);

      //FUNKCJA POTRZEBNA DO RENDEROWANIA INFORMACJI Z BAZY DANYCH NA STRONE
      function findInMongoDb(params) {
        kandydaci.find(params).toArray((err, dataFromMongo) => {
          //POD PARAMETREM dataFromMongo DOSTAJE MÓJ OBIEKT TABLICOWY Z DANYMI
          //OBIEKT DO RENDEROWANIA
          const objectRender = {
            person: dataFromMongo,
            title: "tytuł strony",
            content: "kotent strony",
            pathCss: "/css/main.css",
          }
          //JEŚLI JEST ERROR TO WYŚWIETL MI GO
          if (err) console.log("błąd", err.message);
          //JEŚLI NIEMA ERRORA TO WYRENDERUJ DANE
          else {
            res.render("home", objectRender);
          }
        });
      }
      
      //TU MAMY PRZYPADKI GDZIE POLE TECHNOLOGIE JEST WPROWADZONE
      if(technologie != ""){
        //NAZWISKO PUSTE
        
          // 1 000 000  - pierwsza 8
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Miejscowosc: {$regex : miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Nazwisko: {$regex : nazwisko}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Nazwisko: {$regex : nazwisko}, Miejscowosc: {$regex : miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Pozostale_Jezyki: {$regex : pozostalejezyki}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Pozostale_Jezyki: {$regex : pozostalejezyki}, Miejscowosc: {$regex : miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Pozostale_Jezyki: {$regex : pozostalejezyki}, Nazwisko: {$regex : miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Pozostale_Jezyki: {$regex : pozostalejezyki}, Nazwisko: {$regex : miejscowosc}, Miejscowosc: {$regex : miejscowosc}});
          }
          //1 001 000 - druga 8
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Miejscowosc: {$regex: miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Nazwisko: {$regex: nazwisko}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Nazwisko: {$regex: nazwisko}, Miejscowosc: {$regex: miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Pozostale_Jezyki: {$regex: pozostalejezyki}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Pozostale_Jezyki: {$regex: pozostalejezyki}, Miejscowosc: {$regex: miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Niemiecki: {$regex: niemiecki}, Pozostale_Jezyki: {$regex: pozostalejezyki}, Nazwisko: {$regex: nazwisko}});
          }
          if(technologie != "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Niemiecki: {$regex: niemiecki}, 
              Pozostale_Jezyki: {$regex: pozostalejezyki}, 
              Nazwisko: {$regex: nazwisko}, 
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          // 1 010 000  - trzecia 8
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Angielski: {$regex: angielski}});
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({Technologie:{$regex: technologie}, Angielski: {$regex: angielski}, Miejscowosc: {$regex: miejscowosc}});
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({Technologie:{$regex: technologie}, Angielski: {$regex: angielski}, Nazwisko: {$regex: nazwisko}});
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Angielski: {$regex: angielski}, 
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          //1 011 000 - czwarta 8
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          // 1 100 000  - piata 8
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          //1 101 000 - szosta 8
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie}, 
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          // 1 110 000 - siodma 8
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          
          //1 111 000 - osma 8
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie != "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Technologie:{$regex: technologie},
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
      }




      //_________________________________________________________________________________________
      //_________________________________________________________________________________________
      //_________________________________________________________________________________________
      //TECHNOLOGIE NIE SĄ WPROWADZONE
      if(technologie == ""){
        
          // 0 000 000  - pierwsza 8
          // 0 000 000  - pierwsza 8
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Pozostale_Jezyki:{$regex:pozostalejezyki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Pozostale_Jezyki:{$regex:pozostalejezyki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }
        //0 001 000 - druga 8
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }

        // 0 010 000  - trzecia 8
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Pozostale_Jezyki:{$regex:pozostalejezyki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }

        //0 011 000 - czwarta 8
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Miejscowosc:{$regex:miejscowosc}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}});
        }
        if(technologie == "" && specjalnosc == "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
          findInMongoDb({Angielski:{$regex: angielski}, Niemiecki:{$regex: niemiecki}, Pozostale_Jezyki:{$regex:pozostalejezyki}, Nazwisko:{$regex:nazwisko}, Miejscowosc:{$regex:miejscowosc}});
        }

          // 0 100 000  - piata 8
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          //0 101 000 - szosta 8
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski == "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }

          // 0 110 000 - siodma 8
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki == "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          
          //0 111 000 - osma 8
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki == "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko == "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc == ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko}
            });
          }
          if(technologie == "" && specjalnosc != "" && angielski != "" && niemiecki != "" && pozostalejezyki != "" && nazwisko != "" && miejscowosc != ""){
            findInMongoDb({
              Specjalnosc: {$regex: specjalnosc},
              Angielski: {$regex: angielski},
              Niemiecki: {$regex: niemiecki},
              Pozostale_Jezyki: {$regex: pozostalejezyki},
              Nazwisko: {$regex: nazwisko},
              Miejscowosc: {$regex: miejscowosc}
            });
          }
        
      }
      
      

      // kandydaci.find({ $and: [
      //   {$or: [{Imie: this}, {Imie : imie} ] },
      //   //{$or: [ {Nazwisko: nazwisko}, null ] }, 
      //   // { Specjalnosc: specjalnosc}
      //   //{$or: [ {Email: email}, null ]},
      //   // {$or: [ {Telefon: telefon}, {Telefon: {$ne:''}} ]},
      //   // { Miejscowosc: {$regex:miejscowosc}},
      //   { Angielski: angielski}
      // ]}).toArray((err, data) => {
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

      //res.send(`${wyslij._idObject('607f4780074123cb79e10533')}`);//tutaj mamy imie
      // setTimeout(function () {

      //     client.close();
      // }, 3000);
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
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
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

app.get("/", function (req, res) {
  res.render("home", {
    //imie : imie,
    title: "tytuł strony",
    content: "kotent strony",
    pathCss: "/css/main.css",
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
