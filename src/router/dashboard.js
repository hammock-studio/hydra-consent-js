const hydraSDK = require('../helpers/hydra-sdk');
const express = require('express');

const router = express.Router();

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.access_token) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/', sessionChecker, (req, res) => {
  hydraSDK.getPolicy(req.session.user.access_token, (error, result) => {
    if (error) { res.json({ error }); }

    res.render(
      'dashboard',
      {
        result: JSON.parse(result.body),
        user: req.session.user
      }
    );
  });
});

module.exports = router;
