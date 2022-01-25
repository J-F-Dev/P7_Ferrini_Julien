const db = require("../models");

exports.createComment = (req, res, next) => {
  const message = req.body.message;
  const id = req.params.id;
  const publicationId = req.body.publicationId;
  console.log("MESSSAGGGGE", message);
  if (message == null) {
    return res.status(400).send({
      message: "Votre commentaire ne peut pas être vide",
    });
  }

  db.sequelize.models.Comment.create({
    idUSERS: id,
    idPUBLICATIONS: publicationId,
    message: message,
  })
    .then((newComment) =>
      res.status(201).json({
        message: "commentaire créé !",
        "créé le": newComment.createdAt,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.id;
  const idComment = req.params.idComment;

  db.sequelize.models.User.findOne({ where: { id: id } })
    .then((User) => {
      let administrator = User.isAdmin ? true : false;
      if (id == id || administrator === true) {
        db.sequelize.models.Comment.findOne({ where: { id: idComment } })
          .then((comment) => {
            if (comment === null) {
              res.status(500).json({ error: "pas de commentaire trouvé" });
            } else {
              db.sequelize.models.Comment.destroy({ where: { id: idComment } })
                .then(() => {
                  res.status(200).json({ message: "commentaire supprimé" });
                })
                .catch(() =>
                  res
                    .status(500)
                    .json({ error: "erreur à la suppression du commentaire" })
                );
            }
          })
          .catch(() =>
            res
              .status(500)
              .json({ error: "erreur à la suppression du commentaire" })
          );
      } else {
        res.status(500).json({
          error:
            "vous devez être administrateur pour effectuer cette opération",
        });
      }
    })
    .catch(() =>
      res.status(500).json({
        error: "vous n'avez pas les droits pour effectuer cette opération",
      })
    );
};
