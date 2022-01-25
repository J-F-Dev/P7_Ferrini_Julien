//On importe express
const express = require("express");
//On appelle la méthode express
const app = express();

const userRoutes = require("./routes/user");

const publicationRoutes = require("./routes/publication");

const commentRoutes = require("./routes/comment");

const likeRoutes = require("./routes/like");

const path = require("path");

//On analyse le corps de la requête.
app.use(express.json());

//On permet à l'application d'accéder à l'API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//On gère la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images .
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/user", userRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
//on exporte l'application
module.exports = app;
