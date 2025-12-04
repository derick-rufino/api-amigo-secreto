const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  fazerSorteio,
  verResultadosCompletos,
  verMeuAmigoSecreto,
} = require("../controllers/drawController");

const router = express.Router();

// POST /draw - Realizar sorteio (protegido)
router.post("/", authMiddleware, fazerSorteio);

// GET /draw/results - Ver todos os resultados (protegido - admin)
router.get("/results", authMiddleware, verResultadosCompletos);

// GET /draw/participant/:participantId - Ver seu amigo secreto
router.get("/participant/:participantId", verMeuAmigoSecreto);

module.exports = router;
