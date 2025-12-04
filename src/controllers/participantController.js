const {
  getAllParticipants,
  addParticipant,
  removeParticipant,
} = require("../models/participantModel");

function listarParticipants(req, res) {
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

  const participants = getAllParticipants();

  // Gerar um token de teste direto quando fizer um GET em /participants
  const tokenDeTeste = jwt.sign(
    { id: 1, email: "admin@test.com", nome: "Admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const mensagemInstrucao = "Use este token em Authorization: Bearer TOKEN, para usar a rota DELETE /participants/:id";
  res.json({
    participants: participants,
    tokenDeTeste: tokenDeTeste,
    instrucoes: mensagemInstrucao,
  });

}

function adicionarParticipant(req, res) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }
  const novo = addParticipant(nome);
  res.status(201).json(novo);
}

function removerParticipant(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    // checar se é número
    return res.status(400).json({
      erro: "ID deve ser um número",
    });
  }

  const participantRemovido = removeParticipant(id);

  if (!participantRemovido) {
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }

  res.json({
    mensagem: "Usuário removido",
    participante: participantRemovido,
  });
}

module.exports = {
  listarParticipants,
  adicionarParticipant,
  removerParticipant,
};
