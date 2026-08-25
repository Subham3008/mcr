import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "15m"
    }
  )
}

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

export const hashToken = async (refreshToken) => {
  return await bcrypt.hash(refreshToken, 10)
}

export const compareToken = async (refreshToken, hashedRefreshToken) => {
  return await bcrypt.compare(refreshToken, hashedRefreshToken)
}