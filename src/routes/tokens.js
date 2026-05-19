import express from "express"
import crypto from "crypto"
import prisma from "../lib/prisma.js"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString("hex")
    const savedToken = await prisma.token.create({
      data: { token }
    })

    res.status(201).json({
      id: savedToken.id,
      token: savedToken.token,
      createdAt: savedToken.createdAt
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro interno" })
  }
})

router.get("/", async (req, res) => {
  try {
    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        createdAt: true
      }
    })

    res.json(tokens)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro interno" })
  }
})

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" })
  }

  try {
    await prisma.token.delete({ where: { id } })
    res.json({ message: "Token removido" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro interno" })
  }
})

export default router
