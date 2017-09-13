const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PG_TEST_URL);

module.exports = {
  env: "test",
  db: sequelize,
}
