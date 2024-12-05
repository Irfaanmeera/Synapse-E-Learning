import { IOtp } from "../entityInterface/IOtp";
export interface IOtpService{
    createOtp(otpDetails:IOtp) : Promise<IOtp | undefined>;
    findOtp(email:string): Promise<IOtp | null>;
    generateOtp():string;
    sendOtpMail(email:string,otp:string):Promise<void>;
   
}