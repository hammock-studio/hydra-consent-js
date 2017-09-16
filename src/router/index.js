const hydraSDK = require('../helpers/hydra-sdk');
const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/signup', require('./signup'));
router.use('/consent', require('./consent'));
router.use('/dashboard', require('./dashboard'));

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

router.get('/', sessionChecker, (req, res) => {
  res.redirect(hydraSDK.getAuthorizationURI());
});

// add the token to local storage solution.
router.get('/callback', (req, res) => {
  hydraSDK.getAuthTokenViaCode(req.query.code, (error, token) => {
    if(error) { res.json ({ error }) };

    hydraSDK.createUserPolicy(req.session.user.username, (error, result) => {
      if(error) { res.json ({ error }) };

      hydraSDK.getPolicy(token.token.access_token, (error, result) => {
        if(error) { res.json ({ error }) };

        res.json({error, result: JSON.parse(result.body), location: "getPolicy" });
      });
    });
  });
});

module.exports = router;
