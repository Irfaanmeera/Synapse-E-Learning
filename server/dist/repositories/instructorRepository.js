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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorRepository = void 0;
const instructorModel_1 = require("../models/instructorModel");
const badrequestError_1 = require("../constants/errors/badrequestError");
class InstructorRepository {
    createInstructor(instructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = instructorModel_1.Instructor.build(instructorData);
            return yield instructor.save();
        });
    }
    findInstructorById(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.Instructor.findById(instructorId);
        });
    }
    findInstructorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.Instructor.findOne({ email });
        });
    }
    updateInstructorVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield instructorModel_1.Instructor.findOne({ email });
            instructor.set({ isVerified: true });
            return yield instructor.save();
        });
    }
    updateInstructor(instructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, mobile, qualification, description } = instructorData;
            const instructor = yield instructorModel_1.Instructor.findById(id);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError('Instructor not found');
            }
            instructor.set({
                name,
                mobile,
                qualification,
                description
            });
            return yield instructor.save();
        });
    }
    updateInstructorImage(instructorId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield instructorModel_1.Instructor.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError('Invalid Id');
            }
            instructor.set({
                image,
            });
            return yield instructor.save();
        });
    }
    updatePassword(instructorId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield instructorModel_1.Instructor.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Id not valid");
            }
            instructor.set({
                password,
            });
            return yield instructor.save();
        });
    }
    addToWallet(instructorId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const instructor = yield instructorModel_1.Instructor.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError('Instructor not found');
            }
            instructor.set({ wallet: ((_a = instructor.wallet) !== null && _a !== void 0 ? _a : 0) + amount });
            return yield instructor.save();
        });
    }
    addWalletHistory(instructorId, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const instructor = yield instructorModel_1.Instructor.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError('Instructor not found');
            }
            const walletDetails = {
                amount,
                description,
                date: new Date(),
            };
            (_a = instructor.walletHistory) === null || _a === void 0 ? void 0 : _a.push(walletDetails);
            return yield instructor.save();
        });
    }
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.Instructor.find();
        });
    }
    blockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield instructorModel_1.Instructor.findOne({ _id: instructorId });
            instructor.set({ isBlocked: true });
            return yield instructor.save();
        });
    }
    unblockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield instructorModel_1.Instructor.findOne({ _id: instructorId });
            instructor.set({ isBlocked: false });
            return yield instructor.save();
        });
    }
    getInstructorCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.Instructor.countDocuments();
        });
    }
}
exports.InstructorRepository = InstructorRepository;
