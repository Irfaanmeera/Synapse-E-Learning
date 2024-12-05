"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    instructor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "instructor",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advance"],
        default: "Beginner",
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
    },
    enrolled: {
        type: Number,
        default: 0
    },
    modules: [
        {
            module: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "module",
            },
            order: {
                type: Number,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    approval: {
        type: String,
        enum: ["Pending", "Rejected", "Approved"],
        default: "Pending",
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
courseSchema.statics.build = (course) => {
    return new Course(course);
};
const Course = mongoose_1.default.model("course", courseSchema);
exports.Course = Course;
