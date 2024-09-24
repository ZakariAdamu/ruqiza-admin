import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
	mongoose.set("strictQuery", true);

	if (isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL || "", {
			dbName: "Ruqiza_admin",
		});

		isConnected = true;
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}
};
