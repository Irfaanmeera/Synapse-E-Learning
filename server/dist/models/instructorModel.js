"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const instructorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    image: {
        type: String,
    },
    qualification: {
        type: String,
        default: "Mern"
    },
    description: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    walletHistory: [
        {
            date: {
                type: Date,
            },
            amount: {
                type: Number,
            },
            description: {
                type: String,
            },
        },
    ],
    courses: [
        {
            type: String,
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
instructorSchema.statics.build = (instructor) => {
    return new Instructor(instructor);
};
const Instructor = mongoose_1.default.model("instructor", instructorSchema);
exports.Instructor = Instructor;
