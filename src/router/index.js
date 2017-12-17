
const hydraSDK = require('../helpers/hydra-sdk');
const express = require('express');

const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/signup', require('./signup'));
router.use('/consent', require('./consent'));
router.use('/dashboard', require('./dashboard'));

const sessionChecker = (req, res, next) => {
  if (
    req.session.user &&
    req.cookies.user_sid &&
    req.session.user.access_token
  ) {
    if (req.session.user.admin) {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    next();
  }
};

router.get('/', sessionChecker, (req, res) => {
  res.redirect(hydraSDK.getAuthorizationURI());
});

router.get('/callback', (req, res) => {
  hydraSDK.getAuthTokenViaCode(req.query.code, (error, token) => {
    if (error) { res.json({ error }); }

    hydraSDK.createUserPolicy(req.session.user.username, (error, result) => {
      if (error) { res.json({ error, result }); }

      req.session.user.access_token = token.token.access_token;
      req.session.user.refresh_token = token.token.refresh_token;

      if (req.session.user.admin) {
        res.redirect('/admin')
      } else {
        res.redirect('/dashboard');
      }
    });
  });
});

module.exports = router;
