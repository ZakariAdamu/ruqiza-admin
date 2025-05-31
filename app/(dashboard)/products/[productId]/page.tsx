"use client";
import Loader from "@/components/custom-ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import  { useEffect, useState } from "react";
// Make sure ProductForm always returns a valid JSX element or null

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
	return loading ? <Loader /> : (productDetails ? <ProductForm initialData={productDetails} /> : null);
};

export default ProductDetails;
