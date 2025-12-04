# Guia de Desenvolvimento - API Amigo Secreto

## Sobre Este Guia

Este é um guia prático e direto para te ajudar a construir sua API de Amigo Secreto para a atividade da aula. O foco é entender **como** e **por que** cada parte funciona, sem complicações desnecessárias.

**O que NÃO vamos fazer:**

- Conectar banco de dados (usaremos arrays em memória)
- Fazer deploy ou preparar para produção
- Configurar testes automatizados complexos
- Usar ferramentas avançadas de logging

**O que VAMOS fazer:**

- Criar uma API funcional e bem organizada
- Entender a arquitetura em camadas (Routes → Controllers → Models)
- Implementar autenticação JWT básica
- Fazer validações e tratamento de erros
- Criar o algoritmo de sorteio com as regras do amigo secreto

## Análise do Seu Código Atual

Analisando o que você já tem, identifiquei alguns pontos para corrigir:

### ✅ O que está funcionando:

- Estrutura de pastas está boa
- Express configurado corretamente
- Rotas básicas criadas

### ⚠️ O que precisa ser corrigido:

1. **Bug no Model**: A função `addParticipant()` não recebe o parâmetro `nome`
2. **Middleware vazio**: O `authMiddleware.js` está vazio e precisa ser implementado
3. **Lógica nas rotas**: O arquivo `participantRoutes.js` tem lógica que deveria estar no controller
4. **Falta o sorteio**: Não existe ainda a parte de realizar e consultar o sorteio
5. **Nomenclatura mista**: Alguns lugares usam português, outros inglês

---

## Passo a Passo do Desenvolvimento

### 📋 Checklist Geral

- [ ] Corrigir bugs existentes nos models
- [ ] Implementar o middleware de autenticação JWT
- [ ] Criar o model e controller do sorteio
- [ ] Adicionar validações básicas
- [ ] Implementar tratamento de erros simples
- [ ] Testar todas as rotas com Postman/Insomnia
- [ ] Documentar como usar a API

---

## ETAPA 1: Corrigindo os Bugs Existentes

### 1.1 Corrigir o Model de Participantes

**Problema:** A função `addParticipant` não recebe o parâmetro `nome`.

**Arquivo:** `src/models/participantModel.js`

**Como corrigir:**

```javascript
function addParticipant(nome) {
  // ← ADICIONE o parâmetro nome aqui
  const newParticipant = {
    id: participants.length + 1,
    nome,
    amigoSecreto: null,
  };
  participants.push(newParticipant);
  return newParticipant;
}
```

**Por que isso é importante?** Sem o parâmetro, a função não sabe qual nome usar, e o participante seria criado sem nome.

### 1.2 Adicionar Função para Buscar por ID

Você vai precisar disso para o sorteio e para outras funcionalidades.

**Adicione no `participantModel.js`:**

```javascript
function getParticipantById(id) {
  return participants.find((p) => p.id === id);
}

// Não esqueça de exportar
module.exports = {
  getAllParticipants,
  addParticipant,
  removeParticipant,
  getParticipantById, // ← Adicione aqui
};
```

### 1.3 Limpar a Lógica das Rotas

**Problema:** O arquivo `participantRoutes.js` tem código de controller e lógica de JWT misturada.

**Como deve ser (simplificado):**

```javascript
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  adicionarParticipant,
  listarParticipants,
  removerParticipant,
} = require("../controllers/participantController");

const router = express.Router();

router.get("/", listarParticipants);
router.post("/", adicionarParticipant);
router.delete("/:id", authMiddleware, removerParticipant); // ← middleware protege esta rota

module.exports = router;
```

**Por que simplificar?** A rota deve apenas conectar a URL à função que vai processar. O resto fica nos controllers e middlewares.

---

## ETAPA 2: Implementando o Middleware de Autenticação

Este é um dos pontos importantes da avaliação (Segurança).

### 2.1 Entendendo JWT

**O que é JWT?**

