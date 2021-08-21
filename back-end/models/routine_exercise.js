const Sequelize = require('sequelize');

module.exports = class Routine_Exercise extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        exerciseName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Routine_Exercise',
        tableName: 'routine_exercise',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Routine_Exercise.hasMany(db.Set, {
      foreignKey: 'routineExerciseId',
      sourceKey: 'id',
      as: 'set',
    });
    db.Routine_Exercise.belongsTo(db.Routine, {
      foreignKey: 'routineId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  }
};
