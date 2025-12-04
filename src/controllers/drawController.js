const { getAllParticipants } = require("../models/participantModel");
const {
  realizarSorteio,
  getSorteioCompleto,
  getAmigoSecreto,
} = require("../models/sorteioModel");

function fazerSorteio(req, res) {
  try {
    const participantes = getAllParticipants();
    const resultado = realizarSorteio(participantes);

    res.json({
      mensagem: "Sorteio realizado com sucesso!",
      totalParticipantes: participantes.length,
    });
  } catch (erro) {
    res.status(400).json({
      erro: erro.message,
    });
  }
}

function verResultadosCompletos(req, res) {
  try {
    const resultados = getSorteioCompleto();

    res.json({
      sorteio: resultados,
    });
  } catch (erro) {
    res.status(400).json({
      erro: erro.message,
    });
  }
}

function verMeuAmigoSecreto(req, res) {
  try {
    const participanteId = parseInt(req.params.participantId);

    if (isNaN(participanteId)) {
      return res.status(400).json({
        erro: "ID inválido",
      });
    }

    const resultado = getAmigoSecreto(participanteId);

    res.json(resultado);
  } catch (erro) {
    res.status(404).json({
      erro: erro.message,
    });
  }
}

module.exports = {
  fazerSorteio,
  verResultadosCompletos,
  verMeuAmigoSecreto,
};
