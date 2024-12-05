"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OTP_EXPIRE = 5 * 60;
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: OTP_EXPIRE });
otpSchema.statics.build = (otp) => {
    return new Otp(otp);
};
const Otp = mongoose_1.default.model('otp', otpSchema);
exports.Otp = Otp;
