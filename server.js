require("dotenv").config();
const PORT = process.env.PORT || 3000;

const express = require("express");
const jwt = require("jsonwebtoken");

const participantRoutes = require("./src/routes/participantRoutes");
const drawRoutes = require("./src/routes/drawRoutes");

const app = express();
app.use(express.json());

app.use("/participants", participantRoutes);
app.use("/draw", drawRoutes);

app.listen(3000, () => {
  console.log("Acesse http://localhost:3000");
  console.info("Rotas disponíveis:");
  console.log(
    "GET /participants - Listar todos os participantes e gerar token de teste"
  );
  console.log("POST /participants - Adicionar um novo participante");
  console.log(
    "DELETE /participants/:id - Remover um participante (requer autenticação) "
  );
  console.log("POST /draw - Realizar sorteio (requer autenticação)");
  console.log(
    "GET /draw/results - Ver todos os resultados do sorteio (requer autenticação)"
  );
  console.log("GET /draw/participant/:participantId - Ver seu amigo secreto");
});
