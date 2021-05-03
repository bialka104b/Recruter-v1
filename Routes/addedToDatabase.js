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
    client.connect((err)=> {
        if(err) {
            console.log("błąd polaczenia /addedUser");
            client.close();
        } else {
            const db = client.db("test"); //pobieram nazwe bazy danych test
            const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
            console.log("polaczenie udane z bazą /deleteDatabase");

            kandydaci.insertOne({}, (err, res)=>{
                if(!err) {
                    console.log("wszystko ok, error jest", err);
                }else {
                    console.log("nie udało sie dodać nowej osoby o id");
                    // console.log("nie udało sie usunac osobo o id",err);
                }
            });
        }
    });
});

module.exports = app;