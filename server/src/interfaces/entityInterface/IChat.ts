export interface IChat {
    id?: string;
    courseId?: string;
    messages?: IMessage[];
  }
  
  export interface IMessage {
    name: string;
    sender?: string;
    role?:string;
    message?: string;
    createdAt?: Date;
  }