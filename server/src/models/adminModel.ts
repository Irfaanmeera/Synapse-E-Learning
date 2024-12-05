import mongoose, { Document, Model } from "mongoose";
import { IAdmin } from "../interfaces/entityInterface/IAdmin";
import bcrypt from "bcryptjs"; 

interface AdminModel extends Model<AdminDoc> {
  build(attrs: IAdmin): AdminDoc;
}

interface AdminDoc extends Document {
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; 
        delete ret.__v;
      },
    },
  }
);


adminSchema.pre("save", async function (next) {
  const admin = this as AdminDoc;

  if (admin.isModified("password")) {
    const salt = await bcrypt.genSalt(10); 
    admin.password = await bcrypt.hash(admin.password, salt); 
  }

  next();
});

adminSchema.statics.build = (admin: IAdmin) => {
  return new Admin(admin);
};

const Admin = mongoose.model<AdminDoc, AdminModel>("admin", adminSchema);


const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
   
      const newAdmin = Admin.build({
        email: "irfaanmeera@gmail.com",
        password: "admin123", 
      });
      await newAdmin.save();
      console.log("Admin created successfully");
    } 
  } catch (error) {
    console.error("Error checking/creating admin:", error);
  }
};

createAdmin();

export { Admin };
