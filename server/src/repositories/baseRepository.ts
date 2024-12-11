
import { Model } from "mongoose";

export class BaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    const savedDocument = await document.save();
    return savedDocument.toObject() as T; 
}

  async findOne(filter: Partial<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: Partial<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }
}
