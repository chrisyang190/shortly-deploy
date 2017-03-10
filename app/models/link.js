var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  // removed unique ids. Mongo operates in terms of collections no need for row defining ids
  'url': String,
  'baseUrl': String,
  'code': String,
  'title': String,
  'visits': Number
});

// hooks this anonymous function prior to invoking save on model document
linkSchema.pre('save', function(next) {
  
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  var code = shasum.digest('hex').slice(0, 5);
  
  // code is the hash
  this.code = code;
  next();
});

var Link = mongoose.model('Link', linkSchema);

// outisde modules referring to Link operate on the model
module.exports = Link;
