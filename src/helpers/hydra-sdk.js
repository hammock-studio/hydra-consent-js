const request = require('request');
const rs = require('randomstring');
const config = require('../../config');
const oauth2 = require('simple-oauth2').create(config.hydra);
const childProcess = require('child_process');

const getAuthorizationURI = () => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.HYDRA_CALLBACK_URI,
    scope: 'openid offline hydra.clients hydra.policies',
    state: rs.generate({ length: 24, charset: 'alphabetic' }),
    nonce: rs.generate({ length: 24, charset: 'alphabetic' })
  });

  return authorizationUri;
};

const getAuthTokenViaCode = (code, callback) => {
  const tokenConfig = {
    code,
    redirect_uri: process.env.HYDRA_CALLBACK_URI
  };

  oauth2.authorizationCode.getToken(tokenConfig)
    .then(result => callback(null, oauth2.accessToken.create(result)))
    .catch(error => callback(error.message));
};

const getClient = (accessToken, callback) => {
  request(
    {
      method: 'GET',
      url: `${process.env.HYDRA_URL}/clients/some-consumer-local`,
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    (error, response, body) => callback(error, { response, body })
  );
};

const getPolicy = (accessToken, callback) => {
  request(
    {
      method: 'GET',
      url: `${process.env.HYDRA_URL}/policies/consent-app-policy-local`,
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    (error, response, body) => callback(error, { response, body })
  );
};

const createUserPolicy = (user, callback) => {
  // NASTY UGLY DEVELOPMENT HACK, FIX ASAP TO APROPRIATE TOKEN

  childProcess.exec('hydra token client --skip-tls-verify', (error, stdout) => {
    request(
      {
        method: 'POST',
        url: `${process.env.HYDRA_URL}/policies`,
        headers: {
          Authorization: `bearer ${stdout.trim()}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          id: 'consent-app-policy-local',
          subjects: [`user:${user}`],
          actions: ['get'],
          effect: 'allow',
          resources: [
            'rn:hydra:policies:<.*>',
            'rn:hydra:clients:<.*>'
          ]
        })
      },
      (error, response, body) => callback(error, { response, body })
    );
  });
};

const validateToken = (token, callback) => {
  const Hydra = require('hydra-js');
  const hydra = new Hydra();

  hydra.validateToken(token).then((body) => {
    callback(null, { body });
  }).catch((error) => {
    callback({ error });
  });
};

const isTokenActive = (token, callback) => {
  validateToken(token, (error, body) => {
    if (error) return callback(error);

    return callback(body.active);
  });
};

module.exports = {
  getAuthorizationURI,
  getAuthTokenViaCode,
  getClient,
  getPolicy,
  createUserPolicy,
  validateToken,
  isTokenActive
};
