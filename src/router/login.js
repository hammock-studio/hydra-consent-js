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
  res.sendFile(path.dirname(__dirname) + '/templates/login.html');
})
.post((req, res) => {
  const username = req.body.username,
    password = req.body.password;

    User.findOne({ where: { username: username  }}).then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else if (!user.validPassword(password)) {
        res.redirect('/login');
      } else {
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
      }
    });
});

module.exports = router;
