const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('dashboard');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
