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
exports.isUserAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT_1 = require("../utils/generateJWT");
const isUserAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        const refreshTokenHeader = req.headers["x-refresh-token"];
        console.log("Authorization Header", authorizationHeader);
        if (!authorizationHeader) {
            return res.status(403).json({ success: false, message: "Access token is missing" });
        }
        const token = authorizationHeader.split(" ")[1];
        console.log("Token from frontend", token);
        let decoded;
        try {
            // Verify the access token
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decoded !== 'string' && decoded.role) {
                req.currentUser = decoded.userId; // Store user ID
                return next();
            }
            else {
                return res.status(403).json({ success: false, message: "Invalid token" });
            }
        }
        catch (error) {
            if (error.name === "TokenExpiredError" && refreshTokenHeader) {
                const refreshToken = refreshTokenHeader;
                try {
                    const refreshDecoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                    if (typeof refreshDecoded !== 'string' && refreshDecoded.role) {
                        req.currentUser = refreshDecoded.userId;
                        const newAccessToken = (0, generateJWT_1.generateToken)(refreshDecoded.userId, refreshDecoded.role, process.env.JWT_SECRET, '1m');
                        console.log("Access Token generated", newAccessToken);
                        res.setHeader("x-access-token", newAccessToken);
                        return next();
                    }
                    else {
                        console.log("Invalid or expired refresh token");
                        return res.status(403).json({ success: false, message: "Invalid refresh token" });
                    }
                }
                catch (error) {
                    console.log("Invalid or expired refresh token");
                    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
                }
            }
            else {
                return res.status(403).json({ success: false, message: "Invalid access token" });
            }
        }
    }
    catch (error) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
});
exports.isUserAuth = isUserAuth;
