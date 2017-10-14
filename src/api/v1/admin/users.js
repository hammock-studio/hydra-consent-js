const express = require('express');
const config = require('../../../../config');
const User = require('../../../models/user')(config.db);

const router = express.Router();

const sessionChecker = (req, res, next) => {
  next();
};

router.get("/", sessionChecker, (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 10;

  User.findAll({ offset, limit }).then((users) => {
    res.json(users);
  });
});

// router.get("/:id", sessionChecker, (req, res) => {
//   res.json({});
// });

// router.post("/new", sessionChecker, (req, res) => {
//   res.json({});
// });
//
// router.delete("/delete/:id", sessionChecker, (req, res) => {
//   res.json({});
// });
//
// router.put("/update/:id", sessionChecker, (req, res) => {
//   res.json({});
// });


// router.post((req, res) => {
  // const userData = {
    // username: req.body.username,
    // password: req.body.password,
    // email: req.body.email
  // };

  // User.create(userData).then(user => {
    // req.session.user = user.dataValues;

    // if (req.body.consent_flow) {
      // res.redirect(`/consent?challenge=${req.body.challenge}`);
    // } else {
      // res.redirect('/');
    // }
  // }).catch(() => {
    // res.redirect('/');
  // });
// });

module.exports = router;
