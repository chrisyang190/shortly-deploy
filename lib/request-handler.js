var request = require('request');
var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(error, links) {
    console.log('hi', links);
    res.send(200, links);
  });
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }).exec(function(error, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URl heaings: ', err);
          return res.sendStatus(404);
        } else {
          var newLink = new Link({
            url: uri,
            title: title,
            baseUrl: req.headers.origin,
          });
          newLink.save(function(err, newLink) { res.send(200, newLink); });
        }
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username})
    .exec(function(error, user) {
      // console.log(user);
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(user.password, password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(error, user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });

        newUser.save(function(error, newUser) {
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]})
    .exec(function(error, link) {
      if (!link) {
        res.redirect('/');
      } else {
        link.visits++;
        link.save(function(error, link) {
          return res.redirect(link.url);
        });
      }
    });
};