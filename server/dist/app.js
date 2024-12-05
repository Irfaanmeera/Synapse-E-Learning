"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.app = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middlewares/error");
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const instructorRoutes_1 = __importDefault(require("./routes/instructorRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const SocketIOServices_1 = require("./services/SocketIOServices");
const http_1 = __importDefault(require("http"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
}));
exports.app.options('*', (0, cors_1.default)());
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use('/', studentRoutes_1.default);
exports.app.use("/instructor", instructorRoutes_1.default);
exports.app.use("/admin", adminRoutes_1.default);
exports.app.use('/auth', authRoutes_1.default);
exports.app.use((err, req, res, next) => {
    logger_1.default.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).send('Internal Server Error');
});
const httpServer = http_1.default.createServer(exports.app);
exports.httpServer = httpServer;
SocketIOServices_1.io.attach(httpServer);
//unknown route
exports.app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
