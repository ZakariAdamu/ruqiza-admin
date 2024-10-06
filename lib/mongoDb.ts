import mongoose from "mongoose";

// Track mongoose connection state via `mongoose.connection.readyState`
export const connectToDB = async (): Promise<void> => {
	try {
		// Use mongoose's internal state to check connection status
		if (mongoose.connection.readyState === 1) {
			console.log("MongoDB is already connected");
			return;
		}

		// Ensure the MongoDB connection URL is available
		const mongoURI = process.env.MONGODB_URL; 
		if (!mongoURI) {
			throw new Error(
				"MongoDB connection URL is not defined in environment variables"
			);
		}

		// Set strict query behavior
		mongoose.set("strictQuery", true);

		// Attempt to connect
		await mongoose.connect(mongoURI, {
			dbName: "Ruqiza_admin",
		});

		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("Error connecting to MongoDB:", err);
		throw new Error("MongoDB connection failed"); // Ensure errors are surfaced properly
	}
};
