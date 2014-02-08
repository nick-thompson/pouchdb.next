
var assert = require('assert');
var PouchDB = require('..');
var memdown = require('memdown');

var db = new PouchDB('', { db: memdown });

describe('sup', function() {
  it('should work', function(done) {
    var doc = { _id: 'test', test: 'hi' };
    db.put(doc, {}, function(err, res) {
      assert.equal(false, !!err);
      assert.equal(true, res.ok);
      done();
    });
  });
});
