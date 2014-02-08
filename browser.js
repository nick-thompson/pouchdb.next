
var PouchDB = require('./');
var leveljs = require('level-js');
var extend = require('extend');

// We can do some checking here to choose a better backend than
// IndexedDB, but for simplicity's sake I'm just going to assume we
// decided upon IndexedDB in your browser.

function factory(location, options) {
  opts = extend(opts, {
    db: leveljs
  });
  return new PouchDB(location, opts);
}

module.exports = factory;
