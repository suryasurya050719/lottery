const randomstring = require("randomstring");
const uniqueId = (_length) => {
  // return randomstring.generate(10);
  return randomstring.generate({
    length: _length,
    charset: "numeric",
  });
};

module.exports = {
  uniqueId,
};
