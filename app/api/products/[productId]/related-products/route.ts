export const dynamic = "force-dynamic";

import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export const GET = async (request: { params: { productId: string } }) => {
	const { params } = request;
	try {
		await connectToDB();

		const product = await Product.findById(params.productId);

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}

		const relatedProducts = await Product.find({
			// Find products with the same category or collections as the current product
			$or: [
				{ category: product.category },
				{ collections: { $in: product.collections } },
			],
			// Exclude the current product from the list of related products
			_id: { $ne: product._id },
		});

		if (!relatedProducts) {
			return new NextResponse(
				JSON.stringify({ message: "No related products found" }),
				{ status: 404 }
			);
		}

		return NextResponse.json(relatedProducts, { status: 200 });
	} catch (error) {
		console.log("[related-products_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
};
