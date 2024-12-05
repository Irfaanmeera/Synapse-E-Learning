import mongoose, {Document, Model} from 'mongoose'
import { IInstructor,Transaction } from "../interfaces/entityInterface/IInstructor";

interface InstructorModel extends Model<InstructorDoc>{
    build(attrs:IInstructor): InstructorDoc;
}
interface InstructorDoc extends Document {
    id?: string;
    name: string;
    password: string;
    email: string;
    mobile: number;
    image:string;
    qualification?: string;
    isBlocked?: boolean;
    isVerified?: boolean;
    wallet?: number;
    walletHistory?: Transaction[];
    courses?:string[];
}

const instructorSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        
      },
      password: {
        type: String,
        
      },
      email: {
        type: String,
       
      },
      mobile: {
        type: Number,
        
      },
      image:{
        type:String,
      },
      qualification: {
        type: String,
        default:"Mern"
      
        
      },
      description:{
        type:String,
    
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      wallet: {
        type: Number,
        default: 0,
      },
      walletHistory: [
        {
          date: {
            type: Date,
          },
          amount: {
            type: Number,
          },
          description: {
            type: String,
          },
        },
      ],
      courses: [
        {
          type: String,
          
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

  instructorSchema.statics.build = (instructor:IInstructor)=>{
    return new Instructor(instructor)
  }

  const Instructor = mongoose.model<InstructorDoc, InstructorModel>(
    "instructor",
    instructorSchema
  );
  

  export {Instructor}