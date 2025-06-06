"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormBuilder } from "@/components/form-builder/core/FormBuilder";
import { FormConfig } from "@/lib/form-builder/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  id: string;
  userId: string;
  name: string;
  description: string;
  config: string;
  isConversational: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditFormPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratedForm, setIsGeneratedForm] = useState(false);

  const formId = params.id as string;

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (isLoaded && user && formId) {
      fetchForm();
    }
  }, [isLoaded, user, formId]);

  const fetchForm = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/forms/${formId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Form not found",
            description: "The form you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch form");
      }

      const data = await response.json();
      setForm(data);
      
      // Check if this is a newly generated form (less than 30 seconds old)
      const formAge = Date.now() - new Date(data.createdAt).getTime();
      if (formAge < 30000) { // 30 seconds
        setIsGeneratedForm(true);
        toast({
          title: "Form generated successfully!",
          description: "Your AI-generated form is ready for customization.",
        });
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      toast({
        title: "Error",
        description: "Failed to load form. Please try again.",
        variant: "destructive",
      });
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (config: FormConfig) => {
    if (!user || isSaving || !form) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: config.name,
          description: config.description,
          config: config,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Form saved",
          description: "Your changes have been saved successfully.",
        });
        
        // Update local form data
        setForm(prev => prev ? {
          ...prev,
          name: config.name,
          description: config.description,
          config: JSON.stringify(config),
          updatedAt: new Date().toISOString()
        } : null);
      } else {
        throw new Error(result.error || "Failed to save form");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = (config: FormConfig) => {
    // Open preview in new tab
    window.open(`/forms/${formId}/preview`, '_blank');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Form not found</h2>
          <p className="text-sm text-gray-500">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const initialConfig: FormConfig = {
    ...JSON.parse(form.config),
    name: form.name,
    description: form.description,
  };

  return (
    <div className="h-screen overflow-hidden">
      <FormBuilder
        initialConfig={initialConfig}
        onSave={handleSave}
        onPreview={handlePreview}
        mode="edit"
      />
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Saving form...</span>
          </div>
        </div>
      )}
    </div>
  );
}
