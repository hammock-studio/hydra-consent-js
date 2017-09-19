const request = require('request');
const rs = require('randomstring');
const config = require('../../config');
const oauth2 = require('simple-oauth2').create(config.hydra);

const getAuthorizationURI = () => {
  authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.HYDRA_CALLBACK_URI,
    scope: 'openid offline hydra.clients hydra.policies',
    state: rs.generate({ length: 24, charset: 'alphabetic' }),
    nonce: rs.generate({ length: 24, charset: 'alphabetic' }),
  });

  return authorizationUri;
}

const getAuthTokenViaCode = (code, callback) => {
  const tokenConfig = {
    code: code,
    redirect_uri: process.env.HYDRA_CALLBACK_URI
  };

  oauth2.authorizationCode.getToken(tokenConfig)
  .then((result) => {
    return callback(null, oauth2.accessToken.create(result));
  })
  .catch((error) => {
    return callback(error.message);
  });
};

const getClient = (access_token, callback) => {
  request({
    method: 'GET',
    url:`${process.env.HYDRA_URL}/clients/some-consumer-local`,
    headers: {
      'Authorization': `bearer ${access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  function (error, response, body) {
    return callback(error, { response, body });
  });
};

const getPolicy = (access_token, callback) => {
  request({
    method: 'GET',
    url:`${process.env.HYDRA_URL}/policies/consent-app-policy-local`,
    headers: {
      'Authorization': `bearer ${access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  function (error, response, body) {
    return callback(error, { response, body });
  });
};

const createUserPolicy = (user, callback) => {
  // NASTY UGLY DEVELOPMENT HACK, FIX ASAP TO APROPRIATE TOKEN
  const exec = require('child_process').exec;

  exec("hydra token client --skip-tls-verify", function (error, stdout, stderr) {
    request({
      method: 'POST',
      url:`${process.env.HYDRA_URL}/policies`,
      headers: {
        'Authorization': `bearer ${stdout.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "id": "consent-app-policy-local",
        "subjects": [`user:${user}`],
        "actions" : ["get"],
        "effect": "allow",
        "resources": [
          "rn:hydra:policies:<.*>",
          "rn:hydra:clients:<.*>"
        ]
      })
    },
    function (error, response, body) {
      return callback(error, { response, body });
    });
  });
};

module.exports = {
  getAuthorizationURI,
  getAuthTokenViaCode,
  getClient,
  getPolicy,
  createUserPolicy
};
