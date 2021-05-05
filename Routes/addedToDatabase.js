const express = require("express");
let app = express.Router();

const mongo = require("mongodb"); //import biblioteki mongo
const client = new mongo.MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //bez tych opcji w klamerkach nie zadziała
client.close(); //zamkniecie bazy na wszelki wypadek
console.log("Połączonie zakończone z bazą /deleteDatabase przed kolejnym connect");

app.get("/", (req, res) => {
    console.log("wyglada na to że działa /addedUser");

    //POBRANIE WARTOSCI Z WYRENDEROWANEGO FORMULARZA
    const imie = req.query.imieAdd;
    const nazwisko = req.query.nazwiskoAdd;
    const email = req.query.emailAdd;
    const telefon = req.query.telefonAdd;
    const miejscowosc = req.query.miejscowoscAdd;
    const angielski = req.query.angielskiAdd;
    const niemiecki = req.query.niemieckiAdd;
    const pozostalejezyki = req.query.pozostalejezykiAdd;
    const wiek = req.query.wiekAdd;
    const relokacja = req.query.relokacjaAdd;
    const firmyWspolpraca = req.query.firmyWspolpracaAdd;
    const doswiadczenie = req.query.doswiadczenieAdd;
    const widelki = req.query.widelkiAdd;
    const technologie = req.query.technologieAdd;
    const specjalnosc = req.query.specjalnoscAdd; // narazie brak pola w bazie danych
    const dataKontaktu = req.query.dataKontaktuAdd;
    const komentarze = req.query.komentarzeAdd;
    const linkDoProfilu = req.query.linkDoProfiluAdd;
    const rTechniczna = req.query.rozmowaTechnicznaAdd;
    const rNietechniczna = req.query.rozmowaNietechnicznaAdd;

    client.connect((err)=> {
        if(err) {
            console.log("błąd polaczenia /addedUser");
            client.close();
        } else {
            const db = client.db("test"); //pobieram nazwe bazy danych test
            const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
            console.log("polaczenie udane z bazą /addedDatabase");

            kandydaci.insertOne({
                Imie: imie,
                Nazwisko: nazwisko,
                Email: email,
                Telefon: telefon,
                Miejscowosc: miejscowosc,
                Angielski: angielski,
                Niemiecki: niemiecki,
                Pozostale_Jezyki: pozostalejezyki,
                Wiek: wiek,
                Relokacja: relokacja,
                Firmy_Wspolpraca: firmyWspolpraca,
                Doswiadczenie: doswiadczenie,
                Widelki: widelki,
                Technologie: technologie,
                Specjalnosc: specjalnosc,
                Data_kontaktu: dataKontaktu,
                Komentarze: komentarze,
                Link_Do_Profilu: linkDoProfilu,
                Rozmowa_techniczna: rTechniczna,
                Rozmowa_nietechniczna: rNietechniczna
            }, (err, res)=>{
                if(!err) {
                    console.log("wszystko ok, error jest", err);
                }else {
                    console.log("nie udało sie dodać nowej osoby o id");
                    // console.log("nie udało sie usunac osobo o id",err);
                }
            });

            res.send(
                `<div class="row finish">
                    <h1>POMOCNIK REKRUTERA</h1>
                    <h4>Dodawanie zakończono pomyślnie</h4>
                    <a class="back_home" href="./downloadData">&#9194; Powróć do strony głównej</a>
                </div>`
            );
        }
    });
});

module.exports = app;