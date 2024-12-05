import mongoose, { Model, Document } from 'mongoose';
import { IModule } from '../interfaces/entityInterface/IModule';
import { IChapter } from '../interfaces/entityInterface/IModule';

interface ModuleModel extends Model<IModule> {
    build(attrs: IModule): ModuleDoc;
}

interface ModuleDoc extends Document {
    id?: string;
    name?: string;
    courseId?: string;
    description?: string;
    duration?: string;
    status?: boolean;
    createdAt?: Date;
    chapters?: IChapter[];
}

const moduleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course' // Assuming Course is another model, if applicable
        },
        status: {
            type: Boolean,
            default: true,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        chapters: [
            {
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    
                },
                videoUrl: {
                    type: String,
                   
                },
                videoThumbnail: {
                    type: Object,
                  
                },
                videoSection: {
                    type: String,
                   
                },
                videoLength: {
                    type: Number,
                    
                },
                videoPlayer: {
                    type: String,
                  
                },
                content:{
                    type:String,
                }
            }
        ]
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

moduleSchema.statics.build = (module: IModule) => {
    return new Module(module);
};

const Module = mongoose.model<ModuleDoc, ModuleModel>('module', moduleSchema);

export { Module };
