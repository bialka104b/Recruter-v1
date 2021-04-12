const fs = require("fs");
//const odczytApi = require('../moduly/myprofile');

exports.jjj = (data, path) => {
    try {
        // fs.writeFileSync(path, JSON.stringify(data));
        fs.readFileSync(path, JSON.parse(data));
    } catch (err) {
        console.error(err)
    }
}