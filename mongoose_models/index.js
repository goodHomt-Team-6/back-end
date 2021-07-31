const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect('mongodb://localhost:27017/Goodhomt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // user: 'test',
      // pass: 'test',
    })
    .catch((err) => console.log(err));
};

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = connect;
