import { Router } from "express";
import userRoutes from "./user.routes.js";
import jobRouter from "./jobApplication.routes.js"

const router = Router()

router.use("/auth", userRoutes)
router.use("/job", jobRouter)

export default router