- JSON Web Token - um "cartão de acesso" criptografado
- Tem 3 partes: Header.Payload.Signature
- É usado para provar que você tem permissão para fazer algo

**Como funciona na prática:**

1. Você gera um token com `jwt.sign()` (já está fazendo isso!)
2. O cliente envia esse token no header `Authorization: Bearer TOKEN`
3. O middleware verifica se o token é válido com `jwt.verify()`
4. Se válido, permite o acesso; se não, retorna erro 401

### 2.2 Implementando o Middleware

**Arquivo:** `src/middlewares/authMiddleware.js`

```javascript
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

function authMiddleware(req, res, next) {
  // 1. Pegar o header Authorization
  const authHeader = req.headers.authorization;

  // 2. Verificar se existe
  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não fornecido",
    });
  }

  // 3. Extrair o token (formato: "Bearer TOKEN")
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      erro: "Formato de token inválido. Use: Bearer TOKEN",
    });
  }

  const token = parts[1];

  // 4. Verificar se o token é válido
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Adicionar as informações do usuário na requisição
    req.user = decoded;

    // 6. Passar para a próxima função (controller)
    return next();
  } catch (err) {
    return res.status(401).json({
      erro: "Token inválido ou expirado",
    });
  }
}

module.exports = authMiddleware;
```

**Como testar:**

1. No Postman, faça GET em `/participants` para pegar um token
2. Copie o token
3. Tente DELETE `/participants/1` sem token → deve dar erro 401
4. Tente DELETE `/participants/1` com o token no header → deve funcionar

---

## ETAPA 3: Criando o Sistema de Sorteio

Esta é a parte mais interessante! Vamos criar toda a funcionalidade do amigo secreto.

### 3.1 Criar o Model do Sorteio

**Arquivo:** `src/models/sorteioModel.js` (CRIAR NOVO)

```javascript
let sorteioRealizado = false;
let resultadosSorteio = []; // Array de { participanteId, amigoSecretoId }

// Função auxiliar: embaralhar array (Fisher-Yates)
function embaralhar(array) {
  const arr = [...array]; // copia para não modificar o original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // troca
  }
  return arr;
}

// Verificar se o sorteio é válido (ninguém tirou a si mesmo)
function sorteioValido(participantes, sorteados) {
  for (let i = 0; i < participantes.length; i++) {
    if (participantes[i].id === sorteados[i].id) {
      return false; // alguém tirou a si mesmo!
    }
  }
  return true;
}

function realizarSorteio(participantes) {
  // Validar: mínimo 3 participantes
  if (participantes.length < 3) {
    throw new Error("É necessário no mínimo 3 participantes para o sorteio");
  }

  // Verificar se já foi realizado
  if (sorteioRealizado) {
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
```

**Entendendo o código:**

1. **`embaralhar()`**: Usa o algoritmo Fisher-Yates para misturar o array de forma aleatória e uniforme
2. **`sorteioValido()`**: Verifica se ninguém tirou a si mesmo
3. **`realizarSorteio()`**: Continua tentando até conseguir um sorteio válido
4. **`getAmigoSecreto()`**: Retorna apenas o amigo secreto de um participante específico
5. **`getSorteioCompleto()`**: Retorna todos os pares (visão admin)

### 3.2 Criar o Controller do Sorteio

**Arquivo:** `src/controllers/drawController.js` (já existe, mas precisa ser reescrito)

