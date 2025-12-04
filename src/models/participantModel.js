participants = [
  { id: 1, nome: "Ana", amigoSecreto: "" },
  { id: 2, nome: "Clara", amigoSecreto: "" },
  { id: 3, nome: "Derick", amigoSecreto: "" },
];

function getAllParticipants() {
  return participants;
}

function getParticipantById(id) {
  return participants.find((p) => p.id === id);
}

function addParticipant(nome) {
  const newParticipant = { id: participants.length + 1, nome, amigoSecreto: null };
  participants.push(newParticipant);
  return newParticipant;
}

function removeParticipant(id) {
  const indice = participants.findIndex((participant) => participant.id === id);
  if (indice === -1) {
    return null;
  }

  return participants.splice(indice, 1)[0];
}

module.exports = { getAllParticipants, getParticipantById, addParticipant, removeParticipant };
