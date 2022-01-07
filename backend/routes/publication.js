const express = require("express");
//On crée un router
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const publicationCtrl = require("../controllers/publication");

//On crée les routes
router.get("/", auth, publicationCtrl.getAllPublications);
router.get("/:id", auth, publicationCtrl.getOnePublication);
router.post("/", auth, multer, publicationCtrl.createPublication);
router.put("/:id", auth, multer, publicationCtrl.updatePublication);
router.delete("/:id", auth, publicationCtrl.deletePublication);

//On exporte le router
module.exports = router;
