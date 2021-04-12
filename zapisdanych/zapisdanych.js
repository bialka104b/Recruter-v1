const fs = require("fs");
const path = require("./my.json");

const odczyt = fs.readFileSync("./my.json");
const obciete = odczyt.slice(1);
const toChceWstawiac = '"kkk": "kkk"';
const vvv = `{
  ${toChceWstawiac}, ${obciete}`;
fs.writeFile("./my.json", vvv, (err) => {
  console.log(vvv)
});