```javascript
const { getAllParticipants } = require("../models/participantModel");
const {
  realizarSorteio,
  getSorteioCompleto,
  getAmigoSecreto,
} = require("../models/sorteioModel");

function fazerSorteio(req, res) {
  try {
    const participantes = getAllParticipants();
    const resultado = realizarSorteio(participantes);

    res.json({
      mensagem: "Sorteio realizado com sucesso!",
      totalParticipantes: participantes.length,
    });
  } catch (erro) {
    res.status(400).json({
      erro: erro.message,
    });
  }
}

function verResultadosCompletos(req, res) {
  try {
    const resultados = getSorteioCompleto();

    res.json({
      sorteio: resultados,
    });
  } catch (erro) {
    res.status(400).json({
      erro: erro.message,
    });
  }
}

function verMeuAmigoSecreto(req, res) {
  try {
    const participanteId = parseInt(req.params.participantId);

    if (isNaN(participanteId)) {
      return res.status(400).json({
        erro: "ID inválido",
      });
    }

    const resultado = getAmigoSecreto(participanteId);

    res.json(resultado);
  } catch (erro) {
    res.status(404).json({
      erro: erro.message,
    });
  }
}

module.exports = {
  fazerSorteio,
  verResultadosCompletos,
  verMeuAmigoSecreto,
};
```

### 3.3 Criar as Rotas do Sorteio

**Arquivo:** `src/routes/drawRoutes.js` (CRIAR NOVO)

```javascript
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  fazerSorteio,
  verResultadosCompletos,
  verMeuAmigoSecreto,
} = require("../controllers/drawController");

const router = express.Router();

// POST /draw - Realizar sorteio (protegido)
router.post("/", authMiddleware, fazerSorteio);

// GET /draw/results - Ver todos os resultados (protegido - admin)
router.get("/results", authMiddleware, verResultadosCompletos);

// GET /draw/participant/:participantId - Ver seu amigo secreto
router.get("/participant/:participantId", verMeuAmigoSecreto);

module.exports = router;
```

### 3.4 Registrar as Rotas no server.js

**Arquivo:** `server.js`

Adicione as rotas do sorteio:

```javascript
const express = require("express");
const participantRoutes = require("./src/routes/participantRoutes");
const drawRoutes = require("./src/routes/drawRoutes"); // ← ADICIONE

const app = express();
app.use(express.json());

app.use("/participants", participantRoutes);
app.use("/draw", drawRoutes); // ← ADICIONE

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
```

---

## ETAPA 4: Melhorando Validações e Erros

Vamos adicionar algumas validações importantes.

### 4.1 Validar Nome do Participante

No **controller** `participantController.js`, melhore a validação:

```javascript
function adicionarParticipant(req, res) {
  const { nome } = req.body;

  // Validações
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }

  if (typeof nome !== "string") {
    return res.status(400).json({ erro: "Nome deve ser um texto" });
  }

  if (nome.trim().length < 2) {
    return res
      .status(400)
      .json({ erro: "Nome deve ter pelo menos 2 caracteres" });
  }

  if (nome.length > 50) {
    return res
      .status(400)
      .json({ erro: "Nome muito longo (máximo 50 caracteres)" });
  }

  // Verificar se nome já existe
  const participantes = getAllParticipants();
  const nomeJaExiste = participantes.some(
    (p) => p.nome.toLowerCase() === nome.trim().toLowerCase()
  );

  if (nomeJaExiste) {
    return res
      .status(400)
      .json({ erro: "Já existe um participante com esse nome" });
  }

  const novo = addParticipant(nome.trim());
  res.status(201).json(novo);
}
```

### 4.2 Middleware de Erro Global (Opcional mas Recomendado)

Adicione no **final** do `server.js`, antes do `app.listen()`:

```javascript
// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Middleware para erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    erro: "Erro interno do servidor",
  });
});
```

---

## ETAPA 5: Testando a API Completa

### 5.1 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=meu_segredo_super_secreto_123
PORT=3000
```

No `server.js`, use o dotenv (já instalado):

```javascript
require("dotenv").config(); // ← No topo do arquivo

const PORT = process.env.PORT || 3000;

// ... resto do código

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
```

### 5.2 Roteiro de Testes no Postman

#### Teste 1: Adicionar Participantes

```
POST http://localhost:3000/participants
Body (JSON):
{
  "nome": "João"
}

Resultado esperado: 201 Created
```

Adicione pelo menos 3 participantes diferentes.

#### Teste 2: Listar Participantes

```
GET http://localhost:3000/participants

