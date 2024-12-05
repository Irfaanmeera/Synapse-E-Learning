"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const customError_1 = require("./customError");
class ForbiddenError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.ForbiddenError = ForbiddenError;
