import { Module } from "./module";
import { User } from "./User";

type Category = {
  category?: string;
  id?: string;
  status?: string;
};

type Level = {
  level?: string;
  id?: string;
  status?: string;
};
export interface Course {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  level?: string | Level;
  category?: string | Category;
  approval?: string;
  instructor?: string | User;
  status?: boolean;
  enrolled?:number;
  modules?: { module: string | Module; order: number }[];
}