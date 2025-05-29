"use client";
<<<<<<< HEAD
export const dynamic = "force-dynamic";

import Loader from "@/components/custom-ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import React, { useEffect, useState } from "react";
=======
import Loader from "@/components/custom-ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import  { useEffect, useState } from "react";
>>>>>>> 65afa80 (remote authentication momentarily to save testers some testing time)

const ProductDetails = ({ params }: { params: { productId: string } }) => {
	const [loading, setLoading] = useState(true);
	const [productDetails, setProductDetails] = useState<ProductType | null>(
		null
	);

	const getProductDetails = async () => {
		try {
			const res = await fetch(`/api/products/${params.productId}`, {
				method: "GET",
			});
			const data = await res.json();
			setProductDetails(data);
			setLoading(false);
		} catch (err) {
			console.log("[productId_GET]", err);
		}
	};

	useEffect(() => {
		getProductDetails();
	}, []);
	return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;
