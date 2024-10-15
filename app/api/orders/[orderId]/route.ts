export const dynamic = "force-dynamic";

import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export const GET = async ({ params }: { params: { orderId: string } }) => {
	try {
		await connectToDB();

		const orderDetails = await Order.findById(params.orderId).populate({
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
