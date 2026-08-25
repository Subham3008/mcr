import { Router } from "express"
import { loginController, logoutController, refreshAccessTokenController, registerContoller } from "../controllers/user.controller.js"
import { asyncHandler } from "../middlewares/asyncHandler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", asyncHandler(registerContoller))
router.post("/login", asyncHandler(loginController))
router.post("/logout", authMiddleware, asyncHandler(logoutController))
router.post("refresh-token", asyncHandler(refreshAccessTokenController))

export default router