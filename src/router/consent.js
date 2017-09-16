const express = require('express');
const Hydra = require('hydra-js')
const router = express.Router();
const hydra = new Hydra();

const catcher = (res) => (error) => {
  res.status(500);
  res.json( {error: error });
  return Promise.reject(error);
};

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect(`/login?consent_flow=true&challenge=${req.query.challenge}`); //with flag of consent flow
  }
};

const resolveConsent = (req, res, challenge, scopes = []) => {
  const subject = `user:${req.session.user.username}`;
  const data = {};

  if (!Array.isArray(scopes)) {
    scopes = [scopes]
  }

  hydra.verifyConsentChallenge(challenge).then(({ challenge: decoded }) => {
    return hydra.generateConsentResponse(challenge, subject, scopes, {}, data)
    .then(({ consent }) => {
      res.redirect(`${decoded.redir}&consent=${consent}`);
    })
  }).catch(catcher(res))
};

router.route('/')
.get(sessionChecker, (req, res) => {
  hydra.verifyConsentChallenge(req.query.challenge).then(({ challenge }) => {
    res.render('consent', { scopes: challenge.scp, challenge: req.query.challenge})
    return Promise.resolve()
  })
  .catch(catcher(res))
})
.post(sessionChecker, (req, res) => {
    resolveConsent(req, res, req.body.challenge, req.body.allowed_scopes)
});

module.exports = router;
