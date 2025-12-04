const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  adicionarParticipant,
  listarParticipants,
  removerParticipant,
} = require("../controllers/participantController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Participantes
 *   description: Gerenciamento de participantes do amigo secreto
 */

/**
 * @swagger
 * /participants:
 *   get:
 *     summary: Lista todos os participantes
 *     description: Retorna a lista completa de participantes cadastrados e um token JWT para testes
 *     tags: [Participantes]
 *     responses:
 *       200:
 *         description: Lista de participantes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participants:
 *                   type: array
 *                   description: Array com todos os participantes
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID único do participante
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         description: Nome do participante
 *                         example: "Ana"
 *                       amigoSecreto:
 *                         type: string
 *                         nullable: true
 *                         description: Nome do amigo secreto (null se sorteio não foi realizado)
 *                         example: null
 *                 tokenDeTeste:
 *                   type: string
 *                   description: Token JWT gerado automaticamente para facilitar testes
 *                 instrucoes:
 *                   type: string
 *                   description: Instruções de como usar o token
 */
router.get("/", listarParticipants);

/**
 * @swagger
 * /participants:
 *   post:
 *     summary: Adiciona um novo participante
 *     description: Cadastra um novo participante no sistema de amigo secreto
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do participante
 *                 example: "João Silva"
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Participante adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 4
 *                 nome:
 *                   type: string
 *                   example: "João Silva"
 *                 amigoSecreto:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Nome é obrigatório
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nome é obrigatório"
 */
router.post("/", adicionarParticipant);

/**
 * @swagger
 * /participants/{id}:
 *   delete:
 *     summary: Remove um participante
 *     description: Remove um participante do sistema. Requer autenticação JWT.
 *     tags: [Participantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do participante a ser removido
 *         example: 1
 *     responses:
 *       200:
 *         description: Participante removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário removido"
 *                 participante:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "Ana"
 *                     amigoSecreto:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "ID deve ser um número"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Token não fornecido"
 *       404:
 *         description: Participante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Usuário não encontrado"
 */
router.delete("/:id", authMiddleware, removerParticipant);

module.exports = router;
