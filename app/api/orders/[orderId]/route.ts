export const dynamic = "force-dynamic";

import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	try {
		await connectToDB();

		const url = new URL(req.url);
		const orderId = url.pathname.split("/").pop();

		const orderDetails = await Order.findById(orderId).populate({
			path: "products.product",
			model: Product,
		});

		if (!orderDetails) {
			return new NextResponse("Order not found", { status: 404 });
		}

		const customer = await Customer.findOne({
			clerkId: orderDetails.customerClerkId,
		});

		return NextResponse.json({ orderDetails, customer }, { status: 200 });
	} catch (error) {
		console.log("[orderId_GET]", error);
		return new NextResponse("Internal Server Error ", { status: 500 });
	}
};
