var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  'username': { type: String, index: { unique: true } },
  'password': String,
});


userSchema.methods.comparePassword = function(storedPassword, attemptedPassword, callback) {
  bcrypt.compare(storedPassword, attemptedPassword, function(err, isMatch) {
    if (err) { 
      callback(err); 
    } else {
      console.log('passwords', storedPassword, attemptedPassword)
      callback(null, isMatch);
    }
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

var User = mongoose.model('User', userSchema);

// outisde modules referring to User operate on the model
module.exports = User;
