import User from "../models/user.model.js"
import ApiError from "../utils/apiError.js"
import { compareToken, generateAccessToken, generateRefreshToken, hashToken } from "../utils/generateTokens.js"
import { comparePassword, hashPassword } from "../utils/hashPassword.js"


export const registerContoller = async (req, res) => {

  const { name, email, password } = req.body

  if (!name || !name.trim()) {
    throw new ApiError(400, "Name is required")
  }

  if (!email || !email.trim()) {
    throw new ApiError(400, "Email is required")
  }

  if (!password || !password.trim()) {
    throw new ApiError(400, "Password is required")
  }

  const normalizedEmail = email.trim().toLowerCase()

  const isExists = await User.findOne({ email: normalizedEmail })

  if (isExists) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(password)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  const accessToken = generateAccessToken(newUser._id)
  const refreshToken = generateRefreshToken(newUser._id)

  const hashedRefreshToken = await hashToken(refreshToken)
  newUser.refreshToken = hashedRefreshToken
  await newUser.save()

  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 15 * 60 * 1000
  // })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })


  return res.status(201).json({
    success: true,
    message: "User registerd successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    accessToken,
  })

}

export const loginController = async (req, res) => {
  const { email, password } = req.body

  if (!email || !email.trim()) {
    throw new ApiError(400, "Email is required")
  }

  if (!password || !password.trim()) {
    throw new ApiError(400, "Password is required")
  }

  const normalizedEmail = email.trim().toLowerCase()

  const isExists = await User.findOne({ email: normalizedEmail })

  if (!isExists) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await comparePassword(password, isExists.password)

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(isExists._id)
  const refreshToken = generateRefreshToken(isExists._id)

  const hashedRefreshToken = await hashToken(refreshToken)
  isExists.refreshToken = hashedRefreshToken

  await isExists.save()


  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 15 * 60 * 1000
  // })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })


  return res.status(200).json({
    success: true,
    message: "User loggedIn successfully",
    user: {
      id: isExists.id,
      name: isExists.name,
      email: isExists.email,
    },
    accessToken,
  })

}

export const logoutController = async (req, res) => {

  // Remove hashed refresh token from database
  await User.findByIdAndUpdate(req.user, {
    $unset: {
      refreshToken: 1
    }
  })

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  return res.status(200).json({
    success: true,
    message: "Logout successfully"
  })
}

//access token generator controller--------->>
export const refreshAccessTokenController = async (req, res) => {

  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found")
  }

  const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)

  const user = await User.findById(decode.userId).select("+refreshToken")

  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token")
  }

  const isRefreshToken = await compareToken(refreshToken, user.refreshToken)

  if (!isRefreshToken) {
    throw new ApiError(401, "Invalid refresh token")
  }

  const newAccessToken = generateAccessToken(user._id)

  return res.status(200).json({
    success: true,
    accessToken: newAccessToken
  })
}