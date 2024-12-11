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
/* eslint-disable react/no-is-mounted */
const instructorModel_1 = require("../models/instructorModel");
const baseRepository_1 = require("./baseRepository");
const badrequestError_1 = require("../constants/errors/badrequestError");
class InstructorRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(instructorModel_1.Instructor);
    }
    createInstructor(instructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(instructorData);
        });
    }
    findInstructorById(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findById(instructorId);
        });
    }
    findInstructorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    }
    updateInstructorVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.findInstructorByEmail(email);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            instructor.set({ isVerified: true });
            return yield instructor.save();
        });
    }
    updateInstructor(instructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, mobile, qualification, description } = instructorData;
            const instructor = yield this.findById(id);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            instructor.set({ name, mobile, qualification, description });
            return yield instructor.save();
        });
    }
    updateInstructorImage(instructorId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Invalid Id");
            }
            instructor.set({ image });
            return yield instructor.save();
        });
    }
    updatePassword(instructorId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Id not valid");
            }
            instructor.set({ password });
            return yield instructor.save();
        });
    }
    addToWallet(instructorId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            instructor.set({ wallet: ((_a = instructor.wallet) !== null && _a !== void 0 ? _a : 0) + amount });
            return yield instructor.save();
        });
    }
    addWalletHistory(instructorId, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            const walletDetails = { amount, description, date: new Date() };
            (_a = instructor.walletHistory) === null || _a === void 0 ? void 0 : _a.push(walletDetails);
            return yield instructor.save();
        });
    }
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll();
        });
    }
    blockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            instructor.set({ isBlocked: true });
            return yield instructor.save();
        });
    }
    unblockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.findById(instructorId);
            if (!instructor) {
                throw new badrequestError_1.BadRequestError("Instructor not found");
            }
            instructor.set({ isBlocked: false });
            return yield instructor.save();
        });
    }
    getInstructorCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.count();
        });
    }
}
exports.InstructorRepository = InstructorRepository;
// import { Instructor } from "../models/instructorModel";
// import { IInstructor } from "../interfaces/entityInterface/IInstructor";
// import { IInstructorRepository } from "../interfaces/repositoryInterfaces/IInstructorRepository";
// import { BadRequestError } from "../constants/errors/badrequestError";
// export class InstructorRepository implements IInstructorRepository {
//   async createInstructor(instructorData: IInstructor): Promise<IInstructor> {
//     const instructor = Instructor.build(instructorData)
//     return await instructor.save();
//   }
//   async findInstructorById(instructorId: string): Promise<IInstructor | null> {
//     return await Instructor.findById(instructorId)
//   }
//   async findInstructorByEmail(email: string): Promise<IInstructor | null> {
//     return await Instructor.findOne({ email })
//   }
//   async updateInstructorVerification(email: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ email })
//     instructor!.set({ isVerified: true })
//     return await instructor!.save()
//   }
//   async updateInstructor(instructorData: IInstructor): Promise<IInstructor> {
//     const { id, name, mobile, qualification, description } = instructorData;
//     const instructor = await Instructor.findById(id)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     instructor.set({
//       name,
//       mobile,
//       qualification,
//       description
//     })
//     return await instructor.save()
//   }
//   async updateInstructorImage(instructorId: string, image: string): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Invalid Id')
//     }
//     instructor.set({
//       image,
//     })
//     return await instructor.save()
//   }
//   async updatePassword(
//     instructorId: string,
//     password: string
//   ): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId);
//     if (!instructor) {
//       throw new BadRequestError("Id not valid");
//     }
//     instructor.set({
//       password,
//     });
//     return await instructor.save();
//   }
//   async addToWallet(instructorId: string, amount: number): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     instructor.set({ wallet: (instructor.wallet ?? 0) + amount })
//     return await instructor.save()
//   }
//   async addWalletHistory(instructorId: string, amount: number, description: string): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     const walletDetails = {
//       amount,
//       description,
//       date: new Date(),
//     }
//     instructor.walletHistory?.push(walletDetails)
//     return await instructor.save()
//   }
//   async getAllInstructors(): Promise<IInstructor[] | null> {
//     return await Instructor.find();
//   }
//   async blockInstructor(instructorId: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ _id: instructorId });
//     instructor!.set({ isBlocked: true });
//     return await instructor!.save();
//   }
//   async unblockInstructor(instructorId: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ _id: instructorId });
//     instructor!.set({ isBlocked: false });
//     return await instructor!.save();
//   }
//   async getInstructorCount(): Promise<number> {
//     return await Instructor.countDocuments();
//   }
// }
