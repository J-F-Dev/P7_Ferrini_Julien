const db = require("../models");

exports.createLike = (req, res, next) => {
  let id = req.params.id;
  let idPUBLICATIONS = req.body.publicationId;
  console.log("iiidddd puuuubb", idPUBLICATIONS);
  db.sequelize.models.Like.findOne({
    where: {
      idUSERS: id,
      idPUBLICATIONS: idPUBLICATIONS,
    },
  })
    .then((Like) => {
      if (Like) {
        console.log("fonction");

        db.sequelize.models.Like.destroy({
          where: {
            idUSERS: id,
            idPUBLICATIONS: idPUBLICATIONS,
          },
        })
          .then((dislike) =>
            res.status(201).json({ message: "like supprimé", dislike })
          )
          .catch(() =>
            res.status(500).json({ error: "impossible de supprimé le like" })
          );
      } else {
        db.sequelize.models.Like.create({
          idUSERS: id,
          idPUBLICATIONS: idPUBLICATIONS,
          isLike: true,
        })
          .then((Like) => res.status(201).json({ message: "like créé", Like }))
          .catch(() => res.status(500).json({ error: "impossible de liké" }));
      }
    })
    .catch(() => res.status(500).json({ error: "impossible de liker" }));
};
