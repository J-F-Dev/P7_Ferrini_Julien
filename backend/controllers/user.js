const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../models");

exports.signup = (req, res, next) => {
  //On hache le mot de passe
  bcrypt
    .hash(req.body.password, 10)
    //On récupère le hache du mot de passe
    .then((hash) => {
      //on enregistre dans un nouvel utilisateur
      const user = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
        isAdmin: false,
      };
      db.sequelize.models.User.create(user)
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

exports.login = (req, res, next) => {
  console.log(req.body);
  //On vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
  db.sequelize.models.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      //On utilise la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //On une réponse 200 contenant l'ID utilisateur et un token.
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    });
};
