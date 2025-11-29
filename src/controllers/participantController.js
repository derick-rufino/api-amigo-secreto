const {
  getAllParticipantes,
  addParticipante,
  removeParticipante,
} = require("../models/userModel");

function listarParticipantes(req, res) {
  const participantes = getAllParticipantes();
  res.json(participantes);
}

function adicionarParticipante(req, res) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }
  const novo = addParticipante(nome);
  res.status(201).json(novo);
}

function removerParticipante(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    // checar se é número
    return res.status(400).json({
      erro: "ID deve ser um número",
    });
  }

  const userRemovido = removeParticipante(id);

  if (!userRemovido) {
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }

  res.json({
    mensagem: "Usuário removido",
    usuario: userRemovido,
  });
}

module.exports = {
  listarParticipantes,
  adicionarParticipante,
  removerParticipante,
};
