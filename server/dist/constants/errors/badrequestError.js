"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const customError_1 = require("./customError");
class BadRequestError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
