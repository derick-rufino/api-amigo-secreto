participantes = [
  { id: 1, nome: "Ana", amigoSecreto: "" },
  { id: 2, nome: "Clara", amigoSecreto: "" },
  { id: 3, nome: "Derick", amigoSecreto: "" },
];

function getAllParticipantes() {
  return participantes;
}

function addParticipante() {
  const newParticipante = { id: participantes.length + 1, nome };
  participantes.push(newParticipante);
  return newParticipante;
}

function removeParticipante(id) {
  const indice = participantes.findIndex(
    (participante) => participante.id === id
  );
  if (indice === -1) {
    return null;
  }

  return participantes.splice(indice, 1)[0];
}

module.exports = { getAllParticipantes, addParticipante, removeParticipante };
