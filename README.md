# API Amigo Secreto

API REST para gerenciamento de sorteio de amigo secreto desenvolvida com Node.js e Express.

## Descrição

Sistema completo para realizar sorteios de amigo secreto com autenticação JWT, garantindo que ninguém tire a si mesmo e com visualização individual dos resultados.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **JSON Web Token (JWT)** - Autenticação e segurança
- **Swagger** - Documentação interativa da API
- **dotenv** - Gerenciamento de variáveis de ambiente

## Requisitos

- Node.js v14 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/derick-rufino/api-amigo-secreto.git
cd api-amigo-secreto
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=meu_segredo_super_secreto_123
PORT=3000
```

4. Inicie o servidor:

```bash
npm start
```

5. Acesse a documentação interativa:

```
http://localhost:3000/api-docs
```

## Estrutura do Projeto

```
api-amigo-secreto/
├── src/
│   ├── controllers/
│   │   ├── participantController.js
│   │   └── drawController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── participantModel.js
│   │   └── sorteioModel.js
│   └── routes/
│       ├── participantRoutes.js
│       └── drawRoutes.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── swagger.js
```

## Endpoints da API

### Autenticação

#### `POST /auth/token`

Gera um token JWT para usar nas rotas protegidas.

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "instrucoes": "Copie o token e clique em 'Authorize' no topo da página do Swagger"
}
```

---

### Participantes

#### `GET /participants`

Lista todos os participantes cadastrados.

**Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Ana",
    "amigoSecreto": null
  }
]
```

#### `POST /participants`

Adiciona um novo participante.

**Body:**

```json
{
  "nome": "João Silva"
}
```

**Resposta:** `201 Created`

```json
{
  "id": 4,
  "nome": "João Silva",
  "amigoSecreto": null
}
```

#### `DELETE /participants/:id`

Remove um participante. **Requer autenticação JWT.**

**Headers:**

```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**

```json
{
  "mensagem": "Usuário removido",
  "participante": {
    "id": 1,
    "nome": "Ana",
    "amigoSecreto": null
  }
}
```

---

### Sorteio

#### `POST /draw`

Realiza o sorteio do amigo secreto. **Requer autenticação JWT.**

**Requisitos:**

- Mínimo 3 participantes cadastrados
- Sorteio só pode ser feito uma vez

**Headers:**

```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**

```json
{
  "mensagem": "Sorteio realizado com sucesso!",
  "totalParticipantes": 5
}
```

#### `GET /draw/results`

Retorna todos os pares do sorteio (visão admin). **Requer autenticação JWT.**

**Headers:**

```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**

```json
[
  {
    "participante": "Ana",
    "tirou": "Carlos"
  },
  {
    "participante": "Carlos",
    "tirou": "Maria"
  }
]
```

#### `GET /draw/participant/:participantId`

Retorna apenas o amigo secreto de um participante específico. Não requer autenticação.

**Resposta:**

```json
{
  "participante": "Ana",
  "amigoSecreto": "Carlos"
}
```

---

## Autenticação

As rotas protegidas requerem um token JWT no header da requisição:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

### Como obter o token:

1. **Via Swagger:**

   - Acesse http://localhost:3000/api-docs
   - Execute `POST /auth/token`
   - Copie o token retornado
   - Clique em "Authorize" no topo da página
   - Cole o token (sem "Bearer")

2. **Via Postman/Insomnia:**
   - Faça POST em `http://localhost:3000/auth/token`
   - Copie o token da resposta
   - Use no header: `Authorization: Bearer TOKEN`

---

## Regras de Negócio

1. **Sorteio:**

   - É necessário no mínimo 3 participantes
   - Ninguém pode tirar a si mesmo
   - O sorteio só pode ser realizado uma vez
   - Algoritmo Fisher-Yates garante distribuição aleatória

2. **Participantes:**

   - Nome é obrigatório
   - Nomes devem ser únicos
   - Remoção de participantes requer autenticação

3. **Segurança:**
   - Tokens JWT expiram em 1 hora
   - Rotas administrativas protegidas por autenticação
   - Validação de dados em todas as entradas

---

## Exemplos de Uso

### Fluxo Completo com cURL

```bash
# 1. Gerar token
curl -X POST http://localhost:3000/auth/token

# 2. Adicionar participantes
curl -X POST http://localhost:3000/participants \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana"}'

curl -X POST http://localhost:3000/participants \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos"}'

curl -X POST http://localhost:3000/participants \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria"}'

# 3. Listar participantes
curl http://localhost:3000/participants

# 4. Realizar sorteio (use o token obtido no passo 1)
curl -X POST http://localhost:3000/draw \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 5. Ver resultados completos (admin)
curl http://localhost:3000/draw/results \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 6. Ver amigo secreto individual
curl http://localhost:3000/draw/participant/1
```

---

## Tratamento de Erros

A API retorna códigos HTTP apropriados e mensagens descritivas:

- **200** - OK (sucesso)
- **201** - Created (recurso criado)
- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (token inválido ou ausente)
- **404** - Not Found (recurso não encontrado)
- **500** - Internal Server Error (erro no servidor)

**Exemplo de erro:**

```json
{
  "erro": "Token não fornecido"
}
```

---

## Documentação Interativa

Acesse http://localhost:3000/api-docs para visualizar a documentação completa com interface Swagger, onde você pode:

- Ver todos os endpoints disponíveis
- Testar as rotas diretamente no navegador
- Ver exemplos de requisições e respostas
- Autorizar usando JWT de forma visual

---

## Scripts Disponíveis

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## Desenvolvimento

### Adicionar nova rota:

1. Crie o controller em `src/controllers/`
2. Crie a rota em `src/routes/`
3. Adicione documentação Swagger com comentários `@swagger`
4. Registre a rota no `server.js`

### Exemplo de documentação Swagger:

```javascript
/**
 * @swagger
 * /sua-rota:
 *   get:
 *     summary: Descrição breve
 *     tags: [Categoria]
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get("/sua-rota", seuController);
```

---

## Considerações de Segurança

- Tokens JWT têm validade de 1 hora
- Variáveis sensíveis estão no arquivo `.env`
- Middleware de autenticação valida todos os tokens
- Validação de entrada em todos os endpoints
- Armazenamento em memória (adequado para fins educacionais)

**Nota:** Este projeto foi desenvolvido para fins educacionais. Para produção, considere:

- Usar banco de dados real (MongoDB, PostgreSQL)
- Implementar refresh tokens
- Adicionar rate limiting
- Usar HTTPS
- Implementar logs estruturados

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## Licença

Este projeto foi desenvolvido para fins educacionais como parte de um projeto de aula.

---

## Autor

**Derick Rufino**

- Email: derick.silva2@etec.sp.gov.br
- GitHub: [@derick-rufino](https://github.com/derick-rufino)

---

## Suporte

Para dúvidas ou problemas:

- Abra uma [issue](https://github.com/derick-rufino/api-amigo-secreto/issues)
- Entre em contato via email

---

**Projeto desenvolvido como atividade de aula**
Disciplina: Desenvolvimento de APIs REST
Instituição: ETEC
