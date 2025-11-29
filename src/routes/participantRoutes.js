const express = require("express");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middlewares/authMiddleware");

const { adicionarParticipante, listarParticipantes,  } = require("../controllers/participantController");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

router.get("/", (req, res) => {
  console.log("Executando rota GET /participantes com token JWT");

  const { getAllParticipantes } = require("../models/participantModel");
  const usuarios = listarParticipantes();

  const token = jwt.sign(
    { id: 1, email: "admin@test.com", nome: "Administrador" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Token gerado:", token.substring(0, 50) + "...");

  res.json({
    usuarios: usuarios,
    tokenDeTeste: token,
    instrucoes:
      "Use este token no header Authorization: Bearer TOKEN para deletar",
  });
});

router.post("/", adicionarParticipante);

router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  console.log("Usuário autenticado:", req.user);
  console.log("Removendo usuario ID:", id);

  res.json({
    mensagem: `Participante ${id} removido com sucesso`,
    deletadoPor: req.user.email || req.user.nome,
  });
});

module.exports = router;
