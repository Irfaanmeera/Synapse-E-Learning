export interface IStudent {
    id?: string;
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