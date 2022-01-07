"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Publication.belongsTo(models.User, {
        foreignKey: {
          name: "idUSERS",
          allowNull: false,
        },
      });

      models.Publication.hasMany(models.Comment, {
        foreignKey: "idPUBLICATIONS",
        onDelete: "CASCADE",
      });

      models.Publication.hasMany(models.Like, {
        foreignKey: "idPUBLICATIONS",
        onDelete: "CASCADE",
      });
    }
  }
  Publication.init(
    {
      idUSERS: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      attachment: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Publication",
    }
  );
  return Publication;
};
