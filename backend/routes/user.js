const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//on crée des routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getOneUserInfos);
router.put("/:id", auth, userCtrl.updateUser);
router.put("/:id/pdp", auth, multer, userCtrl.updatePhoto);
router.delete("/:id/photo", auth, multer, userCtrl.deletePhoto);
router.delete("/:id/deleteUser", auth, userCtrl.deleteUser);
//On exporte le routeur
module.exports = router;
