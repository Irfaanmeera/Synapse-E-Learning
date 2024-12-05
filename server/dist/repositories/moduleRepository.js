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
exports.ModuleRepository = void 0;
const moduleModel_1 = require("../models/moduleModel");
class ModuleRepository {
    createModule(moduleDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = moduleModel_1.Module.build(moduleDetails);
            return yield module.save();
        });
    }
    updateModule(moduleId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield moduleModel_1.Module.findByIdAndUpdate(moduleId, updateData, { new: true });
        });
    }
    deleteModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield moduleModel_1.Module.findByIdAndDelete(moduleId);
        });
    }
    addChapter(moduleId, chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const module = yield moduleModel_1.Module.findById(moduleId);
            (_a = module === null || module === void 0 ? void 0 : module.chapters) === null || _a === void 0 ? void 0 : _a.push(chapter);
            return yield module.save();
        });
    }
    findModuleById(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield moduleModel_1.Module.findById(moduleId);
        });
    }
    getTotalChapterCount(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield moduleModel_1.Module.find({ courseId });
            const totalChapterCount = modules.reduce((count, module) => count + module.chapters.length, 0);
            return totalChapterCount;
        });
    }
}
exports.ModuleRepository = ModuleRepository;
