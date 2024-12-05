"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enrolledCourseSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "course",
        required: true,
    },
    studentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "student",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: true,
    },
    progression: [
        {
            type: String,
        },
    ],
    completed: {
        type: Boolean,
        default: false,
    },
    notes: [
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
enrolledCourseSchema.statics.build = (enrolledCourse) => {
    return new EnrolledCourse(enrolledCourse);
};
const EnrolledCourse = mongoose_1.default.model("enrolledCourse", enrolledCourseSchema);
exports.EnrolledCourse = EnrolledCourse;
