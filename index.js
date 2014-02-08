
var levelup = require('levelup');
var extend = require('extend');

function PouchDB(location, options) {
  options = extend(options || location || {}, {
    valueEncoding: 'json'
  });
  this._store = levelup(location || options, options);
}

PouchDB.prototype.put = function(doc, options, callback) {
  doc._rev = 'randomhashthing';
  this._store.put(doc._id, doc, options, function(err) {
    if (err) return callback.call(null, err);
    callback.call(null, null, {
      ok: true,
      id: doc._id,
      rev: 'randomhashthing'
    });
  });
};

module.exports = PouchDB;
