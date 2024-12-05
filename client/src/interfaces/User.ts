export interface User {
    id?: string;
    name?: string;
    email?: string;
    mobile?: number;
    profile?: string;
    role?: string;
    image?: string;
    wallet?: number;
    status?: boolean;
    courses?: string[];
    isBlocked?:boolean;
   
  }