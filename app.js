const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
// const path = require('path');
const cors = require('cors');
const passport = require('passport');

dotenv.config();
const passportConfig = require('./passport');

const app = express();
passportConfig();
const router = express.Router();

//몽구스연결
const connect = require('./models/index.js');
connect();

//넌적스 연결
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
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: '*', credentials: true }));

//router
app.get('/', (req, res) => {
  res.render('index');
});

//라우터 연결

const auth = require('./routers/auth');
app.use('/auth', auth);

// const userRouters = require('./routers/user');
// app.use('/users', [userRouters]);

const exerciseRouter = require('./routers/exercise');
app.use('/exercises', [exerciseRouter]);

const routineRouters = require('./routers/routine');
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
