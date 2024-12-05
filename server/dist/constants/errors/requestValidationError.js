"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const customError_1 = require("./customError");
class RequestValidationError extends customError_1.CustomError {
    constructor(errors) {
        super("Invalid request parameters");
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === "field") {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
