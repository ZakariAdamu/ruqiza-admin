"use client";

import { useState } from "react";

import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

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

	return (
		<Command className="overflow-visible bg-white">
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
