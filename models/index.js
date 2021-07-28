const Sequelize = require('sequelize');
const User = require('./user');
const Category = require('./category');
const Default_Exercise = require('./default_exercise');
const Routine = require('./routine');
const Routine_Exercise = require('./routine_exercise');
const Set = require('./set');
const User_Custom = require('./user_custom');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Category = Category;
db.Default_Exercise = Default_Exercise;
db.Routine = Routine;
db.Routine_Exercise = Routine_Exercise;
db.Set = Set;
db.User_Custom = User_Custom;

User.init(sequelize);
Category.init(sequelize);
Default_Exercise.init(sequelize);
Routine.init(sequelize);
Routine_Exercise.init(sequelize);
Set.init(sequelize);
User_Custom.init(sequelize);

User.associate(db);
Category.associate(db);
Default_Exercise.associate(db);
Routine.associate(db);
Routine_Exercise.associate(db);
Set.associate(db);
User_Custom.associate(db);

module.exports = db;
