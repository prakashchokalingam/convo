import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Zap } from "lucide-react";

export default function FormsHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Forms Portal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to
            <span className="block text-primary">ConvoForms</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Create intelligent conversational forms that engage your users and boost completion rates by 300%.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="/forms/new">
                Create New Form <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/forms">
                Browse Templates
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl border bg-card">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Natural Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Transform boring forms into engaging conversations that feel human.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Our AI understands context and adapts questions based on responses.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Build complex forms in seconds, not hours. Just describe what you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}