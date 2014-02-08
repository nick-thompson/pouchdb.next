
var levelup = require('levelup');
var extend = require('extend');

function PouchDB(location, options) {
  // Make sure not to modify the options object by deep copying up front.
  var opts = extend(true, {}, options, { valueEncoding: 'json' });
  // We may choose to go with level-sublevel, in which case we'll be constructing
  // several stores here (changes, attachments, docs).
  this._store = levelup(location, opts);
}

/**
 * This is kind of the `magic` document insertion function. It will assume
 * that all documents passed to it are deep copies of the original arguments
 * to top-level API methods, so it is free to modify in place at will.
 *
 * @param {Array} docs
 * @param {object} options
 * @param {function} callback (err, result)
 */
PouchDB.prototype._insert = function(docs, options, callback) {
  // Here we'll do things like assign ids to documents without ids, generate
  // revs if there are no revs, etc.
  docs.forEach(function(doc) {
    // Obviously we'll use the bulk api here, but, for simplicity's sake...
    doc._rev = 'randomhashthing';
    this._store.put(doc._id, doc, null, function(err) {
      if (err) return callback.call(null, err);
      callback.call(null, null, {
        ok: true,
        id: doc._id,
        rev: 'randomhashthing'
      });
    });
  });
};

PouchDB.prototype.put = function(doc, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }
  // Deep copy document to avoid writing over the user's stuff
  doc = extend(true, {}, doc);
  this._insert([doc], opts, callback);
};

PouchDB.prototype.get = function(id, opts, callback) {
  callback = callback || opts;
  this._store.get(id, null, callback);
};

module.exports = PouchDB;
