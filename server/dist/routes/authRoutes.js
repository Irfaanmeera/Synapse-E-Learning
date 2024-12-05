"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT_1 = require("../utils/generateJWT");
const authRouter = express_1.default.Router();
authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        console.log("refreshToken in auth route", refreshToken);
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (typeof decoded === 'object' && decoded.userId && decoded.role) {
            const newAccessToken = (0, generateJWT_1.generateToken)(decoded.userId, decoded.role, process.env.JWT_SECRET, '1m');
            return res.json({ accessToken: newAccessToken });
        }
        else {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        else {
            return res.status(401).json({ message: 'Invalid refresh token', error: error.message });
        }
    }
}));
exports.default = authRouter;
