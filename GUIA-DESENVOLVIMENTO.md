# Guia de Desenvolvimento - API Amigo Secreto

## Introdução

Este guia foi criado para te orientar na construção completa da API de Amigo Secreto. Você já tem uma base inicial, mas existem vários pontos que precisam ser corrigidos e melhorados para criar uma API robusta e profissional.

## Análise da Estrutura Atual

### Problemas Identificados na Base Existente

1. **Inconsistências de nomenclatura**: Alguns arquivos usam `participant`, outros `participante`, e há referências a `user` onde deveria ser `participant`
2. **Middleware de autenticação vazio**: O arquivo `authMiddleware.js` está vazio
3. **Funções incompletas**: Várias funções nos controllers e models têm problemas de implementação
4. **Mistura de responsabilidades**: Lógica de negócio misturada com rotas
5. **Falta de validação de dados**: Não há validação adequada dos dados de entrada
6. **Tratamento de erros inadequado**: Não há um sistema centralizado de tratamento de erros

## Etapa 1: Organização e Padronização da Estrutura

### 1.1 Estrutura de Pastas Recomendada

Baseado nas melhores práticas, sua estrutura deveria ser:

```
projeto/
├── src/
│   ├── config/          # Configurações da aplicação
│   ├── controllers/     # Controladores (lógica de rotas)
│   ├── middlewares/     # Middlewares customizados
│   ├── models/         # Modelos de dados
│   ├── routes/         # Definição de rotas
│   ├── services/       # Lógica de negócio (nova camada)
│   ├── utils/          # Utilitários gerais
│   └── validators/     # Validadores de entrada (nova camada)
├── tests/              # Testes da aplicação
├── docs/               # Documentação
├── .env                # Variáveis de ambiente
├── .env.example        # Exemplo de variáveis
├── server.js           # Ponto de entrada
└── package.json
```

### 1.2 Padronização de Nomenclatura

**Regras a seguir:**

- Use sempre o inglês para nomes de arquivos e funções
- Use camelCase para variáveis e funções JavaScript
- Use PascalCase para classes e construtores
- Use kebab-case para URLs de rotas
- Seja consistente: se escolheu `participant`, use em toda a aplicação

### 1.3 Primeira Ação Prática

1. **Renomeie os arquivos** para manter consistência
2. **Crie as novas pastas** que estão faltando (`config`, `services`, `utils`, `validators`)
3. **Revise todas as importações** após as mudanças de nome

## Etapa 2: Configuração do Ambiente

### 2.1 Variáveis de Ambiente

Você precisa criar um sistema robusto de configuração. Estude como:

- Organizar variáveis de ambiente por categorias (database, jwt, server)
- Validar se todas as variáveis obrigatórias estão presentes
- Criar diferentes arquivos de configuração para desenvolvimento/produção

### 2.2 Arquivo de Configuração Centralizado

Crie um módulo que:

- Carregue todas as variáveis de ambiente
- Valide se as obrigatórias estão presentes
- Exporte um objeto com todas as configurações organizadas

## Etapa 3: Implementação dos Models (Camada de Dados)

### 3.1 Correção do Model Participant

Analise os problemas no arquivo atual:

- A função `addParticipante` não recebe o parâmetro `nome`
- Falta validação de dados
- O ID deveria ser único e mais robusto
- Precisa de métodos para buscar por ID específico

### 3.2 Criação do Model Sorteio

Você precisa criar um model para gerenciar:

- O estado do sorteio (se já foi realizado ou não)
- Os pares formados (quem tirou quem)
- Validações das regras de negócio (mínimo 3 participantes, não sortear a si mesmo)

### 3.3 Persistência de Dados

Por enquanto, use arrays em memória, mas:

- Organize os dados de forma estruturada
- Pense em como seria a migração para um banco de dados futuramente
- Implemente métodos CRUD completos

## Etapa 4: Camada de Serviços (Lógica de Negócio)

### 4.1 Criação dos Services

Os services devem conter toda a lógica de negócio:

**ParticipantService:**

- Validar se nome é único
- Verificar se participante pode ser removido (se sorteio já foi feito)
- Regras específicas de participantes

**DrawService:**

- Algoritmo de sorteio
- Validação de regras (mínimo 3 participantes)
- Garantir que ninguém sorteia a si mesmo
- Verificar se sorteio já foi realizado

### 4.2 Implementação do Algoritmo de Sorteio

Pesquise e implemente:

- Algoritmo Fisher-Yates para embaralhamento
- Verificação de pares inválidos
- Retry logic se o sorteio resultar em pares inválidos
- Validações antes e depois do sorteio

## Etapa 5: Middlewares e Segurança

### 5.1 Middleware de Autenticação JWT

Estude e implemente:

