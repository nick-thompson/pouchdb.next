
var assert = require('assert');
var PouchDB = require('..');
var memdown = require('memdown');

var db = new PouchDB('', { db: memdown });

describe('sup', function() {
  var doc = {
    _id: 'test',
    test: 'hi'
  };

  it('should put', function(done) {
    db.put(doc, function(err, res) {
      assert.equal(false, !!err);
      assert.equal(true, res.ok);
      done();
    });
  });

  it('should get', function(done) {
    db.get(doc._id, function(err, doc) {
      assert.equal(false, !!err);
      assert.equal('hi', doc.test);
      done();
    });
  });

});
