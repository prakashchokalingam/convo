import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { ArrowRight, CheckCircle, MessageSquare, BarChart } from 'lucide-react';
import { getLoginUrl, getSignupUrl } from '@/lib/context';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ConvoForms</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={getLoginUrl()}>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href={getSignupUrl()}>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build <span className="text-blue-600">Conversational Forms</span> That Convert
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Increase form completion rates by 40-60% with AI-powered conversational forms. 
            Transform boring surveys into engaging conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={getSignupUrl()}>
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Conversational Forms?
            </h2>
            <p className="text-xl text-gray-600">
              Traditional forms are broken. Here's how we fix them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conversational Experience</h3>
              <p className="text-gray-600">
                Transform static forms into natural conversations that feel human and engaging.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Higher Completion Rates</h3>
              <p className="text-gray-600">
                Achieve 40-60% higher completion rates compared to traditional forms.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Build</h3>
              <p className="text-gray-600">
                Create professional forms in minutes with our AI-powered form builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Forms?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses creating better form experiences.
          </p>
          <Link href={getSignupUrl()}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">ConvoForms</span>
              </div>
              <p className="text-gray-400">
                Building the future of form experiences with conversational AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white">Templates</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">About</a>
                <a href="#" className="block text-gray-400 hover:text-white">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white">API Reference</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ConvoForms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
