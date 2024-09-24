import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import Collection from "@/lib/models/Collection";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { collectionId: string } }
) => {
	try {
        const { userId } = auth();
        
        if (!userId) {
            return new NextResponse('Unauthorized, only signed in admin can delete a collection.', {status: 401})
        }

        await connectToDB()

        await Collection.findByIdAndDelete(params.collectionId)
        return new NextResponse('Collection deleted!', {status: 200})
	} catch (err) {
		console.log("[collection_DELETE]", err);
		return new NextResponse("Internal error", { status: 500 });
	}
};
