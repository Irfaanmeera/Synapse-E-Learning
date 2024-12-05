import { IAdmin } from "../entityInterface/IAdmin";

export interface IAdminRepository{
    findAdminByEmail (email:string):Promise<IAdmin |null>
}