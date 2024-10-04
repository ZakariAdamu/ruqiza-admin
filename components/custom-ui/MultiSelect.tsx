"use client";

import { useState } from "react";

import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

// Component for selecting the collection group of a product
interface MultiSelectProps {
	placeholder: string;
	collections: CollectionType[];
	value: string[];
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
	placeholder,
	collections,
	value,
	onChange,
	onRemove,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);

	// select a collection
	let selected: CollectionType[];

	if (value.length === 0) {
		selected = [];
	} else {
		selected = value.map((id) =>
			collections.find((collection) => collection._id === id)
		) as CollectionType[];
	}

	return (
		<Command className="overflow-visible bg-white">
			<div className="flex gap-1 flex-wrap border rounded-md">
				{selected.map((collection) => (
					<Badge key={collection._id}>
						{collection.title}
						<button
							className="ml-1 hover:text-red-1"
							onClick={() => onRemove(collection._id)}
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>
			<CommandInput
				placeholder={placeholder}
				value={inputValue}
				onValueChange={setInputValue}
				onBlur={() => setOpen(false)}
				onFocus={() => setOpen(true)}
			/>

			<div className="relative mt-2">
				{open && (
					<CommandList>
						<CommandGroup className="absolute w-full z-10 top-0 overflow-auto border rounded-md shadow-md">
							{collections.map((collection) => (
								<CommandItem
									key={collection._id}
									onMouseDown={(e) => e.preventDefault()}
									onSelect={() => {
										onChange(collection._id);
									}}
								>
									{collection.title}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				)}
			</div>
		</Command>
	);
};

export default MultiSelect;
