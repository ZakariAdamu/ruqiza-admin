"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
	const pathName = usePathname();
	return (
		<div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-[#d9d9d9] shadow-xl max-lg:hidden">
			<Link href="/" className="">
				<Image src="/logo.png" alt="logo" width={150} height={150} />
			</Link>

			<div className="flex flex-col gap-12">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-4 text-body-medium ${
							pathName === link.url ? "text-blue-1" : ""
						}`}
						prefetch={link.prefetch}
					>
						{link.icon}
						<p>{link.label}</p>
					</Link>
				))}
			</div>

			<div className="flex gap-4 text-body-medium items-center">
				<UserButton />
				<p>User Profile</p>
			</div>
		</div>
	);
};

export default LeftSideBar;
