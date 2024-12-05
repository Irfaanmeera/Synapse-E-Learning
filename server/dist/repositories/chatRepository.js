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
exports.ChatRepository = void 0;
const chatModel_1 = require("../models/chatModel");
const badrequestError_1 = require("../constants/errors/badrequestError");
class ChatRepository {
    createChatRoom(chatDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatroom = chatModel_1.Chat.build(chatDetails);
            return yield chatroom.save();
        });
    }
    getChatByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield chatModel_1.Chat.findOne({ courseId });
            return chat;
        });
    }
    addMessage(courseId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const chat = yield chatModel_1.Chat.findOne({ courseId });
            if (!chat) {
                throw new badrequestError_1.BadRequestError("Chat not found");
            }
            (_a = chat.messages) === null || _a === void 0 ? void 0 : _a.push(message);
            return yield chat.save();
        });
    }
}
exports.ChatRepository = ChatRepository;
