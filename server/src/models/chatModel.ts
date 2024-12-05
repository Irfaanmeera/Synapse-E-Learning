import mongoose, { Model, Document } from "mongoose";
import { IChat, IMessage } from "../interfaces/entityInterface/IChat";

interface ChatModel extends Model<IChat> {
  build(attrs: IChat): ChatDoc;
}

interface ChatDoc extends Document {
  id?: string;
  courseId?: string;
  messages?: IMessage[];
}

const chatSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
   
      ref: "course",
    },

    messages: [
      {
         name: {
          type: String,
        
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          
        },

        message: {
          type: String,
          
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

chatSchema.statics.build = (chat: IChat) => {
  return new Chat(chat);
};

const Chat = mongoose.model<ChatDoc, ChatModel>("chat", chatSchema);

export { Chat };