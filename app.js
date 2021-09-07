require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { errorHandler } = require('./middlewares/errorHandler');
const { cors } = require('./middlewares/cors');
const { NotFoundError } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(routes);

app.use(() => {
  throw new NotFoundError('404 Error');
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`I'm running on ${PORT}`);
});
