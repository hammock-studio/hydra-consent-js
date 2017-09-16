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
  if (req.query.consent_flow){
    res.render('signup-consent', { challenge: req.query.challenge });
  } else {
    res.render('signup');
  };
})
.post((req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const challenge = req.body.challenge;
  const consent_flow = req.body.consent_flow;

  User.create({username, email, password}).then(user => {
    req.session.user = user.dataValues;

    if(consent_flow) {
      res.redirect(`/consent?challenge=${challenge}`);
    } else {
      res.redirect('/dashboard');
    }
  })
  .catch(error => {
    res.redirect('/');
  });
});

module.exports = router;
