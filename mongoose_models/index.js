const mongoose = require('mongoose');

//localhost연결
// const connect = () => {
//   mongoose
//     .connect('mongodb://localhost:27017/Goodhomt', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       user: 'test',
//       pass: 'test',
//     })
//     .catch((err) => console.log(err));
// };

//atlas연결
const URI = process.env.ATLAS_URI;

const connect = async () => {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('ATLAS 데이터베이스 연결 성공');
};

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = connect;