- Verificação do token no header Authorization
- Decodificação e validação do token
- Tratamento de tokens expirados ou inválidos
- Anexar informações do usuário ao objeto `req`

### 5.2 Middleware de Tratamento de Erros

Implemente um sistema centralizado que:

- Capture todos os erros não tratados
- Formate respostas de erro consistentes
- Diferencie entre erros de desenvolvimento e produção
- Registre logs para debugging

### 5.3 Middleware de Validação

Crie middlewares para:

- Validar estrutura do body das requisições
- Validar tipos de dados
- Validar campos obrigatórios
- Retornar mensagens de erro claras

## Etapa 6: Controllers Refinados

### 6.1 Responsabilidades dos Controllers

Os controllers devem apenas:

- Extrair dados da requisição
- Chamar os services apropriados
- Formatar e retornar a resposta
- Não conter lógica de negócio

### 6.2 Padronização de Respostas

Crie um padrão para todas as respostas:

```json
{
  "success": true/false,
  "data": {},
  "message": "string",
  "error": {}  // apenas em caso de erro
}
```

## Etapa 7: Rotas e Endpoints

### 7.1 Estrutura das Rotas

Organize suas rotas seguindo REST:

- `GET /participants` - Listar todos
- `POST /participants` - Criar novo
- `GET /participants/:id` - Buscar específico
- `DELETE /participants/:id` - Remover (com autenticação)
- `POST /draw` - Realizar sorteio
- `GET /draw/results` - Ver todos os resultados (admin)
- `GET /draw/participant/:id` - Ver resultado individual

### 7.2 Implementação Gradual

Implemente uma rota por vez:

1. Comece com as rotas de participantes
2. Teste cada rota completamente
3. Adicione validações
4. Implemente as rotas de sorteio
5. Adicione autenticação onde necessário

## Etapa 8: Validação de Dados

### 8.1 Validadores Customizados

Crie validadores para:

- Nomes de participantes (tamanho, caracteres permitidos)
- IDs (formato, existência)
- Estrutura de requisições

### 8.2 Middleware de Validação

Implemente um middleware que:

- Execute validações antes dos controllers
- Retorne erros padronizados
- Seja reutilizável entre diferentes rotas

## Etapa 9: Testes e Documentação

### 9.1 Testes Manuais

Antes de implementar testes automatizados:

- Teste cada endpoint individualmente
- Use ferramentas como Postman ou Insomnia
- Verifique todos os cenários (sucesso e erro)
- Teste a sequência completa da aplicação

### 9.2 Documentação

Documente:

- Como executar a aplicação
- Todas as rotas disponíveis
- Formato das requisições e respostas
- Exemplos práticos de uso

## Etapa 10: Melhorias e Otimizações

### 10.1 Logging

Implemente:

- Logs de requisições
- Logs de erros
- Logs de eventos importantes (sorteios realizados)

### 10.2 Rate Limiting

Adicione proteção contra:

- Muitas requisições do mesmo IP
- Tentativas de força bruta

### 10.3 CORS e Headers de Segurança

Configure:

- CORS adequadamente
- Headers de segurança
- Validação de Content-Type

## Roteiro de Implementação Sugerido

### Semana 1: Fundação

1. Corrija a estrutura de pastas
2. Padronize nomenclaturas
3. Configure variáveis de ambiente
4. Implemente o sistema de configuração

### Semana 2: Dados e Lógica

1. Corrija e complete os models
2. Implemente a camada de services
3. Crie o algoritmo de sorteio
4. Teste a lógica de negócio

### Semana 3: API e Segurança

1. Implemente todos os middlewares
2. Corrija e complete os controllers
3. Finalize todas as rotas
4. Adicione validação e tratamento de erros

### Semana 4: Testes e Documentação

1. Teste todos os cenários
2. Documente a API
3. Implemente melhorias de segurança
4. Otimize performance

## Recursos para Estudo

### Documentação Oficial

- Express.js: https://expressjs.com/
- JWT: https://jwt.io/
- Node.js: https://nodejs.org/docs/

### Conceitos Importantes

- Arquitetura MVC vs Arquitetura em Camadas
- Padrões REST
- Middleware em Express
- Tratamento de erros assíncronos
- Segurança em APIs

### Ferramentas Úteis

- Postman/Insomnia para testes
- Nodemon para desenvolvimento
- ESLint para qualidade de código

## Considerações Finais

Lembre-se de que construir uma API robusta é um processo iterativo. Comece com o básico funcionando e vá refinando gradualmente. Cada etapa deste guia foi pensada para te ensinar conceitos fundamentais do desenvolvimento backend.

Não tenha pressa - é melhor entender bem cada conceito antes de prosseguir para o próximo. Use este guia como um mapa, mas sinta-se livre para pesquisar e aprofundar-se nos tópicos que achar mais interessantes.

Boa sorte no desenvolvimento da sua API!
