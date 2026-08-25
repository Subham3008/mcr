import jwt from "jsonwebtoken"
import ApiError from "../utils/apiError.js"


export const authMiddleware = (req, res, next) => {

  try {

    console.log("req.headers--->",req.headers);

    console.log("req.headers.authorization---->>",req.headers.authorization);


    const authHeader = req.headers.authorization

    const token = authHeader?.split(" ")[1]


    if (!token) {
      throw new ApiError(401, "Authentication required")
    }

    const decode = jwt.verify(token, process.env.ACCESS_SECRET_KEY)

    req.user = decode.userId

    next()

  } catch (error) {
    next(
      error instanceof ApiError ? error : new ApiError(401, "Invalid or expired token")
    )
  }

}