const sprawdzCzyJezykZaznaczony = (params, jezykLvl) => {
    if (params) {
      let result = `${params} ${jezykLvl}`;
      //console.log("zaznaczone true", result);
      return result;
    } else {
      //console.log("zaznaczone false", false, "pusty string");
      return false;
    }
}

module.exports = sprawdzCzyJezykZaznaczony;