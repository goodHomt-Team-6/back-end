const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const cors = require('cors');

const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');

const { sequelize } = require('./models');
const { swaggerUi, specs } = require('./swagger/swagger');

const tokenRouter = require('./routes/tokens');
const authRouter = require('./routes/auth');
const exerciseRouter = require('./routes/exercise');
const routineRouter = require('./routes/routine');
const communityRouter = require('./routes/community');
const challengeRouter = require('./routes/challenge');
const likeRouter = require('./routes/like');

dotenv.config();

const app = express();
const router = express.Router();

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('SQL 데이터베이스 연결 성공');
  })
  .catch((error) => {
    console.error(error);
  });

//넌적스 연결
nunjucks.configure('views', {
  express: app,
  watch: true,
});

//schedule 설정
const { schedule } = require('./utils/schedule');
schedule();

// middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  // HTTP 헤더를 적절히 설정하여 웹취약성으로 부터 앱을 보호.
  app.use(helmet({ contentSecurityPolicy: false }));

  //HTTP요청에 동일한 이름을 가진 파라미터가 있을 경우, 의도치 않은 동작을 하도록 외부공격 차단.
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }), router);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({ origin: '*', credentials: true }));

//라우터 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'ccc' });
  // res.render('index');
});

app.use('/tokens', tokenRouter);

app.use('/auth', authRouter);

app.use('/exercises', exerciseRouter);

app.use('/routines', routineRouter);

app.use('/community', communityRouter);

app.use('/challenges', challengeRouter);

app.use('/like', likeRouter);

//error router
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!!`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  logger.error(error.message);
  res.json({ ok: false, errorMesaage: error.message });
});

app.listen(8005, () => {
  console.log(app.get('port'), '번 포트 대기중....');
});
