const Sequelize = require('sequelize');

module.exports = class Like_User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
        },
        communityId: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Like_User',
        tableName: 'Like_User',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Like_User.belongsTo(db.Like_User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    db.Like_User.belongsTo(db.Community_Exercise, {
      foreignKey: 'communityId',
      targetKey: 'id',
    });
  }
};
