"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
(0, db_1.connectDb)();
app_1.httpServer.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
});
