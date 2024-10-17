import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./Product";

export interface IOrder extends Document {
  products: {
    productId: IProduct["_id"];
    name: string;
    quantity: number;
    price: number;
    totalProductPrice: number;
  }[];
  productId: IProduct["_id"];
  quantity: number;
  totalAllProductPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalProductPrice: { type: Number, required: true },
      },
    ],
    totalAllProductPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
