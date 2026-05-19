import prisma from "./prisma.js"

export const requireUploadToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.headers["x-upload-token"] || req.query.token

  if (!token) {
    return res.status(401).json({ error: "Token de upload obrigatório" })
  }

  try {
    const existing = await prisma.token.findUnique({
      where: { token }
    })

    if (!existing) {
      return res.status(403).json({ error: "Token de upload inválido" })
    }

    return next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno" })
  }
}
