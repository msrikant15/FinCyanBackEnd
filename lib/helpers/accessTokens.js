import jwt from "jsonwebtoken";
import config from "../../config/app";

export function createAccessToken(userId) {
  return jwt.sign({ id: userId }, config.secretKey, { expiresIn: "60m" });
}
