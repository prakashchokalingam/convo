import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserDefaultWorkspace } from "@/lib/workspace-server";

export default authMiddleware({
  // Configure Clerk to use our custom auth pages
  signInUrl: '/app/login',
  signUpUrl: '/app/signup',
  
  // Routes that don't require authentication
  publicRoutes: [
    "/",
    
    // Debug route (remove after fixing)
    "/debug-workspace/(.*)",
    
    // Marketing routes (public)
    "/marketing",
    "/marketing/(.*)",
    
    // Public auth routes  
    "/app/login",
    "/app/signup",
    
    // Public form routes
    "/forms",
    "/forms/(.*)",
    
    // API routes
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
  
  beforeAuth: (req) => {
    const { nextUrl } = req;
    
    // Root path handling - redirect to marketing
    if (nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/marketing', req.url));
    }
    
    // Backwards compatibility: Handle old query parameter format
    const subdomain = nextUrl.searchParams.get('subdomain');
    if (subdomain) {
      let redirectPath = nextUrl.pathname;
      
      if (subdomain === 'app') {
        redirectPath = '/app' + nextUrl.pathname;
      } else if (subdomain === 'forms') {
        redirectPath = '/forms' + nextUrl.pathname;
      } else if (subdomain === 'marketing') {
        redirectPath = '/marketing' + nextUrl.pathname;
      }
      
      if (redirectPath !== nextUrl.pathname) {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
    
    // Continue to auth
    return NextResponse.next();
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

    // For authenticated users, redirect from /app or /app/ to their default workspace or onboarding
    if (auth.userId && (req.nextUrl.pathname === '/app' || req.nextUrl.pathname === '/app/')) {
      // It's important that getUserDefaultWorkspace can work in this context.
      // It uses auth() internally, which should pick up the userId from the middleware's auth context.
      const workspace = await getUserDefaultWorkspace();

      if (workspace && workspace.slug) {
        const workspaceUrl = new URL(`/app/${workspace.slug}`, req.url);
        return NextResponse.redirect(workspaceUrl);
      } else {
        // No default workspace found, redirect to onboarding
        const onboardingUrl = new URL('/app/onboarding', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }
    
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
