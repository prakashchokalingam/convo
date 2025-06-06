"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function FormBuilderPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (isLoaded && user) {
      createManualForm();
    }
  }, [isLoaded, user, router]);

  const createManualForm = async () => {
    try {
      setIsCreating(true);
      
      // Create a default form first
      const response = await fetch("/api/forms/create-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to the edit page
        router.push(`/forms/${result.formId}/edit`);
      } else {
        console.error("Error creating form:", result.error);
        alert("Error creating form. Please try again.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Error creating form. Please try again.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">Creating your form...</h2>
        <p className="text-sm text-gray-500">Setting up the form builder</p>
      </div>
    </div>
  );
}
