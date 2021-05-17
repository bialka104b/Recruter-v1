const express = require("express");
let app = express.Router();

const mongo = require("mongodb"); //import biblioteki mongo
const client = new mongo.MongoClient("mongodb://51.195.103.100:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //bez tych opcji w klamerkach nie zadziała
client.close(); //zamkniecie bazy na wszelki wypadek
console.log("Połączonie zakończone z bazą /deleteDatabase przed kolejnym connect");

app.get("/", (req, res) => {
  const id = req.query.deleteUser;
  console.log(id);
  console.log(req.query);
  console.log("wyglada na to że działa deleteUser czy to działa?");

  client.connect((err) => {
    if (err) {
      console.log("błąd polaczenia /deleteDatabase");
      client.close();
    } else {
      const db = client.db("test"); //pobieram nazwe bazy danych test
      const kandydaci = db.collection("kandydaci"); // nazwa naszej kolekcji
      console.log("polaczenie udane z bazą /deleteDatabase");
      
      kandydaci.deleteOne({_id: mongo.ObjectId(id)}, (err, res) => {
        if(!err) {
          console.log("wszystko ok, error jest", err);
        }else {
          console.log("nie udało sie usunac osobo o id", id);
          console.log("nie udało sie usunac osobo o id",err);
        }
      });
  
      res.send(
        `<h1>Skasowano dane Kandydata o id=${id} &#128515;</h1>
        <a class="back_home" href="./downloadData?login=&password=">&#9194; Powróć do strony głównej</a>`
      );
    }
    
  });
});

module.exports = app;
