require('dotenv').config();

const config = require('./config/');
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const router = require('./src/router');

//setup models
require('./src/models')(config.db);

config.db.sync()
  .then(() => console.log('tables created successfully'))
  .catch(error => console.log('This error occured', error));

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(express.static('src/templates'));
app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }

  next();
});

app.use('/', router);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), () => {
  console.log('Listening on port: ' + app.get('port'));
});
