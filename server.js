const express = require("express");
const jwt = require("jsonwebtoken");

const userRoutes = require("./src/routes/participanteRoutes");

const app = express();
app.use(express.json());

app.use("/participantes", participanteRoutes);

app.listen(3000, () => {
  console.log("Acesse http://localhost:3000");
});
