import express from "express"
import multer from "multer"
import prisma from "../lib/prisma.js"
import { requireUploadToken } from "../lib/tokenAuth.js"
import fs from "fs"
import path from "path"

const router = express.Router()
const UPLOAD_DIR = path.resolve("uploads")

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/zip"
]

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
    cb(null, `${Date.now()}-${safeName}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const error = new Error("Tipo de arquivo não permitido")
      error.code = "UNSUPPORTED_FILE_TYPE"
      cb(error)
    }
  }
})

const handleUploadError = (error, res) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Arquivo muito grande. Limite de 10 MB." })
    }

    return res.status(400).json({ error: error.message })
  }

  if (error?.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({ error: "Tipo de arquivo não permitido" })
  }

  return res.status(400).json({ error: "Erro no upload do arquivo" })
}

router.post("/upload", requireUploadToken, (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      return handleUploadError(error, res)
    }

    const file = req.file
    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" })
    }

    try {
      const relativePath = path.relative(process.cwd(), file.path)
      const savedFile = await prisma.file.create({
        data: {
          filename: file.filename,
          path: relativePath,
          mimetype: file.mimetype,
          size: file.size
        }
      })

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

      res.json({
        message: "Upload realizado",
        file: savedFile,
        url: fileUrl
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Erro interno" })
    }
  })
})

router.get("/files", async (req, res) => {
  const files = await prisma.file.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  res.json(files)
})

router.get("/files/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" })
  }

  const file = await prisma.file.findUnique({
    where: { id }
  })

  if (!file) {
    return res.status(404).json({ error: "Arquivo não encontrado" })
  }

  res.json(file)
})

export default router