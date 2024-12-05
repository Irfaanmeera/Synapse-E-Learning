/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateToken } from '../utils/generateJWT';

const authRouter = express.Router();

authRouter.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log("refreshToken in auth route", refreshToken);
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

   
    if (typeof decoded === 'object' && decoded.userId && decoded.role) {
 
      const newAccessToken = generateToken(
        decoded.userId,
        decoded.role,
        process.env.JWT_SECRET!,
        '1m' 
      );

      return res.json({ accessToken: newAccessToken });
    } else {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    } else {
      return res.status(401).json({ message: 'Invalid refresh token', error: error.message });
    }
  }
});

export default authRouter;
