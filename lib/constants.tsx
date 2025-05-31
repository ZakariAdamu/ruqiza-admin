import {
	LayoutDashboard,
	Shapes,
	ShoppingBag,
	Tag,
	UsersRound,
} from "lucide-react";

export const navLinks = [
	{
		url: "/",
		icon: <LayoutDashboard />,
		label: "Dashboard",
		prefetch: true,
	},
	{
		url: "/collections",
		icon: <Shapes />,
		label: "Collections",
		prefetch: true,
	},
	{
		url: "/products",
		icon: <Tag />,
		label: "Products",
		prefetch: true,
	},
	{
		url: "/orders",
		icon: <ShoppingBag />,
		label: "Orders",
		prefetch: true,
	},
	{
		url: "/customers",
		icon: <UsersRound />,
		label: "Customers",
		prefetch: true,
	},
];
