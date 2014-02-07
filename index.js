
var levelup = require('levelup');
var extend = require('extend');

function PouchDB(location, options) {
  options = extend(options || location || {}, {
    valueEncoding: 'json'
  });
  this._store = levelup(location || options, options);
}

PouchDB.prototype.put = function(doc, options, callback) {
  this._store.put(doc._id, doc, options, callback);
};

module.exports = PouchDB;
