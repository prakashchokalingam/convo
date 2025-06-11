'use client';

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useWorkspaceSetup } from '@/hooks/use-workspace-setup';
import { getWorkspaceUrl, getMarketingUrl } from '@/lib/context';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Loader2 } from 'lucide-react';

export function SignUpForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { setupWorkspace, isLoading: isSettingUpWorkspace } = useWorkspaceSetup();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setErrors([]);

    try {
      // Step 1: Create Clerk user account
      const result = await signUp.create({
        emailAddress: formData.emailAddress,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.status === 'complete') {
        // Step 2: Set the active session
        await setActive({ session: result.createdSessionId });
        
        // Step 3: Setup workspace immediately after successful signup
        const workspaceResult = await setupWorkspace({
          email: formData.emailAddress,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (workspaceResult) {
          // Step 4: Redirect to workspace with welcome flag
          const workspaceUrl = getWorkspaceUrl(workspaceResult.workspaceSlug) + '?welcome=true';
          router.push(workspaceUrl);
        } else {
          // Fallback: redirect to marketing home
          router.push(getMarketingUrl('/'));
        }
      } else {
        // Handle cases where verification is required
        if (result.unverifiedFields.includes('email_address')) {
          setErrors(['Please verify your email address to continue.']);
          // You could redirect to verification page here
          // router.push('/verify-email');
        } else {
          setErrors(['Signup incomplete. Please check your information.']);
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle Clerk-specific errors
      if (err.errors) {
        const errorMessages = err.errors.map((error: any) => error.message);
        setErrors(errorMessages);
      } else {
        setErrors([err.message || 'An error occurred during signup']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isSettingUpWorkspace;

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email</Label>
          <Input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            minLength={8}
          />
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoading ? 'Creating Account...' : 'Setting up Workspace...'}
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Progress indicator */}
      {isSubmitting && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-primary' : 'bg-muted'}`} />
              <span>Creating account</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isSettingUpWorkspace ? 'bg-primary' : 'bg-muted'}`} />
              <span>Setting up workspace</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
