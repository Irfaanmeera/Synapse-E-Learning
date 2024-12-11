/* eslint-disable react/no-is-mounted */
import { Instructor } from "../models/instructorModel";
import { IInstructor } from "../interfaces/entityInterface/IInstructor";
import { IInstructorRepository } from "../interfaces/repositoryInterfaces/IInstructorRepository";
import { BaseRepository } from "./baseRepository";
import { BadRequestError } from "../constants/errors/badrequestError";

export class InstructorRepository
  extends BaseRepository<IInstructor>
  implements IInstructorRepository
{
  constructor() {
    super(Instructor);
  }

  async createInstructor(instructorData: IInstructor): Promise<IInstructor> {
    return await this.create(instructorData);
  }

  async findInstructorById(instructorId: string): Promise<IInstructor | null> {
    return await this.findById(instructorId);
  }

  async findInstructorByEmail(email: string): Promise<IInstructor | null> {
    return await this.findOne({ email });
  }

  async updateInstructorVerification(email: string): Promise<IInstructor> {
    const instructor = await this.findInstructorByEmail(email);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ isVerified: true });
    return await instructor.save();
  }

  async updateInstructor(instructorData: IInstructor): Promise<IInstructor> {
    const { id, name, mobile, qualification, description } = instructorData;
    const instructor = await this.findById(id);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ name, mobile, qualification, description });
    return await instructor.save();
  }

  async updateInstructorImage(
    instructorId: string,
    image: string
  ): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Invalid Id");
    }
    instructor.set({ image });
    return await instructor.save();
  }

  async updatePassword(
    instructorId: string,
    password: string
  ): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Id not valid");
    }
    instructor.set({ password });
    return await instructor.save();
  }

  async addToWallet(
    instructorId: string,
    amount: number
  ): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ wallet: (instructor.wallet ?? 0) + amount });
    return await instructor.save();
  }

  async addWalletHistory(
    instructorId: string,
    amount: number,
    description: string
  ): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    const walletDetails = { amount, description, date: new Date() };
    instructor.walletHistory?.push(walletDetails);
    return await instructor.save();
  }

  async getAllInstructors(): Promise<IInstructor[]> {
    return await this.findAll();
  }

  async blockInstructor(instructorId: string): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ isBlocked: true });
    return await instructor.save();
  }

  async unblockInstructor(instructorId: string): Promise<IInstructor> {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ isBlocked: false });
    return await instructor.save();
  }

  async getInstructorCount(): Promise<number> {
    return await this.count();
  }
}










// import { Instructor } from "../models/instructorModel";
// import { IInstructor } from "../interfaces/entityInterface/IInstructor";
// import { IInstructorRepository } from "../interfaces/repositoryInterfaces/IInstructorRepository";
// import { BadRequestError } from "../constants/errors/badrequestError";

// export class InstructorRepository implements IInstructorRepository {

//   async createInstructor(instructorData: IInstructor): Promise<IInstructor> {
//     const instructor = Instructor.build(instructorData)
//     return await instructor.save();
//   }

//   async findInstructorById(instructorId: string): Promise<IInstructor | null> {
//     return await Instructor.findById(instructorId)
//   }
//   async findInstructorByEmail(email: string): Promise<IInstructor | null> {
//     return await Instructor.findOne({ email })
//   }
//   async updateInstructorVerification(email: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ email })
//     instructor!.set({ isVerified: true })
//     return await instructor!.save()
//   }
//   async updateInstructor(instructorData: IInstructor): Promise<IInstructor> {
//     const { id, name, mobile, qualification, description } = instructorData;
//     const instructor = await Instructor.findById(id)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     instructor.set({
//       name,
//       mobile,
//       qualification,
//       description
//     })
//     return await instructor.save()
//   }

//   async updateInstructorImage(instructorId: string, image: string): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Invalid Id')
//     }
//     instructor.set({
//       image,
//     })
//     return await instructor.save()
//   }
//   async updatePassword(
//     instructorId: string,
//     password: string
//   ): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId);
//     if (!instructor) {
//       throw new BadRequestError("Id not valid");
//     }
//     instructor.set({
//       password,
//     });
//     return await instructor.save();
//   }
//   async addToWallet(instructorId: string, amount: number): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     instructor.set({ wallet: (instructor.wallet ?? 0) + amount })
//     return await instructor.save()
//   }

//   async addWalletHistory(instructorId: string, amount: number, description: string): Promise<IInstructor> {
//     const instructor = await Instructor.findById(instructorId)
//     if (!instructor) {
//       throw new BadRequestError('Instructor not found')
//     }
//     const walletDetails = {
//       amount,
//       description,
//       date: new Date(),
//     }
//     instructor.walletHistory?.push(walletDetails)
//     return await instructor.save()
//   }

//   async getAllInstructors(): Promise<IInstructor[] | null> {
//     return await Instructor.find();
//   }

//   async blockInstructor(instructorId: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ _id: instructorId });
//     instructor!.set({ isBlocked: true });
//     return await instructor!.save();
//   }

//   async unblockInstructor(instructorId: string): Promise<IInstructor> {
//     const instructor = await Instructor.findOne({ _id: instructorId });
//     instructor!.set({ isBlocked: false });
//     return await instructor!.save();
//   }

//   async getInstructorCount(): Promise<number> {
//     return await Instructor.countDocuments();
//   }
// }
