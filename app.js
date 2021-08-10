const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

const { sequelize } = require('./models');
const passportConfig = require('./passport');
const { swaggerUi, specs } = require('./swagger/swagger');

const tokenRouter = require('./routes/tokens');
const authRouter = require('./routes/auth');
const exerciseRouter = require('./routes/exercise');
const routineRouter = require('./routes/routine');
const communityRouter = require('./routes/community');
const challengeRouter = require('./routes/challenge');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/like');
const adminRouter = require('./routes/admin');

dotenv.config();

const app = express();
passportConfig();
const router = express.Router();

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((error) => {
    console.error(error);
  });

//몽구스연결
const connect = require('./mongoose_models/index.js');
connect();

//넌적스 연결
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// middleware
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }), router);

app.use(cookieParser(process.env.COOKIE_SECRET));
// const sessionOption = {
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
//   name: 'session-cookie',
// };
// //https 적용할때만
// if (process.env.NODE_ENV === 'production') {
//   sessionOption.proxy = true;
//   sessionOption.cookie.secure = true;
// }
// app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: '*', credentials: true }));

//라우터 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.json({ ok: true });
  // res.render('index');
});

app.use('/tokens', tokenRouter);

app.use('/auth', authRouter);

app.use('/exercises', exerciseRouter);

app.use('/routines', routineRouter);

app.use('/community', communityRouter);

app.use('/challenges', challengeRouter);

app.use('/comment', commentRouter);

app.use('/like', likeRouter);

app.use('/admin', adminRouter);

//error router
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!!`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ ok: false, errorMesaage: error.message });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트 대기중....');
});
