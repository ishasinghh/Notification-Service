import dotenv from "dotenv";

dotenv.config();

interface ConfigType {
  port: number;
  mongoURI: string;
  secretKey: string;
  expireTime: string;
}

export const config: ConfigType = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/",
  secretKey: process.env.SECRET_KEY || "3b9d3b1e2d5f4a6b3a2c1d4e5f6g7h8i",
  expireTime: process.env.EXPIRE_TIME || "4h",
};
