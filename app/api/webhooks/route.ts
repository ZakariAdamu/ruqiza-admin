import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
	typescript: true,
});

export const POST = async (req: NextRequest) => {
	try {
		const rawBody = await req.text();
		const signature = req.headers.get("Stripe-Signature") as string;

		const event = stripe.webhooks.constructEvent(
			rawBody,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			// console.log("webhooks_POST", session);

			const customerInfo = {
				clerkId: session?.client_reference_id,
				name: session?.customer_details?.name,
				email: session?.customer_details?.email,
			};

			const shippingAddress = {
				city: session?.shipping_details?.address?.city,
				country: session?.shipping_details?.address?.country,
				streetNumber: session?.shipping_details?.address?.line1,
				streetName: session?.shipping_details?.address?.line2,
				postalCode: session?.shipping_details?.address?.postal_code,
				state: session?.shipping_details?.address?.state,
			};

			const retrieveSession = await stripe.checkout.sessions.retrieve(
				session.id,
				{ expand: ["line_items.data.price.product"] }
			);

			const lineItems = await retrieveSession?.line_items?.data;

			const orderItems = lineItems?.map((item: any) => ({
				product: item.price.product.metadata.productId,
				color: item.price.product.metadata.color || "N/A",
				size: item.price.product.metadata.size || "N/A",
				quantity: item.quantity,
			}));

			await connectToDB();

			const newOrder = new Order({
				customerClerkId: customerInfo.clerkId,
				products: orderItems,
				shippingAddress,
				shippingRate: session?.shipping_cost?.shipping_rate,
				totalAmount: session.amount_total ? session.amount_total / 100 : 0,
			});

			await newOrder.save();

			let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

			if (customer) {
				customer.orders.push(newOrder._id);
			} else {
				customer = new Customer({
					...customerInfo,
					orders: [newOrder._id],
				});
			}
			await customer.save();
		}

		return new NextResponse("Order created", { status: 200 });
	} catch (error) {
		console.log("[webhooks_POST]", error);
		return new NextResponse("Failed to create the order", { status: 500 });
	}
};
