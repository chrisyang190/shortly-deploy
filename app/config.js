var path = require('path');
var mongoose = require('mongoose');

var mongoUrl = 'mongodb://localhost';
// creates a pending connection
mongoose.connect(mongoUrl);

// initialize db to be the mongoose connection to the mongodb
var db = mongoose.connection;
db.on('error', console.error.bind('console', 'Error in connection: '));
db.once('open', function() {
  console.log('Mongo connection acquired!');
});

module.exports = db;