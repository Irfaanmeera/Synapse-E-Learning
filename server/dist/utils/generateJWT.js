"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role, secret, expiresIn) => {
    try {
        return jsonwebtoken_1.default.sign({ userId, role }, secret, { expiresIn });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
exports.generateToken = generateToken;
