"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  
  // Default redirect URL with subdomain
  const defaultRedirect = "/dashboard?subdomain=app";
  
  // Use provided redirect URL or default
  const finalRedirectUrl = redirectUrl ? decodeURIComponent(redirectUrl) : defaultRedirect;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "shadow-lg border",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: 
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              formFieldInput: 
                "border border-input bg-background hover:bg-accent focus:bg-background",
              footerActionLink: "text-primary hover:text-primary/90"
            }
          }}
          redirectUrl={finalRedirectUrl}
          signInUrl="/sign-in?subdomain=app"
        />
      </div>
    </div>
  );
}