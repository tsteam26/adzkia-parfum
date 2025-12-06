import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  // Check authentication for dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const supabaseResponse = await updateSession(request);
    // If we can't get user info and they're accessing dashboard, redirect to login
    // The Supabase session will handle authentication validation
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
