const express = require("express");
//On crée un router
const router = express.Router();

const auth = require("../middleware/auth");

const commentCtrl = require("../controllers/comment");

router.post("/:id/createComment", auth, commentCtrl.createComment);
router.delete("/:id/:idComment/deleteComment", auth, commentCtrl.deleteComment);

//On exporte le router
module.exports = router;
