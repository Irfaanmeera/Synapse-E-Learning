import { Document } from "mongoose";

// Extend IStudent with Document to ensure it has Mongoose document properties
export interface IStudent extends Document {
  name?: string;
  email?: string;
  mobile?: number | string;
  password?: string;
  image?: string;
  wallet?: number;
  isBlocked?: boolean;
  isVerified?: boolean;
  courses?: string[];
}


export interface IUserAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: IStudent;
        userId?: string;
        token?: string;
        refreshToken?: string;
    };
}