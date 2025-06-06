import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Clock, Shield, Users } from "lucide-react";

export default function FormsHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                ConvoForms
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Forms Portal
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to ConvoForms
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Access Your
            <span className="block text-primary">Interactive Forms</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Complete forms through natural conversations. Experience the future of form filling.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Conversational Experience</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fill out forms through natural conversation. Just like chatting with a human.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save Time</h3>
            <p className="text-muted-foreground leading-relaxed">
              Complete forms 3x faster with intelligent question flow and smart suggestions.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your data is protected with enterprise-grade security and privacy measures.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Complete forms in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Access Your Form</h3>
              <p className="text-sm text-muted-foreground">
                Click on the form link you received or enter the form ID
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Start Conversation</h3>
              <p className="text-sm text-muted-foreground">
                Answer questions naturally in a chat-like interface
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Submit & Done</h3>
              <p className="text-sm text-muted-foreground">
                Review your responses and submit when you're ready
              </p>
            </div>
          </div>
        </div>

        {/* Access Form Section */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Enter your form ID or click on the form link you received
          </p>
          
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="text"
              placeholder="Enter form ID (e.g., FORM-123)"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/30"
            />
            <Button 
              variant="secondary" 
              size="lg"
              className="px-6 py-3 bg-white text-primary hover:bg-gray-50"
            >
              Access Form
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm mt-4 text-primary-foreground/80">
            Don't have a form ID? Contact the organization that sent you the form.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500K+</div>
            <div className="text-sm text-muted-foreground">Forms completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">3x</div>
            <div className="text-sm text-muted-foreground">Faster completion</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">ConvoForms</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/help" className="hover:text-foreground">Help</Link>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 text-center text-sm text-muted-foreground">
            © 2024 ConvoForms. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
