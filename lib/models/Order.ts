// import { create } from "domain";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	customerClerkId: String,
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			color: String,
			size: String,
			quantity: Number,
		},
	],
	shippingAddress: {
		city: String,
		country: String,
		streetNumber: String,
		streetName: String,
		postalCode: String,
		state: String,
	},
	shippingRate: String,
	totalAmount: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
