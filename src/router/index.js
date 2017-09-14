const express = require('express');
const router = express.Router();

const consent = require('./consent');
const signup = require('./signup');
const login = require('./login');
const logout = require('./logout');
const dashboard = require('./dashboard');

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

router.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

router.use('/consent', consent);
router.use('/login', login);
router.use('/logout', logout);
router.use('/signup', signup);
router.use('/dashboard', dashboard);

module.exports = router;
