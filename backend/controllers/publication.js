const fs = require("fs");
const db = require("../models");

// Créer un post et enregistrement dans la table de Posts
exports.createPublication = async (req, res, next) => {
  // Parser la requête
  const publicationObject = JSON.parse(req.body.publication);

  if (publicationObject == null) {
    return res.status(400).send({
      message: "Votre message createPost ne peut pas être vide",
    });
  }
  const newPost = {
    ...publicationObject,
    attachment:
      req.body.publication && req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : null,
  };

  //Enregistrement du post
  await db.sequelize.models.Publication.create(newPost)
    .then(() => res.status(201).json({ message: "Post enregistré !" }))
    .catch(function (err) {
      res.status(500).json({ message: "Error server" });
      console.log(err);
    });
};

exports.getAllPublications = (req, res, next) => {
  db.sequelize.models.Publication.findAll({
    order: [
      ["createdAt", "DESC"],
      [db.sequelize.models.Comment, "createdAt", "DESC"],
    ],
    include: [
      {
        model: db.sequelize.models.User,
      },
      {
        model: db.sequelize.models.Comment,
        include: [db.sequelize.models.User],
      },
      {
        model: db.sequelize.models.Like,
      },
    ],
  })
    .then((newPublication) => res.status(200).json(newPublication))
    .catch(() =>
      res.status(500).json({ error: "erreur à l'obtention des posts" })
    );
};

exports.deletePublication = (req, res, next) => {
  let id = req.params.id;
  let idPUBLICATIONS = req.params.publicationId;
  db.sequelize.models.User.findOne({ where: { id: id } })
    .then((User) => {
      let administrator = User.isAdmin ? true : false;

      if (id == User.id || administrator === true) {
        db.sequelize.models.Publication.findOne({
          where: { id: idPUBLICATIONS },
        })
          .then((Post) => {
            if (Post === null) {
              res.status(500).json({ error: "pas de publication trouvée" });
            } else {
              if (Post.attachment != null) {
                const filename = Post.attachment.split("/images/")[1]; // suppression de l'ancienne image
                fs.unlink(`images/${filename}`, (err) => {
                  console.log(err);
                });
              }
              Post.destroy({
                where: { id: idPUBLICATIONS },
              })
                .then(() => {
                  res.status(200).json({ message: "publication supprimée" });
                })
                .catch(() =>
                  res.status(500).json({
                    error: "erreur à la suppression de la publication",
                  })
                );
            }
          })
          .catch(() =>
            res
              .status(500)
              .json({ error: "erreur à la suppression de la publication" })
          );
      } else {
        res.status(500).json({
          error:
            "vous devez être administrateur pour effectuer cette opération",
        });
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};
