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
//połączenie z bazą MONGODB
client.connect((err) => {
  if (err) {
    console.log("błąd polaczenia database");
  } else {
    console.log("polaczenie udane z bazą");
    const db = client.db("test"); //pobieram nazwe bazy danych
    const cars = db.collection("cars"); // nazwa naszej kolekcji
    //...tu sobie coś kodzimy
    cars.insertOne({ brand: "Samochód", model: "HDHDHDHHDHD" });
    console.log(
      cars.find({}).toArray((err, data) => {
        if (err) {
          console.log("wyskoczyl błąd przy szukaniu");
        } else {
          console.log("Klienci: ", data);
        }
      }),
    );
    //zamknij baze
    client.close(); //zamknij baze
  }
});

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

  // By default, multer removes file extensions so let's add them back
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
            console.log("ile wynosi to key bazaJSONOBJECT? ", key);
            arr.push(bazaJsonObject[key.toString()]);
            console.log("arr", arr[key]);
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
    title: "tytuł strony",
    content: "kotent strony",
    pathCss: "/css/main.css",
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Serwer został uruchomiony pod adresem http://localhost:8080");
});
