const express = require('express');

const router = express.Router();

// router.use('/users', require('./users'));

const sessionChecker = (req, res, next) => {
  if (
    req.session.user &&
    req.cookies.user_sid &&
    req.session.user.access_token
  ) {
    if (req.session.user.admin) {
      next();
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.redirect('/');
  }
};

router.get('/', sessionChecker, (req, res) => {
  res.render(
    'admin/dashboard',
    {
      user: req.session.user,
      layout: 'admin/layouts/index'
    }
  );
});

module.exports = router;
