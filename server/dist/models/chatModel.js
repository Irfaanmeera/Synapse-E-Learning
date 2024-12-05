"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "course",
    },
    messages: [
        {
            name: {
                type: String,
            },
            sender: {
                type: mongoose_1.default.Schema.Types.ObjectId,
            },
            message: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
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
chatSchema.statics.build = (chat) => {
    return new Chat(chat);
};
const Chat = mongoose_1.default.model("chat", chatSchema);
exports.Chat = Chat;