Resultado esperado: 200 OK com lista e token de teste
```

**Copie o token retornado!**

#### Teste 3: Tentar Deletar Sem Token

```
DELETE http://localhost:3000/participants/1

Resultado esperado: 401 Unauthorized
```

#### Teste 4: Deletar Com Token

```
DELETE http://localhost:3000/participants/1
Headers:
  Authorization: Bearer SEU_TOKEN_AQUI

Resultado esperado: 200 OK
```

#### Teste 5: Realizar Sorteio

```
POST http://localhost:3000/draw
Headers:
  Authorization: Bearer SEU_TOKEN_AQUI

Resultado esperado: 200 OK com mensagem de sucesso
```

#### Teste 6: Ver Todos os Resultados (Admin)

```
GET http://localhost:3000/draw/results
Headers:
  Authorization: Bearer SEU_TOKEN_AQUI

Resultado esperado: 200 OK com todos os pares
```

#### Teste 7: Ver Amigo Secreto Individual

```
GET http://localhost:3000/draw/participant/2

Resultado esperado: 200 OK com o amigo secreto do participante 2
```

#### Teste 8: Validações

Teste casos de erro:

- Adicionar participante sem nome
- Adicionar com menos de 2 caracteres
- Fazer sorteio com menos de 3 participantes
- Tentar fazer sorteio duas vezes

---

## ETAPA 6: Organização Final e Documentação

### 6.1 Estrutura Final dos Arquivos

Certifique-se de que tem todos estes arquivos:

```
projeto/
├── src/
│   ├── controllers/
│   │   ├── participantController.js ✓
│   │   └── drawController.js ✓
│   ├── middlewares/
│   │   └── authMiddleware.js ✓
│   ├── models/
│   │   ├── participantModel.js ✓
│   │   └── sorteioModel.js ✓ (NOVO)
│   └── routes/
│       ├── participantRoutes.js ✓
│       └── drawRoutes.js ✓ (NOVO)
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js ✓
```

### 6.2 Atualizar o README.md

Documente como usar sua API:

````markdown
# API Amigo Secreto

API para gerenciar sorteio de amigo secreto.

## Como Executar

1. Instalar dependências:

```bash
npm install
```
````

2. Criar arquivo `.env` com:

```
JWT_SECRET=sua_chave_aqui
PORT=3000
```

3. Iniciar servidor:

```bash
node server.js
```

## Endpoints

### Participantes

- `GET /participants` - Listar todos (retorna token de teste)
- `POST /participants` - Adicionar participante
  - Body: `{ "nome": "Nome do Participante" }`
- `DELETE /participants/:id` - Remover participante (requer autenticação)

### Sorteio

- `POST /draw` - Realizar sorteio (requer autenticação)
- `GET /draw/results` - Ver todos resultados (requer autenticação)
- `GET /draw/participant/:id` - Ver seu amigo secreto

## Autenticação

Use o token retornado em `GET /participants` no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

## Regras

- Mínimo 3 participantes para sorteio
- Ninguém pode tirar a si mesmo
- Sorteio só pode ser feito uma vez

```

### 6.3 Criar .gitignore

```

node_modules/
.env

```

---

## Checklist Final de Entrega

Antes de entregar, verifique:

### Código
- [ ] Todos os arquivos criados e funcionando
- [ ] Sem erros no console ao executar
- [ ] Middleware de autenticação implementado
- [ ] Algoritmo de sorteio funcionando
- [ ] Validações implementadas
- [ ] Tratamento de erros funcionando

### Testes
- [ ] Testei adicionar participante
- [ ] Testei listar participantes
- [ ] Testei deletar com e sem token
- [ ] Testei sorteio com menos de 3 (deve dar erro)
- [ ] Testei sorteio com 3+ participantes (deve funcionar)
- [ ] Testei ver resultados completos
- [ ] Testei ver amigo secreto individual
- [ ] Testei validações (nome vazio, duplicado, etc)

### Documentação
- [ ] README.md completo
- [ ] .env.example criado (sem valores reais)
- [ ] Comentários nos trechos mais complexos

