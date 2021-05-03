//FUNKCJA KTÓRA ZAMIENIA PIERWSZĄ LITERE NA DUŻĄ
const capitalize = (text) => {
    const words = [];
    for (const word of text.split(" ")) {
      words.push(word[0].toUpperCase() + word.slice(1));
    }
    return words.join(" ");
};
//console.log("capitalize funkcja", capitalize("angielski b1, niemiecki")); //result Angielski B1, Niemiecki
module.exports = capitalize;