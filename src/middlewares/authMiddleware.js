const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

function authMiddleware(req, res, next) {
  // Pegar o header Authorization
  const authHeader = req.headers.authorization;

  // Verificar se existe algo nele (está procuradno o token)
  if (!authHeader) { // se não tiver ele já retorna o erro
    return res.status(401).json({
      erro: "Token não fornecido",
    });
  }

  // pegar o token (formato: "Bearer TOKEN")
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      erro: "Formato de token inválido. Use: Bearer TOKEN",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Adicionar as informações do usuário na requisição, depois de docodificar o token
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
