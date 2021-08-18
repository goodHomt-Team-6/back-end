const Sequelize = require('sequelize');

module.exports = class Community extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        routineName: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        communityNickname: {
          type: Sequelize.INTEGER,
        },
        like: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Community',
        tableName: 'Community',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Community.hasMany(db.Like_User, {
      foreignKey: 'communityId',
      sourceKey: 'id',
    });
    db.Community.hasMany(db.Community_Exercise, {
      foreignKey: 'communityId',
      sourceKey: 'id',
    });
  }
};
