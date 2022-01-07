"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User, {
        foreignKey: {
          name: "idUSERS",
          allowNull: false,
        },
      });

      models.Like.belongsTo(models.Publication, {
        foreignKey: {
          name: "idPUBLICATIONS",
          allowNull: false,
        },
      });
    }
  }
  Like.init(
    {
      idUSERS: DataTypes.INTEGER,
      idPUBLICATIONS: DataTypes.INTEGER,
      isLike: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
