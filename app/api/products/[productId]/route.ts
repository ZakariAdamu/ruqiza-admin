
export const dynamic = "force-dynamic";

import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
// import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// A unique productId route.ts file for individual product endpoint

export const GET = async (
	req: NextRequest,
	{ params }: { params: { productId: string } }
) => {
	try {
		await connectToDB();

		const product = await Product.findById(params.productId).populate({
			path: "collections",
			model: Collection,
		});

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}
		return new NextResponse(JSON.stringify(product), {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (err) {
		console.log("[productId_GET]", err);
		return new NextResponse("Internal error, {status: 500}");
	}
};

// Update collection(s) in product

export const POST = async (
	req: NextRequest,
	{
		params,
	}: {
		params: { productId: string };
	}
) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized, please sign in", { status: 401 });
		}

		await connectToDB();

		const product = await Product.findById(params.productId);

		// check if there is no existing product to update
		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not fiund" }),
				{ status: 404 }
			);
		}

		// if there is none, then create a new product
		const {
			title,
			description,
			media,
			category,
			collections,
			tags,
			sizes,
			colors,
			price,
			expense,
		} = await req.json();

		// validate required fields
		if (!title || !description || !media || !category || !price || !expense) {
			return new NextResponse("Not enough data to create a new product", {
				status: 400,
			});
		}

		// add new collections to the product. PS: a product can belong to multiple collection groups, hence, existing collections to the product should not appear for selection anymore, i.e they should be excluded
		// in other words: "included in the new data, but not included in the previous data"
		const addedCollections = collections.filter(
			(collectionId: string) => !product.collections.includes(collectionId)
		);

		// included in previous data, but not included in the new data
		const removedCollections = product.collections.filter(
			(collectionId: string) => !collections.includes(collectionId)
		);

		// Update collections
		await Promise.all([
			// Update added collections with this product
			...addedCollections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$push: { products: product._id },
				})
			),

			// Update removed collections without this product
			...removedCollections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$pull: { products: product._id },
				})
			),
		]);

		// Update product
		const updatedProduct = await Product.findByIdAndUpdate(
			product._id,
			{
				title,
				description,
				media,
				category,
				collections,
				tags,
				sizes,
				colors,
				price,
				expense,
			},
			{ new: true }
		).populate({ path: "collections", model: Collection });

		await updatedProduct.save();

		return NextResponse.json(updatedProduct, { status: 200 });
	} catch (error) {
		console.log("[productId_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
};

// Delete a product
export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { productId: string } }
) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		await connectToDB();

		const product = await Product.findById(params.productId);

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}

		await Product.findByIdAndDelete(product._id);

		// Update collections after a product was deleted
		await Promise.all(
			product.collections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$pull: { products: product._id },
				})
			)
		);

		return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
			status: 200,
		});
	} catch (error) {
		console.log("[productId_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
};

