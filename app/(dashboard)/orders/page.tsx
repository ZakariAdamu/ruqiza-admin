"use client";
export const dynamic = "force-dynamic";

import { DataTable } from "@/components/custom-ui/DataTable";
import Loader from "@/components/custom-ui/Loader";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const Orders = () => {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		try {
			const res = await fetch("/api/orders");
			const data = await res.json();
			setOrders(data);
			setLoading(false);
		} catch (err) {
			console.log("[orders_GET]", err);
		}
	};

	useEffect(() => {
		getOrders();
	}, []);

	return loading ? (
		<Loader />
	) : (
		<div className="px-10 py-5">
			<p className="text-heading2-bold">Orders</p>
			<Separator />
			<DataTable columns={columns} data={orders} searchKey="_id" />
		</div>
	);
};

export default Orders;
