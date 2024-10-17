import { connectToDatabase } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { products } = await req.json();
    let totalAllProductPrice = 0;
    const newProducts = [];

    for (const item of products) {
      // Mahsulotni ID orqali topamiz
      const product = await Product.findById(item.productId);

      // Agar mahsulot topilmasa, xato qaytaramiz
      if (!product) {
        return NextResponse.json(
          {
            error:
              "Mahsulot mavjud emas! Faqatgina mavjud mahsulotlarning narxi va miqdorini o'zgartirishingiz mumkin.",
          },
          { status: 400 }
        );
      }

      // Mahsulot narxi va miqdori asosida narxni hisoblash
      const price = product.price;
      const productTotal = price * item.quantity;

      // Umumiy narxga qo'shamiz
      totalAllProductPrice += productTotal;

      // Buyurtmadagi mahsulotlarni yangilaymiz
      newProducts.push({
        name: product.name,
        productId: product._id,
        quantity: item.quantity,
        price: price,
        totalProductPrice: price * item.quantity, // Olingan narxni hisoblash
      });
      product.quantity -= item.quantity; // Olingan miqdorni chiqaramiz
      await product.save(); // Yangilangan mahsulotni saqlaymiz
    }

    // Yangi buyurtmani yaratamiz
    const newOrder = await Order.create({
      products: newProducts,
      totalAllProductPrice,
    });

    return NextResponse.json(
      { message: "Buyurtma muvaffaqiyatli yaratildi", data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
