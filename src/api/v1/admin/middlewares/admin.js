const Hydra = require('hydra-js');
const hydra = new Hydra();

const validateAccessToken = (res, req, next) => {
  if (!req.headers.Authorization) {
    res.status(400);
    res.json({ error: "Wrong Authorization header format" });
  }

  const authHeader = req.headers.Authorization.trim().split();

  if (authHeader.length === 2 && authHeader[0] === "Bearer") {
    const accessToken = authHeader[1];

    hydra.validateToken(accessToken).then((body) => {
      res.json({ body });
    }).catch((error) => {
      res.json({ error });
    });
  } else {
    res.status(400)
    res.json({ error: "Wrong Authorization header format" });
  }
}

const validateUserSession = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/logout")
  }

  hydra.validateToken(req.session.user.access_token).then((body) => {
    if (body.active) {
      next()
    } else {
      res.redirect("/logout")
    }
  }).catch((error) => {
    res.status(400)
    res.json({ error });
  });
}

const adminMiddleware = (req, res, next) => {
  if (req.hostname === process.env.DASHBOARD_HOSTNAME) {
    validateUserSession(req, res, next);
  } else {
    validateAccessToken(req, res, next);
  }
};

module.exports = adminMiddleware;
