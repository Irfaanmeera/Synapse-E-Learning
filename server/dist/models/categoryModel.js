"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
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
categorySchema.statics.build = (category) => {
    return new Category(category);
};
const Category = mongoose_1.default.model("category", categorySchema);
exports.Category = Category;
