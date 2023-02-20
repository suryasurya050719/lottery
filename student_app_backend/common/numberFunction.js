function justNumbers(value) {
  var numStr = value.replace(/[^0-9]/g, "");
  return parseInt(numStr);
}

module.exports = {
  justNumbers,
};
