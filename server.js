require("dotenv").config();
const PORT = process.env.PORT || 3000;

const express = require("express");
const jwt = require("jsonwebtoken");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const participantRoutes = require("./src/routes/participantRoutes");
const drawRoutes = require("./src/routes/drawRoutes");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Gera um token JWT para testes
 *     description: Cria um token de autenticação que pode ser usado nas rotas protegidas. Copie o token retornado e use no botão 'Authorize' do Swagger.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para usar nas rotas protegidas
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 instrucoes:
 *                   type: string
 *                   description: Como usar o token no Swagger
 *                   example: "Copie o token e clique em 'Authorize' no topo da página do Swagger"
 */
app.post("/auth/token", (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

  const token = jwt.sign(
    {
      id: 1,
      email: "admin@test.com",
      nome: "Administrador",
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token: token,
    instrucoes:
      "Copie o token e clique em 'Authorize' no topo da página do Swagger",
  });
});

app.use("/participants", participantRoutes);
app.use("/draw", drawRoutes);

app.listen(PORT, () => {
  console.log(`Acesse http://localhost:${PORT}/api-docs`);
  console.info("Rotas disponíveis:");
  console.log("POST /auth/token - Gerar token JWT para testes");
  console.log(
    "GET /participants - Listar todos os participantes e gerar token de teste"
  );
  console.log("POST /participants - Adicionar um novo participante");
  console.log(
    "DELETE /participants/:id - Remover um participante (requer autenticação) "
  );
  console.log("POST /draw - Realizar sorteio (requer autenticação)");
  console.log(
    "GET /draw/results - Ver todos os resultados do sorteio (requer autenticação)"
  );
  console.log("GET /draw/participant/:participantId - Ver seu amigo secreto");
});
