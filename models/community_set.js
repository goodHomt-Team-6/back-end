const Sequelize = require('sequelize');

module.exports = class Community_Set extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        communityExerciseId: {
          type: Sequelize.INTEGER,
        },
        setCount: {
          type: Sequelize.INTEGER,
        },
        weight: {
          type: Sequelize.INTEGER,
        },
        count: {
          type: Sequelize.INTEGER,
        },
        minutes: {
          type: Sequelize.INTEGER,
        },
        seconds: {
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Community_Set',
        tableName: 'Community_Set',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Community_Set.belongsTo(db.Community_Exercise, {
      foreignKey: 'communityExerciseId',
      targetKey: 'id',
    });
  }
};
