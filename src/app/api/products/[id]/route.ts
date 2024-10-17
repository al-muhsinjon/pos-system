import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = route.params;
    const products = await Product.findById(id);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function PUT(req: Request, route: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { name, quantity, price } = await req.json();
    const { id } = route.params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.name = name || product.name;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;

    await product.save();

    return NextResponse.json(
      { message: "Product updated successfully!", product },
      { status: 200 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = route.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully!", product },
      { status: 203 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
