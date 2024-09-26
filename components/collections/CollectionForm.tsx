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
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom-ui/Delete";

// Using this CollectionForm component, we can POST to create a new collection or update an existing collection(initialData)
const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(500).trim(),
	image: z.string(),
});

interface CollectionFormProps {
	initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	// Define your form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? initialData
			: {
					title: "",
					description: "",
					image: "",
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
				? `/api/collections/${initialData._id}`
				: "/api/collections";
			const res = await fetch(url, {
				method: "POST",
				body: JSON.stringify(values),
			});
			if (res.ok) {
				setLoading(false);
				toast.success(`Collection ${initialData ? "updated" : "created"} `);
				// Refresh the page after creating or updating a collection
				window.location.href = "/collections";
				router.push("/collections");
			}
		} catch (err) {
			console.log("[collections_POST]", err);
			toast.error("Something went wrong! Please try again.");
		}
	};
	return (
		<div className="p-10">
			{initialData ? (
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Edit Collection</p>
					<Delete id={initialData._id} />
				</div>
			) : (
				<p className="text-heading2-bold">Create Collection</p>
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
								<FormMessage />
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
										placeholder="Description"
										{...field}
										rows={5}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-10">
						<Button type="submit" className="bg-blue-1 text-white">
							Submit
						</Button>
						<Button
							type="button"
							className="bg-blue-1 text-white"
							onClick={() => router.push("/collections")}
						>
							Discard
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CollectionForm;
