# Instruções da atividade

## Objetivo

> Entregar uma API para amigo secreto

## Regras

- 5 rotas (no mínimo)
- Não pode sortear a si mesmo
- Deve haver no mínimo 3 participantes para qeu seja possível o sorteio

## Metodos para avaliação:

- Estrutura - Organizaçã de pastas e convenções de nomenclatura
- Segurança
- Tratamento de erros

## Minhas rotas

- `POST /participants` – adiciona um participante.
- `GET /participants` – lista todos os participantes.
- `DELETE /participants/:id` – remove um participante.
- `POST /draw` – realiza o sorteio e salva os pares.
- `GET /draw/results` – retorna quem tirou quem (visão admin).
- `GET /draw/:participantId` – retorna apenas o amigo secreto de um participante (visão individual).
