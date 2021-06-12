const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const routes = require('./routes.js');
const errorHandler = require('./_helpers/error-handler.js');
const jwt = require('./_helpers/jwt.js');

app.set('port', PORT);
app.set('env', NODE_ENV);
app.use(express.json());
app.use(express.urlencoded());
app.use(jwt());
app.use('/', routes);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});
