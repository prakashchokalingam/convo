"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const examples = [
  {
    title: "Job Application",
    description: "Personal info, experience, skills",
    prompt: "Job application with personal info, experience, skills, resume upload"
  },
  {
    title: "Event Registration", 
    description: "Attendee details, preferences",
    prompt: "Event registration with attendee details, dietary restrictions, emergency contact"
  },
  {
    title: "Lead Generation",
    description: "Company details, budget",
    prompt: "Lead capture with company info, contact details, budget, main challenges"
  }
];

export default function NewFormPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [focusedExample, setFocusedExample] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("prompt", prompt);
    
    try {
      const response = await fetch("/api/forms/generate", {
        method: "POST",
        body: formData,
      });
      
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-6 transform transition-transform hover:scale-105">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create your form
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Describe what you need and we'll build it for you
          </p>
        </div>
      </div>

      {/* Main Form */}
      <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm ring-1 ring-black/5 transform transition-all duration-300 hover:shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="prompt" className="block text-sm font-medium text-foreground">
              What do you want to collect?
            </label>
            <div className="relative">
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Customer feedback with name, email, rating 1-5, likes, and improvement suggestions..."
                className="min-h-[120px] resize-none text-base leading-relaxed border-2 transition-all duration-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                required
                disabled={isSubmitting}
                aria-describedby="prompt-help"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transform transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate form
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
          
          {/* Manual Form Builder Link */}
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              asChild
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link href="/forms/builder">
                or create form manually
              </Link>
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Examples */}
      <div className="mt-16 space-y-6">
        <div className="text-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Quick starts
          </h2>
        </div>
        
        <div className="grid gap-3">
          {examples.map((example, index) => (
            <Card
              key={index}
              className={`p-4 cursor-pointer transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm ring-1 ring-black/5 hover:bg-white/80 hover:shadow-lg hover:ring-primary/20 hover:-translate-y-1 transform ${
                focusedExample === index ? 'ring-2 ring-primary/30 shadow-lg' : ''
              }`}
              onClick={() => setPrompt(example.prompt)}
              onMouseEnter={() => setFocusedExample(index)}
              onMouseLeave={() => setFocusedExample(null)}
              tabIndex={0}
              role="button"
              aria-label={`Use ${example.title} template`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPrompt(example.prompt);
                }
              }}
            >
              <div className="flex items-center justify-between group">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {example.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-xs text-muted-foreground">
          Forms are generated intelligently based on your description
        </p>
      </div>
    </div>
  );
}