const express = require('express');
const config = require('../../config');
const User = require('../models/user')(config.db);

const router = express.Router();

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

router.route('/').get(sessionChecker, (req, res) => {
  if (req.query.consent_flow) {
    res.render('signup-consent', { challenge: req.query.challenge });
  } else {
    res.redirect('/');
  }
}).post((req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };

  User.create(userData).then(user => {
    req.session.user = user.dataValues;

    if (req.body.consent_flow) {
      res.redirect(`/consent?challenge=${req.body.challenge}`);
    } else {
      res.redirect('/');
    }
  }).catch(() => {
    res.redirect('/');
  });
});

module.exports = router;
