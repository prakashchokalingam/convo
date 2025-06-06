import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { urls } from "@/lib/config/urls";
import { ArrowRight, Brain, Search, TrendingUp, Zap, Shield, Target, Check, Star, Play, ChevronRight, Eye, Lightbulb, Network, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              Trusted by 10,000+ customer-obsessed teams
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Never miss a
              <span className="block text-primary">customer signal again</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered conversations that uncover what your customers really need. 
              Capture 5x more insights and turn every interaction into actionable intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link href={urls.app.signUp}>
                  Start Understanding Your Customers <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="#demo">
                  <Eye className="mr-2 h-5 w-5" />
                  See What You're Missing
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Instant customer insights
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                14-day intelligence preview
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Setup in 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Demo */}
      <HeroDemo />

      {/* Social Proof */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-muted-foreground mb-8">Powering customer intelligence for leading companies</p>
          <div className="flex items-center justify-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="text-2xl font-bold">Shopify</div>
            <div className="text-2xl font-bold">Stripe</div>
            <div className="text-2xl font-bold">Notion</div>
            <div className="text-2xl font-bold">Linear</div>
            <div className="text-2xl font-bold">Vercel</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Uncover insights that
              <span className="block text-primary">traditional surveys miss</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI reads between the lines to surface the customer intelligence that drives business decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Brain,
                title: "Intelligent Signal Detection",
                description: "AI automatically designs conversations that uncover hidden customer needs, motivations, and pain points you'd never think to ask about."
              },
              {
                icon: Search,
                title: "Natural Customer Discovery",
                description: "Customers share more when they don't realize they're being 'surveyed.' Get authentic insights through natural conversation."
              },
              {
                icon: Lightbulb,
                title: "Customer Intelligence Engine",
                description: "AI reads between the lines to surface insights, patterns, and opportunities hidden in every customer interaction."
              },
              {
                icon: Zap,
                title: "Real-time Signal Capture",
                description: "Capture customer intent in the moment, before they lose interest or change their mind. Never miss a buying signal."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "GDPR compliant with enterprise-grade security. Your customer intelligence is safe and protected."
              },
              {
                icon: Target,
                title: "Actionable Business Intelligence",
                description: "Turn customer conversations into strategic decisions. Understand exactly what drives purchase decisions."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <FeaturesShowcase />

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              From missed signals to customer clarity
            </h2>
            <p className="text-lg text-muted-foreground">
              See how teams use customer intelligence to drive growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Head of Marketing",
                company: "TechFlow",
                content: "We identified 3x more qualified leads and discovered exactly what prospects were looking for. The AI caught buying signals we completely missed before.",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Product Manager",
                company: "StartupCo",
                content: "Customer insights that used to take weeks of analysis now surface automatically. These insights directly influenced our product roadmap.",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "UX Designer",
                company: "DesignStudio",
                content: "Finally understand the real reasons customers choose us over competitors. The depth of customer intelligence is incredible.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl bg-card border shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70"></div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5x", label: "More customer insights captured" },
              { value: "10K+", label: "Teams using customer intelligence" },
              { value: "1M+", label: "Customer signals analyzed" },
              { value: "99.9%", label: "Signal capture reliability" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Invest in customer understanding
            </h2>
            <p className="text-lg text-muted-foreground">
              Start discovering what you're missing. Scale your customer intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Discovery",
                price: "Free",
                description: "Start understanding your customers",
                features: [
                  "3 intelligence conversations",
                  "100 customer signals/month",
                  "Basic insight analytics",
                  "Email support"
                ],
                cta: "Start Discovery",
                popular: false
              },
              {
                name: "Intelligence",
                price: "$29",
                period: "/month",
                description: "For teams serious about customers",
                features: [
                  "Unlimited conversations",
                  "10,000 signals/month",
                  "Advanced customer analytics",
                  "Priority support",
                  "Custom intelligence reports",
                  "API access"
                ],
                cta: "Unlock Customer Intelligence",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For customer-obsessed organizations",
                features: [
                  "Everything in Intelligence",
                  "Unlimited customer signals",
                  "SSO & SCIM",
                  "Dedicated customer success",
                  "Custom AI models",
                  "Intelligence SLA"
                ],
                cta: "Talk to Intelligence Experts",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-2xl border bg-card ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Insights
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.name === "Enterprise" ? urls.website.contact : urls.app.signUp}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What customer insights are you missing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of customer-obsessed teams already using AI to understand what drives their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg" asChild>
              <Link href={urls.app.signUp}>
                Discover Your Customer Intelligence <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href={urls.website.contact}>
                Talk to Intelligence Experts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-semibold mb-4">ConvoForms</div>
              <p className="text-muted-foreground mb-4">
                AI-powered customer intelligence that uncovers what your customers really need.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="ghost" asChild>
                  <Link href={urls.external.twitter}>Twitter</Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={urls.external.linkedin}>LinkedIn</Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={urls.external.github}>GitHub</Link>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Intelligence</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href={urls.website.features} className="hover:text-foreground">Customer Insights</Link></li>
                <li><Link href={urls.website.pricing} className="hover:text-foreground">Intelligence Plans</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href={urls.api.base} className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href={urls.website.about} className="hover:text-foreground">About</Link></li>
                <li><Link href={urls.website.blog} className="hover:text-foreground">Customer Intelligence Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link href={urls.website.contact} className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href={urls.website.help} className="hover:text-foreground">Help Center</Link></li>
                <li><Link href={urls.website.docs} className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
                <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2024 ConvoForms. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href={urls.website.privacy} className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link href={urls.website.terms} className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}