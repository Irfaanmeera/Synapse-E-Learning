import jwt from 'jsonwebtoken';
import UserRole from '../interfaces/entityInterface/IUserRoles';

export const generateToken = (userId: string, role: UserRole, secret: string, expiresIn: string) => {
    try{
        return jwt.sign(
            { userId, role },
            secret,
            { expiresIn }
          );
    }catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);  
          } else {
            throw new Error("An unknown error occurred");
          }
        }
};