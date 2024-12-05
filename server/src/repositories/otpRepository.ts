import { Otp } from "../models/otpModel";
import { IOtp } from "../interfaces/entityInterface/IOtp";
import { IOtpRepository } from "../interfaces/repositoryInterfaces/IOtpRepository";

export class OtpRepository implements IOtpRepository {
    async createOtp(otpData: IOtp): Promise<IOtp> {
        const otp = Otp.build(otpData);
        return await otp.save()
    }

    async findOtp(email: string): Promise<IOtp | null> {
        return await Otp.findOne({ email })
    }

    async updateOtp(otpData: IOtp): Promise<IOtp | undefined> {
        const otp = await Otp.findOne({ email: otpData.email })

        otp!.set({
            otp: otpData.otp,
            createdAt: new Date(),
        })
        return await otp!.save()
    }
}