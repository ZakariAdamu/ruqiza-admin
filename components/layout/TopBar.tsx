"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
	const [dropdownMenu, setDropdownMenu] = useState(false);
	const pathName = usePathname();
	return (
		<div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-[#d9d9d9] shadow-sm lg:hidden">
			<Link href="/" className="">
				<Image src="/logo.png" alt="logo" width={150} height={150} />
			</Link>

			<div className="flex gap-8 max-md:hidden">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-4 text-body-medium ${
							pathName === link.url ? "text-blue-1" : ""
						}`}
					>
						{link.icon}
						<p>{link.label}</p>
					</Link>
				))}
			</div>

			<div className="relative flex gap-4 items-center">
				<Menu
					className="cursor-pointer md:hidden"
					onClick={() => setDropdownMenu(!dropdownMenu)}
				/>
				{dropdownMenu && (
					<div className="absolute top-10 right-6 flex flex-col gap-6 p-5 bg-white shadow-xl rounded-lg  ">
						{navLinks.map((link) => (
							<Link
								href={link.url}
								key={link.label}
								className="flex gap-4 text-body-medium"
								onClick={() => setDropdownMenu(!dropdownMenu)}
							>
								{link.icon}
								<p>{link.label}</p>
							</Link>
						))}
					</div>
				)}
				<UserButton />
			</div>
		</div>
	);
};

export default TopBar;
