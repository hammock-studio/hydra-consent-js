const express = require('express');
const app = express();

// const autoComplete = require('./autoComplete');

app.use(express.static('public'));
app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.json({ message: "Hydra Consent App" });
});

// app.use('/search', autoComplete);

app.listen(app.get('port'), () => {
  console.log('Listening on port: ' + app.get('port'));
});
