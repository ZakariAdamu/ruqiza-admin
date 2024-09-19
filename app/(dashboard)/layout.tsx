import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";
import "../globals.css";
import LeftSideBar from "@/components/layout/LeftSideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Dashboard to manage Ruqiza's data",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<div className="flex max-lg:flex-col text-grey-1">
						<LeftSideBar />
						<div className="flex-1">{children}</div>
					</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
