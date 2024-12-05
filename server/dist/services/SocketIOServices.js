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
exports.emitEvent = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const chatRepository_1 = require("../repositories/chatRepository");
const chatRepository = new chatRepository_1.ChatRepository();
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io = io;
const activeMembers = new Map();
io.on("connection", (socket) => {
    console.log("A user connected");
    const connectedClientsCount = io.engine.clientsCount;
    console.log(connectedClientsCount, "connections");
    socket.on("join-room", (data) => {
        socket.join(data.courseId);
        if (activeMembers.has(data.courseId)) {
            activeMembers.set(data.courseId, activeMembers.get(data.courseId) + 1);
        }
        else {
            activeMembers.set(data.courseId, 1);
        }
        io.to(data.courseId).emit("active-members", {
            courseId: data.courseId,
            members: activeMembers.get(data.courseId),
        });
    });
    socket.on("get-all-messages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ courseId }) {
        const messages = yield chatRepository.getChatByCourseId(courseId);
        console.log("Messages in repo", messages);
        io.to(courseId).emit("get-course-response", messages);
    }));
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { courseId, message } = data;
        console.log("course id", courseId);
        const existChat = yield chatRepository.getChatByCourseId(courseId);
        if (existChat) {
            yield chatRepository.addMessage(courseId, message);
        }
        else {
            const chatDetails = {
                courseId,
                messages: [message],
            };
            yield chatRepository.createChatRoom(chatDetails);
        }
        io.to(data.courseId).emit("messageResponse", data);
    }));
    socket.on("disconnect", () => {
        console.log("User disconnected");
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
            if (room !== socket.id) {
                if (activeMembers.has(room)) {
                    activeMembers.set(room, activeMembers.get(room) - 1);
                    io.to(room).emit("active-members", {
                        courseId: room,
                        count: activeMembers.get(room),
                    });
                }
            }
        });
    });
});
const emitEvent = (eventData) => {
    io.emit(eventData.event, eventData.data);
};
exports.emitEvent = emitEvent;
httpServer.listen(4000, () => {
    console.log("Socket.IO listening on *:4000");
});
