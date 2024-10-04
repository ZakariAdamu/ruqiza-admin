"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom-ui/ImageUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom-ui/Delete";
import MultiText from "../custom-ui/MultiText";
import MultiSelect from "../custom-ui/MultiSelect";

// Using this CollectionForm component, we can POST to create a new collection or update an existing collection(initialData)
const formSchema = z.object({
	title: z.string().min(2).max(500),
	description: z.string().min(2).max(50000).trim(),
	media: z.array(z.string()),
	category: z.string(),
	collections: z.array(z.string()),
	tags: z.array(z.string()),
	sizes: z.array(z.string()),
	colors: z.array(z.string()),
	price: z.coerce.number().min(0.1),
	expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
	initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [collections, setCollections] = useState<CollectionType[]>([]);

	const getCollections = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/collections", {
				method: "GET",
			});
			const data = await res.json();
			setCollections(data);
			setLoading(false);
		} catch (err) {
			console.log("[collections_GET]", err);
			toast.error(
				"Cannot get collections! Please check the error and try again."
			);
		}
	};

	useEffect(() => {
		getCollections();
	}, []);

	// Define your form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					collections: initialData.collections.map(
						(collection) => collection._id
					),
			  }
			: {
					title: "",
					description: "",
					media: [],
					category: "",
					collections: [],
					tags: [],
					sizes: [],
					colors: [],
					price: 0.1,
					expense: 0.1,
			  },
	});

	// Prevent the enter-key from moving between the form input fields

	const handleKeyPress = (
		e:
			| React.KeyboardEvent<HTMLInputElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	// Define a submit handler.
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		try {
			setLoading(true);
			const url = initialData
				? `/api/products/${initialData._id}`
				: "/api/products";
			const res = await fetch(url, {
				method: "POST",
				body: JSON.stringify(values),
			});
			if (res.ok) {
				setLoading(false);
				toast.success(`Product ${initialData ? "updated" : "created"} `);
				// Refresh the page after creating or updating a product
				window.location.href = "/products";
				router.push("/products");
			}
		} catch (err) {
			console.log("[products_POST]", err);
			toast.error("Something went wrong! Please try again.");
		}
	};
	return (
		<div className="p-10">
			{initialData ? (
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Edit Product</p>
					<Delete id={initialData._id} />
				</div>
			) : (
				<p className="text-heading2-bold">Create Product</p>
			)}
			<Separator className=" bg-grey-1 mt-4 mb-7" />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										placeholder="Title"
										{...field}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Product description"
										{...field}
										rows={5}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="media"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value}
										onChange={(url) => field.onChange([...field.value, url])}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((image) => image !== url),
											])
										}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<div className="md:grid md:grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price ($)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Price"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="expense"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expense ($)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Expense"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input
											placeholder="Category"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Add tags"
											value={field.value}
											onChange={(tag) => field.onChange([...field.value, tag])}
											onRemove={(tagToRemove) =>
												field.onChange([
													...field.value.filter((tag) => tag !== tagToRemove),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="collections"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Collections</FormLabel>
									<FormControl>
										<MultiSelect
											placeholder="Collections"
											collections={collections}
											value={field.value}
											onChange={(_id) => field.onChange([...field.value, _id])}
											onRemove={(idToRemove) =>
												field.onChange([
													...field.value.filter(
														(collectionId) => collectionId !== idToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="colors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colors</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Add colors"
											value={field.value}
											onChange={(color) =>
												field.onChange([...field.value, color])
											}
											onRemove={(colorToRemove) =>
												field.onChange([
													...field.value.filter(
														(color) => color !== colorToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sizes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sizes</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Add sizes"
											value={field.value}
											onChange={(size) =>
												field.onChange([...field.value, size])
											}
											onRemove={(sizeToRemove) =>
												field.onChange([
													...field.value.filter(
														(size) => size !== sizeToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex gap-10">
						<Button type="submit" className="bg-blue-1 text-white">
							Submit
						</Button>
						<Button
							type="button"
							className="bg-blue-1 text-white"
							onClick={() => router.push("/products")}
						>
							Discard
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ProductForm;
