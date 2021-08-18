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
          type: Sequelize.STRING,
        },
        like: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Community',
        tableName: 'community',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Community.hasMany(db.Community_Exercise, {
      foreignKey: 'communityId',
      sourceKey: 'id',
    });
    db.Community.belongsToMany(db.User, { through: 'like_user' });
  }
};
