import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import appRoutes from "../routes/index.routes.js"


dotenv.config()
const app = express()

//cors set-up
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "app is healthy"
  })
})

app.use("/api", appRoutes)

export default app