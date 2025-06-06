import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    "/",
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
    "/contact"
  ],
  
  // Routes that should be ignored by Clerk
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)",
    "/api/webhooks(.*)"
  ],
  
  beforeAuth: (req) => {
    console.log("🚀 MIDDLEWARE RUNNING:", req.nextUrl.pathname, req.nextUrl.search);
    
    // Handle subdomain routing before auth
    const url = req.nextUrl.clone();
    const subdomain = url.searchParams.get("subdomain");
    
    console.log("🚀 SUBDOMAIN:", subdomain);
    
    // SUBDOMAIN-BASED ROUTE RESTRICTIONS
    if (subdomain === "forms") {
      // Forms subdomain should only access end-user routes
      const formsAllowedPaths = [
        "/",           // Will redirect to forms-home
        "/forms-home", // Forms portal
        "/f/",         // Form viewing routes
        "/form/",      // Form filling routes
        "/api/forms/submit", // Form submission
        "/api/forms/validate" // Form validation
      ];
      
      const isFormsRoute = formsAllowedPaths.some(path => 
        req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path)
      );
      
      if (!isFormsRoute) {
        console.log("❌ BLOCKING:", req.nextUrl.pathname, "on forms subdomain");
        return NextResponse.redirect(new URL('/?subdomain=forms', req.url));
      }
    }
    
    if (subdomain === "app") {
      // App subdomain should only access app routes
      const appAllowedPaths = [
        "/",            // Will redirect to dashboard
        "/dashboard",
        "/forms",
        "/analytics",
        "/settings",
        "/sign-in",
        "/sign-up",
        "/api/forms/generate",
        "/api/forms/save",
        "/api/user"
      ];
      
      const isAppRoute = appAllowedPaths.some(path => 
        req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path)
      );
      
      if (!isAppRoute) {
        console.log("❌ BLOCKING:", req.nextUrl.pathname, "on app subdomain");
        return NextResponse.redirect(new URL('/?subdomain=app', req.url));
      }
    }
    
    // Handle /form route specifically
    if (req.nextUrl.pathname === "/form") {
      url.pathname = "/forms-home";
      console.log("📝 REWRITING /form TO:", url.pathname);
      return NextResponse.rewrite(url);
    }
    
    // Handle root path based on subdomain
    if (req.nextUrl.pathname === "/") {
      if (subdomain === "app") {
        // Rewrite to dashboard for app subdomain
        url.pathname = "/dashboard";
        console.log("📱 REWRITING TO APP DASHBOARD:", url.pathname);
        return NextResponse.rewrite(url);
      } else if (subdomain === "forms") {
        // Rewrite to forms home for forms subdomain
        url.pathname = "/forms-home";
        console.log("📝 REWRITING TO FORMS HOME:", url.pathname);
        return NextResponse.rewrite(url);
      }
    }
    
    console.log("🚀 NO REWRITE, CONTINUING TO AUTH");
  },
  
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // If the user is signed in and trying to access a protected route, allow them through
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};