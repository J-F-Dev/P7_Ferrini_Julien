const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
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
          console.log(user.id + "/" + user.isAdmin);
          res.status(200).json({
            userId: user.id,

            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    });
};

exports.getOneUserInfos = (req, res, next) => {
  //renvoie les information d'un utilisateur
  const id = req.params.id;
  console.log("IIDDDDD", id);
  db.sequelize.models.User.findOne({ where: { id: id } })

    .then((User) => {
      if (User === null) {
        res.status(500).json({ error: "pas d'utilisateur trouvé" });
      } else {
        res.status(200).json(User);
      }
    })
    .catch(() => res.status(500).json({ error: "pas d'utilisateur trouvé" }));
};

exports.updateUser = (req, res, next) => {
  // Retrouver le user
  const id = req.params.id;

  db.sequelize.models.User.findOne({
    where: {
      id: id,
    },
  })
    .then((User) => {
      if (User === null) {
        res.status(500).json({ error: "pas d'utilisateur trouvé" });
      } else {
        User.username = req.body.username;
        User.bio = req.body.bio;
        User.save();
        res.status(200).json({ message: "utlisateur modifié" });
      }
    })
    .catch(() => res.status(500).json({ error: "pas d'utilisateur trouvé" }));
};

exports.updatePhoto = (req, res, next) => {
  // modifie la photo d'un utilisateur
  const id = req.params.id;

  db.sequelize.models.User.findOne({ where: { id: id } })

    .then((User) => {
      if (User === null) {
        res.status(500).json({ error: "pas d'utilisateur trouvé" });
      } else {
        if (User.profilImg != null) {
          const filename = User.profilImg.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log("impossible de supprimer l'image:" + err);
            } else {
              console.log("image supprimée");
            }
          });
        }
        User.profilImg = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
        User.save()
          .then(() => {
            res.status(200).json({
              message: "données de l'utilisateur modifié par l'utilisateur",
            });
          })
          .catch(() => {
            res.status(500).json({ error: "impossible de modifier la photo" });
          });
      }
    })
    .catch(() => res.status(500).json({ error: "pas d'utilisateur trouvé" }));
};

exports.deletePhoto = (req, res, next) => {
  // modifie la photo d'un utilisateur
  const id = req.params.id;

  db.sequelize.models.User.findOne({ where: { id: id } })

    .then((User) => {
      if (User === null) {
        res.status(500).json({ error: "pas d'utilisateur trouvé" });
      } else {
        if (User.profilImg != null) {
          const filename = User.profilImg.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log("impossible de supprimer l'image:" + err);
            } else {
              console.log("image supprimée");
            }
          });
        }
        User.profilImg = null;
        User.save()
          .then(() => {
            res.status(200).json({
              message: "données de l'utilisateur modifié par l'utilisateur",
            });
          })
          .catch(() => {
            res.status(500).json({ error: "impossible de modifier la photo" });
          });
      }
    })
    .catch(() => res.status(500).json({ error: "pas d'utilisateur trouvé" }));
};

exports.deleteUser = (req, res, next) => {
  let id = req.params.id;
  // La suppression des posts, likes et commentaires se ferra en cascade
  // La suppression du media associé serra supprimé par un hook
  db.sequelize.models.User.findOne({
    where: {
      id: id,
    },
  })
    .then((User) => {
      User.destroy()
        .then(() =>
          res.status(200).json({ message: "le compte est supprimé !" })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
