export interface Chat {
    courseId?: string;
    id?: string;
    messages?: Message[];
  }
  
  export interface Message {
    sender?: string;
    name?: string;
    createdAt?: Date;
    message?: string;
  }