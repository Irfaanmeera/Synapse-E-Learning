import { IChatRepository } from "../interfaces/repositoryInterfaces/IChatRepository";
import { IChat, IMessage } from "../interfaces/entityInterface/IChat";
import { Chat } from "../models/chatModel";
import { BadRequestError } from "../constants/errors/badrequestError";

export class ChatRepository implements IChatRepository {
  async createChatRoom(chatDetails: IChat): Promise<IChat> {
    const chatroom = Chat.build(chatDetails);
    return await chatroom.save();
  }

  async getChatByCourseId(courseId: string): Promise<IChat | null> {
    const chat=  await Chat.findOne({ courseId });
    return chat;
  }

  async addMessage(courseId: string, message: IMessage): Promise<IChat> {
    const chat = await Chat.findOne({ courseId });
    if (!chat) {
      throw new BadRequestError("Chat not found");
    }
    chat.messages?.push(message);
    return await chat.save();
  }
}