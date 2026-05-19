import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import uploadRoutes from "./routes/upload.js"
import tokenRoutes from "./routes/tokens.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

app.use("/api/tokens", tokenRoutes)
app.use("/api", uploadRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})