const express = require("express");
//On crée un router
const router = express.Router();

const auth = require("../middleware/auth");

const likeCtrl = require("../controllers/like");

//On crée les routes

router.post("/:id/createLike", auth, likeCtrl.createLike);

//On exporte le router
module.exports = router;
