import { IOtp } from "../entityInterface/IOtp";
export interface IOtpRepository {
    createOtp(otpData: IOtp): Promise<IOtp | undefined>;
    findOtp(email: string): Promise<IOtp | null>;
    updateOtp(otpData: IOtp): Promise<IOtp | undefined>

}