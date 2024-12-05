"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        default: '',
    },
    image: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "courses",
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
studentSchema.statics.build = (student) => {
    return new Student(student);
};
const Student = mongoose_1.default.model("student", studentSchema);
exports.Student = Student;
