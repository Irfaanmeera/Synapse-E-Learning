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
exports.CategoryRepository = void 0;
const categoryModel_1 = require("../models/categoryModel");
class CategoryRepository {
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = categoryModel_1.Category.build({ category: data });
            return yield category.save();
        });
    }
    findCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield categoryModel_1.Category.findById(categoryId);
        });
    }
    findCategoryByName(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield categoryModel_1.Category.findOne({ category });
        });
    }
    updateCategory(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(categoryId);
            category.set({
                category: data,
            });
            return yield category.save();
        });
    }
    listCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(categoryId);
            category.set({
                status: true,
            });
            return yield category.save();
        });
    }
    ;
    unlistCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(categoryId);
            category.set({
                status: false,
            });
            return yield category.save();
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield categoryModel_1.Category.find();
        });
    }
    getListedCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return categoryModel_1.Category.find({ status: true });
        });
    }
}
exports.CategoryRepository = CategoryRepository;
