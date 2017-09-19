const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PG_URL);

module.exports = {
  env: "development",
  db: sequelize,
  hydra: {
    "client": {
      "id": process.env.HYDRA_DASHBOARD_CLIENT_ID,
      "secret": process.env.HYDRA_DASHBOARD_CLIENT_SECRET
    },
    "auth": {
      "tokenHost": process.env.HYDRA_URL,
      "authorizePath": "/oauth2/auth",
      "tokenPath": "/oauth2/token"
    }
  }
};
