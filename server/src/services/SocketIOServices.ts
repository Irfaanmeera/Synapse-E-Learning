import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { IMessage } from "../interfaces/entityInterface/IChat";
import { ChatRepository } from "../repositories/chatRepository";

const chatRepository = new ChatRepository();

interface ChatMessage {
  courseId: string;
  message: IMessage;
}

interface EventData {
  event: string;
  data: {
    message: string;
    courseName: string;
    image: string;
    id: string;
  };
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://synapse-e-learning.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const activeMembers = new Map<string, number>();

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  const connectedClientsCount = io.engine.clientsCount;
  console.log(connectedClientsCount, "connections");

  socket.on("join-room", (data: { courseId: string }) => {
    socket.join(data.courseId);

    if (activeMembers.has(data.courseId)) {
      activeMembers.set(data.courseId, activeMembers.get(data.courseId)! + 1);
    } else {
      activeMembers.set(data.courseId, 1);
    }

    io.to(data.courseId).emit("active-members", {
      courseId: data.courseId,
      members: activeMembers.get(data.courseId),
    });
  });

  socket.on("get-all-messages", async ({ courseId }) => {
    const messages = await chatRepository.getChatByCourseId(courseId);
    console.log("Messages in repo", messages);
    io.to(courseId).emit("get-course-response", messages);
  });

  socket.on("message", async (data: ChatMessage) => {
    const { courseId, message } = data;
    console.log("course id", courseId);
    const existChat = await chatRepository.getChatByCourseId(courseId);

    if (existChat) {
      await chatRepository.addMessage(courseId, message);
    } else {
      const chatDetails = {
        courseId,
        messages: [message],
      };

      await chatRepository.createChatRoom(chatDetails);
    }
    io.to(data.courseId!).emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        if (activeMembers.has(room)) {
          activeMembers.set(room, activeMembers.get(room)! - 1);
          io.to(room).emit("active-members", {
            courseId: room,
            count: activeMembers.get(room),
          });
        }
      }
    });
  });
});

const emitEvent = (eventData: EventData) => {
  io.emit(eventData.event, eventData.data);
};

httpServer.listen(4000, () => {
  console.log("Socket.IO listening on *:4000");
});

export { io, emitEvent };
