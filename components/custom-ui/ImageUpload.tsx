import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface ImageUploadProps {
	value: string[];
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
}
// Image upload button component
const ImageUpload: React.FC<ImageUploadProps> = ({
	onChange,
	onRemove,
	value,
}) => {
	const onUpload = (result: any) => {
		onChange(result.info.secure_url);
	};
	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-4">
				{value.map((url) => (
					<Image
						className="object-cover rounded-lg"
						src={url}
						alt="collections image"
						width={200}
						height={200}
					/>
				))}
			</div>
			<CldUploadWidget uploadPreset="Zakariuploadcld1" onSuccess={onUpload}>
				{({ open }) => {
					return (
						<Button onClick={() => open()} className="bg-blue-600 text-white">
							<Plus className="h-4 w-4 mr-2" />
							Upload Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
