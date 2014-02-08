
var PouchDB = require('./');
var extend = require('extend');

var leveljs = require('level-js');
var memdown = require('memdown');

// Some hax to help me make this example more clear
var BROWSER_SUPPORTS_IDB = true;

// So the point here is that the auto-detection and selection of preferred
// pouchdb adapter is done outside the core PouchDB module, and rather it's
// done here in the browserify entrypoint because this is the only place that
// it's relevant.
//
// That is to say that, if you're going to use PouchDB in node, we'll ask that
// you specify your own adapter (it's super easy, commonjs, etc), and if you
// want to use the nicely pre-built pouchdb.js, we've already prepared several
// adapters and chosen the best one for you.

var preferredAdapter = BROWSER_SUPPORTS_IDB
  ? leveljs
  : memdown;

// We expose a factory method for generating pouchdb instances pre-allocated
// with the preferred adaptor. We can also expose the PouchDB constructor itself
// in case a user wants to specify their own adapter on the client, but, again,
// this is just an example for demonstration's sake.
function factory(location, options) {
  opts = extend(opts, {
    db: preferredAdapter
  });
  return new PouchDB(location, opts);
}

// Do some classic multi-code-style exposing of the factory function here.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = factory;
} else {
  window.pouchdb = factory;
}
