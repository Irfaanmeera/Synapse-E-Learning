export interface IModule {
    id?: string;
    name?: string;
    courseId?: string;
    status?: boolean;
    createdAt?: Date;
    chapters?: IChapter[];
  }
  
  export interface IChapter {
  title: string;
  description?: string;
  videoUrl?: string;
  content?:string;
  videoThumbnail?: object;
  videoSection?: string;
  videoLength?: number;
  videoPlayer?: string;
  }
  