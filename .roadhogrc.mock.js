const mock = {};
require('fs').readdirSync(require('path').join(__dirname + '/mock')).forEach(function(file) {
  console.log("mock file=" + file);
  Object.assign(mock, require('./mock/' + file))
});
console.log("mock=" + Object.keys(mock));
module.exports = mock
