/* Configure your authentication setup >> Source: dashboard.clerk.com */

// ****** middleware.ts ****** //

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// **** Define public (non-protected) routes ****** //
const isPublicRoute = createRouteMatcher([
	"/api/:path*",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/",
	"/collections",
	"/products",
	"/orders",
]);

export default clerkMiddleware((auth, request) => {
	// Protect route if it's not in the public list
	if (!isPublicRoute(request)) {
		auth().protect();
	}
});
// ***** Middleware configuration ****** //
export const config = {
	matcher: [
		// ****** Exclude Next.js internals and static assets ****** //
		"/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff2?|ttf|eot|pdf|docx?|xlsx?|zip|webmanifest|txt)).*)",
		// **** Always run for API or RPC routes ****** //
		"/(api|trpc)(.*)",
	],
};
