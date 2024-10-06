import { auth } from "@clerk/nextjs/server";
import Collection from "@/lib/models/Collection";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";

const handleErrorResponse = (message: string, status: number) => {
	return new NextResponse(message, { status });
};

export const POST = async (req: NextRequest) => {
	try {
		const { userId } = auth();
		if (!userId) {
			return handleErrorResponse("Unauthorized, please sign up", 403);
		}

		await connectToDB();

		const { title, description, image } = await req.json();

		// Validate input
		if (!title || !image) {
			return handleErrorResponse("Title and image are required", 400);
		}

		const existingCollection = await Collection.findOne({ title });
		if (existingCollection) {
			return handleErrorResponse(
				"Collection already exists. Create a new collection.",
				400
			);
		}

		const newCollection = new Collection({ title, description, image });
		await newCollection.save();

		return NextResponse.json(newCollection, { status: 201 }); // Using 201 for resource creation
	} catch (err) {
		console.error("[collections_POST]", err);
		return handleErrorResponse("Internal Server Error", 500);
	}
};

export const GET = async () => {
	try {
		await connectToDB();
		const collections = await Collection.find().sort({ createdAt: "desc" });
		return NextResponse.json(collections, { status: 200 });
	} catch (err) {
		console.error("[collections_GET]", err);
		return handleErrorResponse("Internal Server Error", 500);
	}
};

export const dynamic = "force-dynamic";
