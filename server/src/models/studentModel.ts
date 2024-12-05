import mongoose, { Document, Model } from "mongoose";
import { IStudent } from "../interfaces/entityInterface/IStudent";

interface StudentModel extends Model<StudentDoc> {
  build(attrs: IStudent): StudentDoc;
}

interface StudentDoc extends Document {
  name: string;
  email: string;
  mobile: number;
  password: string;
  image?: string;
  isBlocked?: boolean;
  wallet?: number;
  courses?: string[];
}

const studentSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      default:'',
    },
    image: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
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

studentSchema.statics.build = (student: IStudent) => {
  return new Student(student);
};

const Student = mongoose.model<StudentDoc, StudentModel>(
  "student",
  studentSchema
);

export { Student };