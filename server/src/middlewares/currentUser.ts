import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateToken } from '../utils/generateJWT';

export const isUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const refreshTokenHeader = req.headers["x-refresh-token"];

    console.log("Authorization Header", authorizationHeader);
    if (!authorizationHeader) {
      return res.status(403).json({ success: false, message: "Access token is missing" });
    }

    const token = authorizationHeader.split(" ")[1];
    console.log("Token from frontend", token);
    let decoded: JwtPayload | string;

    try {
      // Verify the access token
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload | string;
      if (typeof decoded !== 'string' && decoded.role) {
        req.currentUser = decoded.userId;  // Store user ID
        return next();
      } else {
        return res.status(403).json({ success: false, message: "Invalid token" });
      }
    } catch (error) {

      if (error.name === "TokenExpiredError" && refreshTokenHeader) {
        const refreshToken = refreshTokenHeader as string;
        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload | string;
          if (typeof refreshDecoded !== 'string' && refreshDecoded.role) {
            req.currentUser = refreshDecoded.userId;
            const newAccessToken = generateToken(refreshDecoded.userId, refreshDecoded.role, process.env.JWT_SECRET!, '1m');
            console.log("Access Token generated", newAccessToken);
            res.setHeader("x-access-token", newAccessToken);
            return next();
          } else {
            console.log("Invalid or expired refresh token" )
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
          }
        } catch (error) {
          console.log("Invalid or expired refresh token" )
          return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }
      } else {
        return res.status(403).json({ success: false, message: "Invalid access token" });
      }
    }
  } catch (error) {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }
};

