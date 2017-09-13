const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../config');
const User = require('../models/user')(config.db);

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

router.route('/')
  .get(sessionChecker, (req, res) => {
    res.sendFile(path.dirname(__dirname) + '/templates/signup.html');
  })
  .post((req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
  })
  .then(user => {
    req.session.user = user.dataValues;
    res.redirect('/dashboard');
  })
  .catch(error => {
    res.redirect('/signup');
  });
});

module.exports = router;
