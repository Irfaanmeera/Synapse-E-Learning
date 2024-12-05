import { IOtp } from "../interfaces/entityInterface/IOtp";
import { OtpRepository } from "../repositories/otpRepository";
import { IOtpService } from '../interfaces/serviceInterfaces/IOtpService'
import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'

export class OtpService implements IOtpService {
  private otpRepository: OtpRepository;
  constructor() {
    this.otpRepository = new OtpRepository()
  }
  async createOtp(otpData: IOtp): Promise<IOtp | undefined> {
    const otp = await this.otpRepository.findOtp(otpData.email)
    if (!otp) {
      return this.otpRepository.createOtp(otpData)
    } else {
      return this.otpRepository.updateOtp(otpData)
    }
  }
  async findOtp(email: string): Promise<IOtp | null> {
    return await this.otpRepository.findOtp(email)
  }
  generateOtp(): string {
    const generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(generatedOtp);
    return generatedOtp;
  }
  async sendOtpMail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "Gmail",
      secure: true,
      auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
      },
    });
    transporter.sendMail({
      to: email,
      from: process.env.TRANSPORTER_EMAIL,
      subject: "Synapse OTP Verification",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00466a; font-size: 28px; margin: 0;">Welcome to SYNAPSE!</h1>
            <p style="color: #777; font-size: 16px;">Your OTP verification code is below:</p>
        </div>
        <div style="text-align: center;">
            <h2 style="background: #00466a; margin: 20px auto; padding: 15px 25px; color: #fff; border-radius: 5px; font-size: 36px;">
                ${otp}
            </h2>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for choosing Synapse. Use this OTP to complete your sign-up process. This OTP is valid for 10 minutes.</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">If you did not request this, please ignore this email.</p>
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #aaa; font-size: 14px;">Regards,<br />The SYNAPSE Team</p>
            <p style="color: #aaa; font-size: 14px;">Synapse<br />Tidel Park, Chennai, India</p>
        </div>
    </div>
</div>`,
    });
  }

}