"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = void 0;
const express_validator_1 = require("express-validator");
exports.signupValidation = [
    (0, express_validator_1.body)("firstname")
        .trim()
        .matches(/^[A-Za-z]+$/)
        .withMessage("First name must contain only letters")
        .not()
        .isEmpty()
        .withMessage("Enter a valid name"),
    (0, express_validator_1.body)("lastname")
        .trim()
        .matches(/^[A-Za-z]+$/)
        .withMessage("First name must contain only letters")
        .not()
        .isEmpty()
        .withMessage("Enter a valid name"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 10 })
        .withMessage("password must be between 4 & 10")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
        .withMessage("Password must contain both letters and numbers"),
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Enter valid email"),
    (0, express_validator_1.body)("mobile")
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage("Enter valid 10-digit mobile number"),
];
