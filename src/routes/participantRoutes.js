const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  adicionarParticipant,
  listarParticipants,
  removerParticipant,
} = require("../controllers/participantController");

const router = express.Router();

router.get("/", listarParticipants);
router.post("/", adicionarParticipant);
router.delete("/:id", authMiddleware, removerParticipant); // Usar o middleware aqui para gerar o token e proteger a rota

module.exports = router;