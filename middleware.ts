/* this code will make our authentication routes private. Source: dashboard.clerk.com */
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
// 	matcher: [
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		"/(api|trpc)(.*)",
// 	],
// };

// middleware.ts

import {
	clerkMiddleware,
	createRouteMatcher,
	type MiddlewareAuthHandler,
} from "@clerk/nextjs/server";

// Define public (non-protected) routes
const isPublicRoute = createRouteMatcher([
	"/api/:path*",
	"/sign-in(.*)",
	"/sign-up(.*)",
]);

export default clerkMiddleware(
	(auth: MiddlewareAuthHandler, request: Request) => {
		// Protect route if it's not in the public list
		// if (!isPublicRoute(request)) {
		// 	auth().protect();
		// }
		// Do not protect any routes for now
		if (!isPublicRoute(request)) {
			auth();
		}
	}
);

// Middleware configuration
export const config = {
	matcher: [
		// Exclude Next.js internals and static assets
		"/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff2?|ttf|eot|pdf|docx?|xlsx?|zip|webmanifest|txt)).*)",
		// Always run for API or RPC routes
		"/(api|trpc)(.*)",
	],
};
