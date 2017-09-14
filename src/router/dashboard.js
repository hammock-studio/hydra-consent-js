const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(path.dirname(__dirname) + '/templates/dashboard.html');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
