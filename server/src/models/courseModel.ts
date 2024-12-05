import mongoose, { Model, Document } from 'mongoose'
import { ICourse } from '../interfaces/entityInterface/ICourse'
import { IModule } from '../interfaces/entityInterface/IModule';
import { CourseApproval } from '../interfaces/entityInterface/ICourse';

interface CourseModel extends Model<ICourse> {
    build(attrs: ICourse): CourseDoc;
}

interface CourseDoc extends Document {
    id?: string;
    name?: string;
    description?: string;
    instructor?: string;
    image?: string;
    level?: string;
    price?: number;
    language?: string;
    category?: string;
    modules?: { module: string | IModule; order: number }[];
    createdAt?: Date;
    status?: boolean;
    approval?: CourseApproval;
}

const courseSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "instructor",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advance"],
            default: "Beginner",
            
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
           
        },
        enrolled:{
            type:Number,
            default:0
        },
       
        modules: [
            {
                module: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "module",
                },
                order: {
                    type: Number,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        approval: {
            type: String,
            enum: ["Pending", "Rejected", "Approved"],
            default: "Pending",
        },
        status: {
            type: Boolean,
            default: true,
        },
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

courseSchema.statics.build = (course: ICourse) => {
    return new Course(course)
}

const Course = mongoose.model<CourseDoc, CourseModel>("course", courseSchema)

export { Course }