"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          name: "idUSERS",
          allowNull: false,
        },
      });

      models.Comment.belongsTo(models.Publication, {
        foreignKey: {
          name: "idPUBLICATIONS",
          allowNull: false,
        },
      });
    }
  }
  Comment.init(
    {
      idUSERS: DataTypes.INTEGER,
      idPUBLICATIONS: DataTypes.INTEGER,
      message: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
