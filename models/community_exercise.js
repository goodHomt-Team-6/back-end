const Sequelize = require('sequelize');

module.exports = class Community_Exercise extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        communityId: {
          type: Sequelize.INTEGER,
        },
        exerciseName: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Community_Exercise',
        tableName: 'Community_Exercise',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Community_Exercise.hasMany(db.Community_Set, {
      foreignKey: 'communityExerciseId',
      sourceKey: 'id',
    });
    db.Community_Exercise.belongsTo(db.Community, {
      foreignKey: 'communityId',
      targetKey: 'id',
    });
  }
};
