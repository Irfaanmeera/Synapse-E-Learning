"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const otpRepository_1 = require("../repositories/otpRepository");
const otp_generator_1 = __importDefault(require("otp-generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class OtpService {
    constructor() {
        this.otpRepository = new otpRepository_1.OtpRepository();
    }
    createOtp(otpData) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this.otpRepository.findOtp(otpData.email);
            if (!otp) {
                return this.otpRepository.createOtp(otpData);
            }
            else {
                return this.otpRepository.updateOtp(otpData);
            }
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.otpRepository.findOtp(email);
        });
    }
    generateOtp() {
        const generatedOtp = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log(generatedOtp);
        return generatedOtp;
    }
    sendOtpMail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
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
        });
    }
}
exports.OtpService = OtpService;
