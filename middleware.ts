import { authMiddleware } from "@clerk/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import type { SubdomainContext } from "./lib/subdomain"; // Import the type

export default authMiddleware({
  // Configure Clerk to use our custom auth pages
  signInUrl: '/app/login', // Path will be /login after rewrite for (app) group
  signUpUrl: '/app/signup', // Path will be /signup after rewrite for (app) group
  
  // Routes that don't require authentication
  publicRoutes: [
    // Note: These paths are checked *after* potential rewrites in beforeAuth.
    // So, /app/login becomes /login before this check.
    "/", // Root marketing pages (e.g. /about, /pricing after rewrite)
    "/marketing", // Explicit /marketing path (becomes / after rewrite)
    "/marketing/(.*)", // e.g. /marketing/blog-post (becomes /blog-post)
    
    // Debug route (remove after fixing) - this might need care if it's not in a group
    "/debug-workspace/(.*)",
    
    // Public auth routes - these are /app/login, etc.
    // They will be rewritten to /login, /signup for the (app) group.
    "/login",
    "/signup",
    
    // Public form routes - these are /forms/submit, etc.
    // They will be rewritten to /submit for the (forms) group.
    "/forms",       // Base path for forms context if any page exists at app/(forms)/page.tsx
    "/forms/(.*)",  // e.g., /forms/form-id (becomes /form-id)
    
    // API routes (generally don't go through this same path rewriting for pages)
    "/api/(.*)",
    
    // Static assets
    "/_next(.*)",
    "/favicon.ico",
  ],
  
  // Routes that should be ignored by Clerk
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)",
    "/api/webhooks(.*)"
  ],
  
  beforeAuth: (req: NextRequest) => {
    const { nextUrl, headers: originalHeaders } = req;
    const host = originalHeaders.get('host');
    const pathname = nextUrl.pathname;

    let context: SubdomainContext = 'marketing'; // Default context

    // 1. Determine Context
    if (process.env.NODE_ENV === 'production') {
      if (host?.startsWith('app.')) context = 'app';
      else if (host?.startsWith('forms.')) context = 'forms';
      else context = 'marketing';
    } else { // Development
      if (pathname.startsWith('/app/')) context = 'app';
      else if (pathname.startsWith('/forms/')) context = 'forms';
      else if (pathname.startsWith('/marketing/')) context = 'marketing';
      // For root path "/" or other top-level paths like "/about", it's 'marketing'
      // This is implicitly handled by the default and subsequent logic
      else context = 'marketing';
    }

    // 2. Handle ?subdomain= query parameter redirects (backwards compatibility)
    // This should run early as it changes the URL for subsequent checks.
    const subdomainQuery = nextUrl.searchParams.get('subdomain');
    if (subdomainQuery) {
      let newPathBase = '';
      if (subdomainQuery === 'app') newPathBase = '/app';
      else if (subdomainQuery === 'forms') newPathBase = '/forms';
      else if (subdomainQuery === 'marketing') newPathBase = '/marketing';
      else newPathBase = '/marketing'; // Default unknown subdomain to marketing

      const newRedirectUrl = new URL(newPathBase + pathname, req.url);
      // Preserve other query params
      nextUrl.searchParams.forEach((value, key) => {
        if (key !== 'subdomain') newRedirectUrl.searchParams.set(key, value);
      });
      console.log(`Redirecting from ?subdomain=${subdomainQuery} ${pathname} to ${newRedirectUrl.toString()}`);
      return NextResponse.redirect(newRedirectUrl);
    }
    
    // 3. Handle root path "/" redirect to "/marketing" path for consistency in dev path structure
    // In production, "/" is fine for marketing. In dev, we want /marketing/* structure.
    // This also ensures that subsequent logic for /marketing/ prefix stripping works.
    if (process.env.NODE_ENV === 'development' && pathname === '/') {
      const marketingUrl = new URL('/marketing', req.url);
      // No need to set x-subdomain-context on redirect, new request will pass through.
      return NextResponse.redirect(marketingUrl);
    }

    // 4. Prepare new request headers with x-subdomain-context
    const requestHeaders = new Headers(originalHeaders);
    requestHeaders.set('x-subdomain-context', context);

    // 5. Perform URL Rewrites for Development to map to Next.js app route groups
    if (process.env.NODE_ENV === 'development') {
      let rewrittenPath = pathname;
      let didRewrite = false;

      if (pathname.startsWith('/app/')) {
        rewrittenPath = pathname.substring('/app'.length) || '/';
        didRewrite = true;
      } else if (pathname.startsWith('/forms/')) {
        rewrittenPath = pathname.substring('/forms'.length) || '/';
        didRewrite = true;
      } else if (pathname.startsWith('/marketing/')) {
        // Only strip /marketing/ if it's explicitly there.
        // Paths like /about (implicitly marketing) are fine and map to app/(marketing)/about
        rewrittenPath = pathname.substring('/marketing'.length) || '/';
        didRewrite = true;
      }

      if (didRewrite) {
        const newUrl = new URL(rewrittenPath, req.url);
        return NextResponse.rewrite(newUrl, { request: { headers: requestHeaders } });
      }
    }
    
    // 6. If no redirect or specific rewrite, pass through with the new context header
    // This ensures the header is set for all requests, including those not rewritten (e.g. production, or dev paths not needing prefix stripping)
    return NextResponse.next({ request: { headers: requestHeaders } });
  },
  
  async afterAuth(auth, req, evt) {
    // For Clerk auth pages, let Clerk handle the flow
    if (req.nextUrl.pathname === '/app/login' || req.nextUrl.pathname === '/app/signup') {
      return NextResponse.next();
    }
    
    // Handle users who aren't authenticated for protected app routes
    if (!auth.userId && !auth.isPublicRoute) {
      const loginUrl = new URL('/app/login', req.url);
      if (req.nextUrl.pathname !== '/app/login') {
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
      }
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
