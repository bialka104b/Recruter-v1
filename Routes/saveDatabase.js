const express = require ('express') 
let app = express.Router();

const mongo = require("mongodb"); //import biblioteki mongo
const client = new mongo.MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //bez tych opcji w klamerkach nie zadziała
client.close();
console.log("Połączonie zakończone z bazą /saveDatabase rzed kolejnym connect");
// WYSYŁANIE UPDATE DO BAZY DANYCH
app.get('/', function (req, res) {
    const id = req.query.idk;
    console.log("savedatabase id klienta",id);
    
    client.connect( (err) => {
        if (err) {
          console.log("błąd polaczenia /saveDatabase");
          client.close();
        } else {
          const db = client.db("test"); //pobieram nazwe bazy danych test
          const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
          console.log("polaczenie udane z bazą /saveDatabase");
          const imie = req.query.imieSave;
          const nazwisko = req.query.nazwiskoSave;
          const email = req.query.emailSave;
          const telefon = req.query.telefonSave;
          const miejscowosc = req.query.miejscowoscSave;
          const angielski = req.query.angielskiSave;
          const niemiecki = req.query.niemieckiSave;
          const pozostaleJezyki = req.query.pozostalejezykiSave;
          const wiek = req.query.wiekSave;
          const relokacja = req.query.relokacjaSave;
          const firmyWspolpraca = req.query.firmyWspolpracaSave;
          const doswiadczenie = req.query.doswiadczenieSave;
          const widelki = req.query.widelkiSave;
          const technologie = req.query.technologieSave;
          const linkedin = req.query.linkDoProfiluSave;
          const specjalnosc = req.query.specjalnoscSave;
          const dataKontaktu = req.query.dataKontaktuSave;
          const statusZainteresowany = req.query.statusZainteresowanySave;
          const rozmowaTechniczna = req.query.rozmowaTechnicznaSave;
          const rozmowaNietechniczna = req.query.rozmowaNietechnicznaSave;
          const komentarze = req.query.komentarzeSave;
          kandydaci.updateOne(
            {_id: mongo.ObjectID(id)},
            { $set: 
                {
                    Imie: imie, 
                    Nazwisko: nazwisko, 
                    Email: email,
                    Telefon: telefon,
                    Miejscowosc: miejscowosc,
                    Angielski: angielski,
                    Niemiecki: niemiecki,
                    PozostaleJezyki: pozostaleJezyki,
                    Wiek: wiek,
                    Relokacja: relokacja,
                    Firmy_Wspolpraca: firmyWspolpraca,
                    Doswiadczenie: doswiadczenie,
                    Widelki: widelki,
                    Komentarze: komentarze,
                    Technologie: technologie,
                    Link_Do_Profilu: linkedin,
                    Specjalnosc: specjalnosc,
                    Data_kontaktu: dataKontaktu.toString(),
                    Status_Zainteresowany: statusZainteresowany,
                    Rozmowa_techniczna: rozmowaTechniczna,
                    Rozmowa_nietechniczna: rozmowaNietechniczna,
                } 
            },
            (error, res) => {
                if(!error) {
                    console.log("wszystko ok", error);
                } else {
                    client.close();
                    console.log("zamknieto baze /saveDatabase byl error");
                }
            }
          );
          res.send(`
          <div class="row finish">
            <h1>POMOCNIK REKRUTERA</h1>
            <h4>Aktualizacje zakończono pomyślnie</h4>
            <a class="back_home" href="./downloadData">&#9194; Powróć do strony głównej</a>
          </div>
          `);
        }
    });
});

module.exports = app;