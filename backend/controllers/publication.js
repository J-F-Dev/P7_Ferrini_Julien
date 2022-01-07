const db = require("../models");
//On importe le package fs de node
const fs = require("fs");

//On récupère toutes les publications avec find
exports.getAllPublications = (req, res, next) => {
  db.sequelize.models.Publication.find()
    .then((publications) => res.status(200).json(publications))
    .catch((error) => res.status(404).json({ error }));
};

//On récupère une publication grâce à son id avec findOne
exports.getOnePublication = (req, res, next) => {
  db.sequelize.models.Publication.findOne({ _id: req.params.id })
    .then((publication) => res.status(200).json(publication))
    .catch((error) => res.status(404).json({ error }));
};

//On crée la publication
exports.createPublication = (req, res, next) => {
  // Parser la requête
  const publicationObject = JSON.parse(req.body.publication);

  if (publicationObject == null) {
    return res.status(400).send({
      message: "Votre publication ne peut pas être vide",
    });
  }

  const newPublication = {
    ...publicationObject,
    attachment:
      req.body.publication && req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : null,
  };

  //Enregistrement du post
  db.sequelize.models.Publication.create(newPublication)
    .then(() => res.status(201).json({ message: "Post enregistré !" }))
    .catch(function (err) {
      res.status(500).json({ message: "Error server" });
      console.log(err);
    });
};

//On modifie une publication
exports.updatePublication = (req, res, next) => {
  //On verifie que req.file existe
  const publicationObject = req.file
    ? {
        //Si le fichier existe, on récupère les informations sur l'objet
        ...JSON.parse(req.body.publication),
        //On génère l'url de l'image
        attachment: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //On modifie en comparant avec l'id
  db.sequelize.models.Publication.updateOne(
    { _id: req.params.id },
    { ...publicationObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: "Publication modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

//On supprime une publication
exports.deletePublication = (req, res, next) => {
  //On cherche le fichier avec l'id dans les paramètres de la requete
  db.sequelize.models.Publication.findOne({ _id: req.params.id })
    .then((publication) => {
      //On récupère le nom du fichier
      const filename = publication.attachment.split("/images/")[1];
      //On supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        //On supprime la publication en comparant avec l'id
        db.sequelize.models.Publication.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: "Publication supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
