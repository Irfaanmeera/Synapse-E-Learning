"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStudent = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkStudent = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            console.log(token);
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            console.log(decoded);
            if (decoded.role === "student") {
                req.currentUser = decoded.studentId;
                next();
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
    catch (error) {
        next();
    }
};
exports.checkStudent = checkStudent;
