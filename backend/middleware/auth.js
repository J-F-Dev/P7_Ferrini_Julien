const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupération token envoyé par le front
    const token = req.headers.authorization.split(" ")[1];
    // Vérification si le token est identique à le secret token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Ajout d'informations sur le user dans la requête pour les controllers
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    console.log("BODYYYYYY", userId);
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error("Not authenticated"),
    });
  }
};
