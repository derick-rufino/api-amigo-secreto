# Instruções da atividade

## Objetivo

> Entregar uma API para amigo secreto

## Regras

- 5 rotas (no mínimo)
- Não pode sortear a si mesmo
- Deve haver no mínimo 3 participants para qeu seja possível o sorteio

## Metodos para avaliação:

- Estrutura - Organizaçã de pastas e convenções de nomenclatura
- Segurança
- Tratamento de erros

## Minhas rotas

- `POST /participants` – adiciona um participant.
- `GET /participants` – lista todos os participants.
- `DELETE /participants/:id` – remove um participant.

---

- `POST /sorteio` – realiza o sorteio e salva os pares.
- `GET /sorteio/results` – retorna quem tirou quem (visão admin).
- `GET /sorteio/:participantId` – retorna apenas o amigo secreto de um participant (visão individual).
