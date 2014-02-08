
var levelup = require('levelup');
var extend = require('extend');
var sublevel = require('level-sublevel');

function PouchDB(location, options) {
  // Make sure not to modify the options object by deep copying up front.
  var opts = extend(true, {}, options, { valueEncoding: 'json' });
  this._lastSeq = 0;
  this._db = sublevel(levelup(location, opts));
  this._changes = this._db.sublevel('changes');
  this._attachments = this._db.sublevel('attachments');
  this._docs = this._db.sublevel('docs');
  // Hook into `this._db` to insert a change document on every insertion.
  this._db.pre(function(ch, add) {
    var change = extend(true, {}, ch.value);
    var key = ++this._lastSeq;
    change.seq = key;
    add({
      type: 'put',
      key: key,
      value: change,
      prefix: this._changes
    });
  }.bind(this));
}

PouchDB.prototype.changes = function(options) {
  var changes = this._changes.createReadStream();
  // We've talked about the return value of changes being an event emitter,
  // why not just bind some listeners and return the emitter?
  changes.on('end', function() {
    console.log('done');
  });
  // Now we return `changes` and the user can hook in with whatever they want
  // changes.on('data', function(change) {}); bam
  return changes;
};

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
