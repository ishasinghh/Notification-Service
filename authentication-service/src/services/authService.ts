import { User } from "../models/userModel";
import bcrypt from "bcryptjs";
import { config } from "../config";
import { generateToken } from "../utils/jwtHelper";
import {
  CustomError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../errors/customeError";
import { connected } from "process";

export class AuthService {
  public async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const responseData = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      connected: newUser.connected,
    };
    return responseData;
  }

  public async login(email: string, password: string): Promise<any> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserNotFoundError();
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new InvalidCredentialsError();
      }
      const token = await generateToken(
        { userId: user._id.toString() },
        config.expireTime
      );
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      };
    } catch (err) {
      if (
        err instanceof UserNotFoundError ||
        err instanceof InvalidCredentialsError
      ) {
        throw err; // Rethrow known errors
      } else {
        throw new CustomError("Error during login", 500);
      }
    }
  }

  public async updateUserConnectionStatus(
    userId: string,
    status: boolean
  ): Promise<any> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { connected: status },
        { new: true }
      );
      if (!user) {
        throw new UserNotFoundError();
      }
      const userRes = {
        userId: user._id,
        connected: user.connected,
      };
      return userRes;
    } catch (error) {
      throw error;
    }
  }
}
