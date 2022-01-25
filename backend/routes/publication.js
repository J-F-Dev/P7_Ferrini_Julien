const express = require("express");
//On crée un router
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const publicationCtrl = require("../controllers/publication");

//On crée les routes

router.post("/create", auth, multer, publicationCtrl.createPublication);
router.get("/getAll", auth, publicationCtrl.getAllPublications);
router.delete(
  "/:id/:publicationId/delete",
  auth,
  multer,
  publicationCtrl.deletePublication
);

//On exporte le router
module.exports = router;
