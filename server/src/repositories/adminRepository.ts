import { Admin} from "../models/adminModel";
import { IAdmin } from "../interfaces/entityInterface/IAdmin";
import { IAdminRepository } from "../interfaces/repositoryInterfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository{
  async findAdminByEmail(email:string) : Promise<IAdmin |null>{
   const admin= await Admin.findOne({email})
   return admin;
   }
}

