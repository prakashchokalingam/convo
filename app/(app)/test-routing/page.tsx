"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import Link from "next/link";

export default function TestRoutingPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const subdomain = searchParams.get('subdomain');
  const redirectUrl = searchParams.get('redirect_url');
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Routing Test Page</h1>
        <ThemeToggle />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Route Information</CardTitle>
          <CardDescription>Debug information for subdomain routing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Pathname:</h3>
              <p className="text-muted-foreground font-mono">{pathname}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Subdomain:</h3>
              <p className="text-muted-foreground font-mono">{subdomain || 'none'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-semibold">Full URL:</h3>
              <p className="text-muted-foreground font-mono break-all">{typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
            </div>
            
            {redirectUrl && (
              <div className="md:col-span-2">
                <h3 className="font-semibold">Redirect URL:</h3>
                <p className="text-muted-foreground font-mono break-all">{decodeURIComponent(redirectUrl)}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Search Parameters:</h3>
            <ul className="space-y-1">
              {Array.from(searchParams.entries()).map(([key, value]) => (
                <li key={key} className="text-sm">
                  <span className="font-mono bg-muted px-2 py-1 rounded">{key}</span>
                  {' = '}
                  <span className="font-mono bg-muted px-2 py-1 rounded">{value}</span>
                </li>
              ))}
            </ul>
            {Array.from(searchParams.entries()).length === 0 && (
              <p className="text-muted-foreground text-sm">No search parameters</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test Links</CardTitle>
          <CardDescription>Test different routing scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">App Subdomain</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/dashboard?subdomain=app">Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/theme-demo?subdomain=app">Theme Demo</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/sign-in?subdomain=app">Sign In</Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Other Subdomains</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/?subdomain=forms">Forms</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/">Marketing</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Authentication Test</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This should redirect to sign-in with proper subdomain and redirect URL
            </p>
            <Button asChild>
              <Link href="/dashboard?subdomain=app">Go to Dashboard (Auth Required)</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}