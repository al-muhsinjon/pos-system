import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, quantity, price } = await req.json();

    const productExsists = await Product.findOne({ name });
    if (productExsists) {
      return NextResponse.json(
        {
          error:
            "Product already exists. Mahsulot mavjud! Buning faqatgina narxi va miqdorini o'zgaritishingiz mumkin.",
        },
        { status: 400 }
      );
    }
    await Product.create({ name, quantity, price });
    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectToDatabase();
  const { name, quantity, price } = await req.json();
  const product = await Product.findOne({ name });
  if (!product) {
    return NextResponse.json(
      {
        error:
          "Product does not exist. Mahsulot mavjud! Buning faqatgina narxi va miqdorini o'zgaritishingiz mumkin.",
      },
      { status: 400 }
    );
  }
  product.quantity = quantity;
  product.price = price;
  await product.save();
  return NextResponse.json(
    { message: "Product updated successfully" },
    { status: 200 }
  );
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
