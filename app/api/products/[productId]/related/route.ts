import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const { searchParams } = new URL(req.url);
	const productId = searchParams.get("productId");
	try {
		await connectToDB();

		const product = await Product.findById(productId);

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
		console.log("[related_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
};

export const dynamic = "force-dynamic";
