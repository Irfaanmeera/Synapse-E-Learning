"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moduleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Course' // Assuming Course is another model, if applicable
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    chapters: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            videoUrl: {
                type: String,
            },
            videoThumbnail: {
                type: Object,
            },
            videoSection: {
                type: String,
            },
            videoLength: {
                type: Number,
            },
            videoPlayer: {
                type: String,
            },
            content: {
                type: String,
            }
        }
    ]
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
moduleSchema.statics.build = (module) => {
    return new Module(module);
};
const Module = mongoose_1.default.model('module', moduleSchema);
exports.Module = Module;
