let sorteioRealizado = false;
let resultadosSorteio = []; // Array de { participanteId, amigoSecretoId }

// ! Gerado por IA 
// Função auxiliar: embaralhar array (Fisher-Yates) 
function embaralhar(array) {
  const arr = [...array]; // spread operator para copiar e não alterar o original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // troca
  }
  return arr;
}

// Verificar se o sorteio é válido (ninguém tirou a si mesmo)
function sorteioValido(participantes, sorteados) { //recebe os dois arrays
  for (let i = 0; i < participantes.length; i++) { // Percorre os dois arrays
    if (participantes[i].id === sorteados[i].id) { // onde os ids são iguais, se a condição retornar true, alguém tirou a si mesmo
      return false; // retorna que o SORTEIO É FALSO já que alguém tirou a si mesmo...
    }
  }
  return true;
}

function realizarSorteio(participantes) {
  // Validar: mínimo 3 participantes
  if (participantes.length < 3) {
    throw new Error("");
  }

  // Verificar se já foi realizado
  if (sorteioRealizado) {
    console.error("Sorteio já foi realizado");
    throw new Error("Sorteio já foi realizado");
  }

  // Tentar sortear até conseguir um válido (máximo 100 tentativas)
  let tentativas = 0;
  let sorteados;

  do {
    sorteados = embaralhar(participantes);
    tentativas++;

    if (tentativas > 100) {
      throw new Error(
        "Não foi possível realizar um sorteio válido após 100 tentativas"
      );
    }
  } while (!sorteioValido(participantes, sorteados));

  // Salvar os resultados
  resultadosSorteio = participantes.map((participante, index) => ({
    participanteId: participante.id,
    participanteNome: participante.nome,
    amigoSecretoId: sorteados[index].id,
    amigoSecretoNome: sorteados[index].nome,
  }));

  sorteioRealizado = true;
  return resultadosSorteio;
}

function getSorteioCompleto() {
  if (!sorteioRealizado) {
    console.error("Sorteio ainda não foi realizado");
    throw new Error("Sorteio ainda não foi realizado");
  }
  return resultadosSorteio;
}

function getAmigoSecreto(participanteId) {
  if (!sorteioRealizado) {
    throw new Error("Sorteio ainda não foi realizado");
  }

  const resultado = resultadosSorteio.find(
    (r) => r.participanteId === participanteId
  );

  if (!resultado) {
    throw new Error("Participante não encontrado no sorteio");
  }

  return {
    participante: resultado.participanteNome,
    amigoSecreto: resultado.amigoSecretoNome,
  };
}

function resetarSorteio() {
  sorteioRealizado = false;
  resultadosSorteio = [];
}

module.exports = {
  realizarSorteio,
  getSorteioCompleto,
  getAmigoSecreto,
  resetarSorteio,
};
