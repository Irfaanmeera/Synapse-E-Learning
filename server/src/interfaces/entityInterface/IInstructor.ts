export interface Transaction {
    date: Date;
    amount: number;
    description: string;
}

export interface IInstructor {
    id?: string
    name: string;
    password?: string;
    email?: string;
    mobile?: number;
    image?:string;
    qualification?: string;
    description?:string;
    isBlocked?: boolean;
    isVerified?: boolean;
    wallet?: number;
    walletHistory?: Transaction[]
    courses?: string[]
}