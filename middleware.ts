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
    "/app/login/sso-callback",
    "/app/signup",
    "/app/signup/sso-callback",
    
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
    const { nextUrl, headers: reqHeaders } = req;
    const hostname = reqHeaders.get('host') || '';
    const pathname = nextUrl.pathname;
    let context: 'marketing' | 'app' | 'forms' | 'admin' = 'marketing'; // Default context

    if (process.env.NODE_ENV === 'development') {
      if (pathname.startsWith('/admin')) {
        context = 'admin';
      } else if (pathname.startsWith('/app')) {
        context = 'app';
      } else if (pathname.startsWith('/forms')) {
        context = 'forms';
      } else { // Includes /marketing and /
        context = 'marketing';
      }
    } else { // Production
      if (hostname.startsWith('admin.')) {
        context = 'admin';
      } else if (hostname.startsWith('app.')) {
        context = 'app';
      } else if (hostname.startsWith('forms.')) {
        context = 'forms';
      } else { // Root domain convo.ai
        context = 'marketing';
      }
    }

    // Prepare response headers
    const responseHeaders = new Headers(req.headers);
    responseHeaders.set('x-subdomain-context', context);
    
    // Root path handling - redirect to marketing
    if (nextUrl.pathname === '/') {
      // For redirects, the context header might primarily be for any intermediate processing,
      // as the final request will be to /marketing.
      return NextResponse.redirect(new URL('/marketing', req.url), { headers: responseHeaders });
    }
    
    // Continue to auth (subdomain query param logic removed)
    // Pass the modified headers to the next middleware/handler
    return NextResponse.next({
      request: {
        headers: responseHeaders,
      },
    });
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
        const workspaceUrl = new URL(`/app/${workspace.slug}/dashboard`, req.url);
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
