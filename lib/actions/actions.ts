import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB";

export const getTotalSales = async () => {
	await connectToDB();
	const orders = await Order.find();
	const totalOrders = orders.length;
	const totalRevenue = orders.reduce(
		(acc, order) => acc + order.totalAmount,
		0
	);
	return { totalOrders, totalRevenue };
};

export const getTotalCustomers = async () => {
	await connectToDB();
	const customers = await Customer.find();
	const totalCustomers = customers.length;
	return totalCustomers;
};

export const getSalesPerMonth = async () => {
	await connectToDB();
	const orders = await Order.find();

	const salesPerMonth = orders.reduce((acc, order) => {
		// month index is an array, 0 for January, 1 for February, etc.
		const monthIndex = new Date(order.createdAt).getMonth();
		// acc means accumulator, it is an object that stores the total amount of sales for each month
		acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
		// return the accumulator object
		return acc;
	}, {});

	const graphData = Array.from({ length: 12 }, (_, i) => {
		const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
			new Date(0, i)
		);
		// salesPerMonth[i] is the total sales for the ith month
		// if there are no sales for that month, it will return 0
		return { name: month, sales: salesPerMonth[i] || 0 };
	});
	return graphData;
};
