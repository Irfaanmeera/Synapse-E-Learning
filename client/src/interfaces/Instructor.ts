export interface Instructor {
    id?: string
    name?: string
    email?: string
    mobile?: number;
    image?:string;
    qualification?: string;
    description?:string;
    isBlocked?: boolean;
    isVerified?: boolean;
    wallet?: number;
    courses?: string[]
}