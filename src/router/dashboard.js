const express = require('express');

const router = express.Router();

const sessionChecker = (req, res, next) => {
  if (
    req.session.user &&
    req.cookies.user_sid &&
    req.session.user.access_token
  ) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/', sessionChecker, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;
