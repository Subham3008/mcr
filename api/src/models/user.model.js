import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "name is required"],
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 5
  },
  refreshToken: {
    type: String,
    select: false,
  },
},
  {
    timestamps: true
  }
)

const User = model("User", userSchema)

export default User