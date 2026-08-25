import { Router } from "express";
import { createJobController, deletejobController, getJobController, getSingleJobController, updateJobController } from "../controllers/jobApplication.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create", authMiddleware, asyncHandler(createJobController))
router.get("/jobs", authMiddleware, asyncHandler(getJobController))
router.get("/:id", authMiddleware, asyncHandler(getSingleJobController))
router.patch("/:id", authMiddleware, asyncHandler(updateJobController))
router.delete("/:id", authMiddleware, asyncHandler(deletejobController))


export default router