const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Amigo Secreto",
      version: "1.0.0",
      description:
        "API para gerenciar sorteio de amigo secreto - Projeto de aula",
      contact: {
        name: "Derick Rufino",
        email: "derick.silva2@etec.sp.gov.br",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
    // ? Configurar autenticação JWT no Swagger
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT (sem 'Bearer')",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // ? Arquivos onde o Swagger vai procurar as anotações
  apis: [
    "./server.js",
    "./src/routes/participantRoutes.js",
    "./src/routes/drawRoutes.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
