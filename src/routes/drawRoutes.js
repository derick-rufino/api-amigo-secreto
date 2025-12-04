const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  fazerSorteio,
  verResultadosCompletos,
  verMeuAmigoSecreto,
} = require("../controllers/drawController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sorteio
 *   description: Operações de sorteio do amigo secreto
 */

/**
 * @swagger
 * /draw:
 *   post:
 *     summary: Realiza o sorteio do amigo secreto
 *     description: Executa o algoritmo de sorteio garantindo que ninguém tire a si mesmo. Requer no mínimo 3 participantes e autenticação JWT.
 *     tags: [Sorteio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sorteio realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Sorteio realizado com sucesso!"
 *                 resultados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       participante:
 *                         type: string
 *                         example: "Ana"
 *                       tirou:
 *                         type: string
 *                         example: "Carlos"
 *       400:
 *         description: Erro ao realizar sorteio (menos de 3 participantes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "É necessário no mínimo 3 participantes para realizar o sorteio"
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/", authMiddleware, fazerSorteio);

/**
 * @swagger
 * /draw/results:
 *   get:
 *     summary: Retorna todos os resultados do sorteio (visão admin)
 *     description: Lista completa de quem tirou quem no amigo secreto. Requer autenticação JWT.
 *     tags: [Sorteio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   participante:
 *                     type: string
 *                     example: "Ana"
 *                   tirou:
 *                     type: string
 *                     example: "Carlos"
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Sorteio ainda não foi realizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Sorteio ainda não foi realizado"
 */
router.get("/results", authMiddleware, verResultadosCompletos);

/**
 * @swagger
 * /draw/participant/{participantId}:
 *   get:
 *     summary: Retorna o amigo secreto de um participante específico
 *     description: Permite que um participante veja apenas quem ele tirou no sorteio. Não requer autenticação.
 *     tags: [Sorteio]
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do participante que quer ver seu amigo secreto
 *         example: 1
 *     responses:
 *       200:
 *         description: Amigo secreto retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participante:
 *                   type: string
 *                   example: "Ana"
 *                 amigoSecreto:
 *                   type: string
 *                   example: "Carlos"
 *       404:
 *         description: Participante não encontrado ou sorteio não realizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Participante não encontrado ou sorteio ainda não foi realizado"
 */
router.get("/participant/:participantId", verMeuAmigoSecreto);

module.exports = router;
