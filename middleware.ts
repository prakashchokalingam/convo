import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Configure Clerk to use our custom auth pages
  signInUrl: '/login',
  signUpUrl: '/signup',
  
  // Routes that don't require authentication
  publicRoutes: [
    "/",
    "/login",
    "/signup", 
    "/api/webhooks(.*)",
    "/forms-home",
    "/form(.*)",
    "/f/(.*)",  // Short form URLs
    "/pricing",
    "/features",
    "/docs",
    "/blog",
    "/help",
    "/about",
    "/contact",
    "/v2-sparrow-jot" // New landing page
  ],
  
  // Routes that should be ignored by Clerk
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)",
    "/api/webhooks(.*)"
  ],
  
  beforeAuth: (req) => {
    console.log("🚀 MIDDLEWARE RUNNING:", req.nextUrl.pathname, req.nextUrl.search);
    console.log("🚀 REQUEST URL:", req.url);
    console.log("🚀 IS API ROUTE:", req.nextUrl.pathname.startsWith('/api'));
    
    // Handle subdomain routing before auth
    const url = req.nextUrl.clone();
    const subdomain = url.searchParams.get("subdomain");
    
    console.log("🚀 SUBDOMAIN:", subdomain);
    console.log("🚀 HOSTNAME:", req.nextUrl.hostname);
    console.log("🚀 FULL URL:", req.nextUrl.toString());
    
    // For API routes, don't do subdomain processing
    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log("🧩 API ROUTE - SKIPPING SUBDOMAIN PROCESSING");
      return NextResponse.next();
    }
    
    // Determine context and set header for server components
    let context = 'marketing'; // default
    
    // Check if this is a workspace route (app context)
    const isWorkspaceRoute = /^\/[a-z0-9-]+(\/|$)/.test(req.nextUrl.pathname) && 
                            !req.nextUrl.pathname.startsWith('/login') && 
                            !req.nextUrl.pathname.startsWith('/signup') && 
                            !req.nextUrl.pathname.startsWith('/onboarding') &&
                            !req.nextUrl.pathname.startsWith('/v2-sparrow-jot') &&
                            req.nextUrl.pathname !== '/';
    
    if (process.env.NODE_ENV === 'development') {
      if (subdomain === 'app' || isWorkspaceRoute) context = 'app';
      else if (subdomain === 'forms') context = 'forms';
    } else {
      const hostname = req.nextUrl.hostname;
      if (hostname.startsWith('app.') || isWorkspaceRoute) context = 'app';
      else if (hostname.startsWith('forms.')) context = 'forms';
    }
    
    // Set context header for server-side detection
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-subdomain-context', context);
    console.log("🚀 SETTING CONTEXT HEADER:", context);
    
    // Handle auth pages without subdomain context - redirect to app context
    if (!subdomain && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
      const redirectUrl = new URL(req.nextUrl.pathname + "?subdomain=app", req.url);
      console.log("🔐 REDIRECTING AUTH PAGE TO APP CONTEXT:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }
    
    // Handle root path based on subdomain
    if (req.nextUrl.pathname === "/") {
      if (subdomain === "app") {
        // Rewrite to dashboard for app subdomain
        url.pathname = "/dashboard";
        console.log("📱 REWRITING TO APP DASHBOARD:", url.pathname);
        return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
      } else if (subdomain === "forms") {
        // Rewrite to forms home for forms subdomain
        url.pathname = "/forms-home";
        console.log("📝 REWRITING TO FORMS HOME:", url.pathname);
        return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
      }
    }
    
    console.log("🚀 NO REWRITE, CONTINUING TO AUTH");
    
    // If no rewrite/redirect happened, pass headers through
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  },
  
  async afterAuth(auth, req, evt) {
    console.log("🔐 AFTER AUTH - PATH:", req.nextUrl.pathname, "USER ID:", auth.userId ? "✅" : "❌");
    
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      console.log("🚀 REDIRECTING UNAUTHENTICATED USER TO LOGIN");
      const url = req.nextUrl.clone();
      const subdomain = url.searchParams.get("subdomain");
      return NextResponse.redirect(new URL('/login?subdomain=app', req.url));
    }
    
    // For API routes, just continue if authenticated
    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log("🧩 API ROUTE - CONTINUING");
      return NextResponse.next();
    }
    
    // Handle authenticated users
    if (auth.userId) {
      const url = req.nextUrl.clone();
      const subdomain = url.searchParams.get("subdomain");
      
      // If user is accessing root app path, redirect to onboarding
      // Only if they're on the exact root path, not workspace routes
      if (subdomain === "app" && req.nextUrl.pathname === "/" && !url.searchParams.has('from-middleware')) {
        console.log("📝 REDIRECTING TO ONBOARDING FOR WORKSPACE DETECTION");
        const onboardingUrl = new URL('/onboarding?subdomain=app&from-middleware=true', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }
    
    console.log("🚀 AFTER AUTH - CONTINUING TO PAGE");
    // If the user is signed in and trying to access a protected route, allow them through
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};