### Estrutura e Organização
- [ ] Arquivos nas pastas corretas
- [ ] Nomenclatura consistente
- [ ] Código indentado e legível
- [ ] Sem código comentado ou não usado

---

## Conceitos Importantes Aprendidos

### 1. Arquitetura em Camadas

```

Cliente (Postman)
↓
Rotas (Routes) - Define quais URLs existem
↓
Controllers - Processa a requisição
↓
Models - Gerencia os dados
↓
Dados (Array em memória)

````

**Por que fazer assim?**
- Cada arquivo tem uma responsabilidade
- Mais fácil de entender e manter
- Mais fácil de testar
- Mais fácil de evoluir (trocar array por banco de dados)

### 2. Middlewares

São funções que ficam **no meio** do caminho entre a requisição e a resposta.

```javascript
Requisição → Middleware 1 → Middleware 2 → Controller → Resposta
````

**Usos comuns:**

- Autenticação (`authMiddleware`)
- Validação de dados
- Logging (registrar requisições)
- Tratamento de erros

### 3. JWT (JSON Web Token)

**Fluxo:**

1. Servidor gera token com `jwt.sign(dados, segredo)`
2. Cliente guarda o token
3. Cliente envia token em cada requisição protegida
4. Servidor verifica com `jwt.verify(token, segredo)`

**Vantagens:**

- Stateless (servidor não precisa guardar sessões)
- Contém informações do usuário
- Seguro (assinado criptograficamente)

### 4. Status HTTP Importantes

- **200** OK - Sucesso geral
- **201** Created - Recurso criado com sucesso
- **400** Bad Request - Dados inválidos
- **401** Unauthorized - Não autenticado
- **404** Not Found - Recurso não encontrado
- **500** Internal Server Error - Erro no servidor

---

## Recursos para Consulta

### Documentação Oficial

- **Express.js**: https://expressjs.com/
- **JWT**: https://jwt.io/introduction
- **MDN HTTP Status**: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status

### Dicas de Estudo

1. **Leia o código do Express na documentação** - Os exemplos são ótimos
2. **Use console.log()** - Para entender o fluxo dos dados
3. **Teste cada função isoladamente** - Antes de juntar tudo
4. **Leia mensagens de erro com atenção** - Elas geralmente dizem o que está errado

### Próximos Passos (Após a Atividade)

Se quiser evoluir o projeto depois:

1. Adicionar banco de dados (MongoDB ou PostgreSQL)
2. Criar front-end (React, Vue)
3. Adicionar mais features (grupos, sorteios múltiplos)
4. Implementar envio de emails
5. Deploy (Heroku, Vercel, Railway)

---

## Dicas Finais

### ⚠️ Erros Comuns

1. **"Cannot find module"** → Esqueceu de exportar ou importar algo
2. **"jwt is not defined"** → Esqueceu o `require("jsonwebtoken")`
3. **"Cannot read property of undefined"** → Cheque se o objeto existe antes de acessar
4. **Rota não funciona** → Verifique se registrou no server.js

### 💡 Boas Práticas

1. **Teste cada parte separadamente** antes de juntar tudo
2. **Use nomes descritivos** para variáveis e funções
3. **Adicione validações** antes de processar dados
4. **Trate erros** com try-catch quando apropriado
5. **Mantenha funções pequenas** - uma responsabilidade por função

### 🎯 Foco na Avaliação

Lembre-se dos critérios:

1. **Estrutura (30%)**: Pastas organizadas, separação de responsabilidades
2. **Segurança (30%)**: JWT implementado corretamente
3. **Tratamento de Erros (20%)**: Validações e respostas apropriadas
4. **Funcionalidade (20%)**: Tudo funcionando conforme as regras

---

**Boa sorte com o projeto! 🚀**

Lembre-se: o objetivo é **aprender e entender**, não apenas fazer funcionar. Se tiver dúvidas sobre alguma parte, revise este guia e consulte a documentação oficial do Express.
