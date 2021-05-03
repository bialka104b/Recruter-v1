const express = require ('express');
let app = express.Router();

app.get("/", (req, res) => {
    const id = req.query._id;
    // console.log(id);
    res.render();
    console.log("wyglada na to że działa editUserczy to działa?");
    res.send(
      `
      <h1>Tutaj możesz edytować dane Kandydata o id=${id} &#128515;</h1>
      <div class="row">
        <div class="col-md-6">
          <form action="/saveDatabase" method="get">
            <label for="id">ID KANDYDATA</label>
            <input type="text" name="idk" id="idk" value="${id}">
            <div class="opakowanie">
              <label for="komentarz">Wpisz komentarz:</label>
              <input type="text" name="komentarz" id="komentarz">
            </div>
            <div class="opakowanie">
              <label for="telefon">Wpisz telefon:</label>
              <input type="text" name="telefon" id="telefon">
            </div>
            <button type="submit">wyslij</button>
          </form>
        </div>
        <div class="col-md-6"></div>
      </div>
      <a class="back_home" href="./">&#9194; Powróć do strony głównej</a>`
    );
});

// module.exports = app;