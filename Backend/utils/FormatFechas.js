exports.formatFecha = (arraytUnformat, camposFecha) => {
  let arrayFomat = [];
  for (let i = 0; i < arraytUnformat.length; i++) {
    let el = { ...arraytUnformat[i] };
    for (var j in camposFecha) {
      try {
        el[camposFecha[j]] = arraytUnformat[i][camposFecha[j]]
          ?.toISOString()
          .replace("T", " ")
          .split(".")[0];
      } catch (error) {
        el[camposFecha[j]] = "";
      }
    }
    arrayFomat.push(el);
  }
  return arrayFomat;
};
