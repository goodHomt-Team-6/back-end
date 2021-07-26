const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path');
const cors = require('cors');

const userRouters = require('./routers/user');
const exerciseRouter = require('./routers/exercise');
const routineRouters = require('./routers/routine');

dotenv.config();
const app = express();
const router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Goodhomt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // user: 'test',
  // pass: 'test',
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

// middleware
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }), router);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({ origin: '*', credentials: true }));

//router
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', [userRouters]);
app.use('/exercises', [exerciseRouter]);
app.use('/routines', [routineRouters]);

//error router
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!!`);
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.locals.message = error.message;
  res.locals.error = error;
  res.status(error.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트 대기중....');
});
