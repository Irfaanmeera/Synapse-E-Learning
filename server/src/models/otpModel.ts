import mongoose, { Model, Document } from 'mongoose';
import { IOtp } from '../interfaces/entityInterface/IOtp';

const OTP_EXPIRE = 5 * 60;

interface OtpModel extends Model<IOtp> {
    build(attrb: IOtp): OtpDoc
}

interface OtpDoc extends Document {
    email: string;
    otp: string;
    createdAt?: Date;
}

const otpSchema = new mongoose.Schema({
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
},
    {
       
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    })
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: OTP_EXPIRE })

otpSchema.statics.build = (otp: IOtp) => {
    return new Otp(otp)
}

const Otp = mongoose.model<OtpDoc, OtpModel>('otp', otpSchema)

export { Otp }