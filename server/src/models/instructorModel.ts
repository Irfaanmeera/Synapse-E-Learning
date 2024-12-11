import mongoose, {Document, Model} from 'mongoose'
import { IInstructor} from "../interfaces/entityInterface/IInstructor";

interface InstructorModel extends Model<InstructorDoc>{
    build(attrs:IInstructor): InstructorDoc;
}
interface InstructorDoc extends IInstructor, Document {
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