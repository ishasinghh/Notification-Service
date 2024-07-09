import mongoose from "mongoose";
import { CustomError } from "../errors/customeError";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  connected: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);

export const findUserById = async (id: string): Promise<any> => {
  try {
    const user = await User.findById({ _id: id }, { _id: 1 });
    return user;
  } catch (error) {
    throw new CustomError("Error during finding user", 500);
  }
};
