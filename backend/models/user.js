"use strict";
const fs = require("fs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Publication, {
        foreignKey: "idUSERS",
        onDelete: "CASCADE",
        hooks: true,
      });

      models.User.hasMany(models.Comment, {
        foreignKey: "idUSERS",
        onDelete: "cascade",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      bio: DataTypes.STRING,
      profilImg: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        afterDestroy: (User) => {
          deleteUser(User);
        },
        afterBulkDestroy: (User) => {
          deleteUser(User);
        },
      },
    }
  );
  return User;
};
function deleteUser(User) {
  if (User.profilImg) {
    const filename = User.profilImg.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {});
  }
}
