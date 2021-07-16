"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_level extends Model {
    static associate(models) {
      models.user_level.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      models.user_level.belongsTo(models.level, {
        foreignKey: "levelId",
        onDelete: "CASCADE",
      });
    }
  }

  user_level.init(
    {
      userId: DataTypes.INTEGER,
      levelId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_level",
    }
  );
  return user_level;
};
