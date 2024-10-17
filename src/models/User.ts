import mongoose, { Document, Schema } from "mongoose";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  id: string;
  username: string;
  role: "SuperAdmin" | "Cashier";
  roleId: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, default: () => nanoid(10), required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ["SuperAdmin", "Cashier"], required: true },
    roleId: { type: String, default: () => nanoid(10), required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
