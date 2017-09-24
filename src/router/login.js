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
    res.render('login-consent', { challenge: req.query.challenge });
  } else {
    res.render('login');
  }
}).post((req, res) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (!user) {
      res.redirect('/');
    } else if (!user.validPassword(req.body.password)) {
      res.redirect('/');
    } else {
      req.session.user = user.dataValues;
      if (req.body.consent_flow) {
        res.redirect(`/consent?challenge=${req.body.challenge}`);
      } else {
        res.redirect('/dashboard');
      }
    }
  });
});

module.exports = router;
