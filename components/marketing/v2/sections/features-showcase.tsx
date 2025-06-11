"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/ui/button';
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  Zap,
  Brain,
  Users,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    id: 'ai-generation',
    title: 'AI Form Generation',
    description: 'Describe your form in natural language and watch our AI build it instantly with smart field types, validation rules, and optimized flow.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    demo: {
      type: 'ai-creation',
      steps: [
        { text: "User input: 'Create a job application form'", status: 'input' },
        { text: "🤖 AI analyzing requirements...", status: 'processing' },
        { text: "📝 Generated: Name, Email, Experience, Resume Upload", status: 'success' },
        { text: "✅ Form ready with smart validation!", status: 'complete' }
      ]
    },
    benefits: ['10x faster form creation', 'Smart field suggestions', 'Auto-generated validation']
  },
  {
    id: 'conversational',
    title: 'Conversational Magic',
    description: 'Transform any form into a natural conversation that feels human. Guide users through one question at a time for maximum engagement.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    demo: {
      type: 'conversation',
      messages: [
        { type: 'bot', text: "Hi! I'd love to learn about your experience 😊" },
        { type: 'user', text: "Sure, happy to share!" },
        { type: 'bot', text: "What's your name?" },
        { type: 'user', text: "Sarah Chen" },
        { type: 'bot', text: "Great to meet you, Sarah! How many years of experience do you have?" }
      ]
    },
    benefits: ['267% higher completion rates', 'Reduced form anxiety', 'Mobile-optimized flow']
  },
  {
    id: 'analytics',
    title: 'Intelligent Insights',
    description: 'Get AI-powered analytics that reveal user behavior patterns, completion bottlenecks, and optimization opportunities.',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    demo: {
      type: 'analytics',
      metrics: [
        { label: 'Completion Rate', value: '87%', trend: '+23%', color: 'text-green-600' },
        { label: 'Avg. Time', value: '2.3min', trend: '-45%', color: 'text-blue-600' },
        { label: 'Drop-off Point', value: 'Question 3', trend: 'Fixed', color: 'text-purple-600' }
      ]
    },
    benefits: ['Real-time analytics', 'AI-powered insights', 'Conversion optimization tips']
  },
  {
    id: 'smart-routing',
    title: 'Smart Routing',
    description: 'AI automatically creates conditional logic and branching based on user responses, creating personalized form experiences.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    demo: {
      type: 'routing',
      flow: [
        { condition: 'If role = "Manager"', action: 'Show leadership questions' },
        { condition: 'If experience > 5 years', action: 'Skip basic questions' },
        { condition: 'If interested = "Yes"', action: 'Show contact form' }
      ]
    },
    benefits: ['Dynamic question flow', 'Personalized experiences', 'Reduced form length']
  }
];

export function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [demoProgress, setDemoProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      setDemoProgress(0);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setDemoProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [activeFeature]);

  const currentFeature = features[activeFeature];

  const renderDemo = () => {
    const demo = currentFeature.demo;

    switch (demo.type) {
      case 'ai-creation':
        return (
          <div className="space-y-3">
            {demo.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.8 }}
                className={`p-3 rounded-lg border text-sm ${
                  step.status === 'complete' 
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                    : step.status === 'processing'
                    ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
                    : 'bg-muted border-border'
                }`}
              >
                {step.text}
              </motion.div>
            ))}
          </div>
        );

      case 'conversation':
        return (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {demo.messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.6 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border'
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'analytics':
        return (
          <div className="grid grid-cols-1 gap-4">
            {demo.metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.3 }}
                className="bg-muted border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${metric.color}`}>
                    <TrendingUp className="w-4 h-4" />
                    {metric.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'routing':
        return (
          <div className="space-y-4">
            {demo.flow.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className="bg-muted border rounded-lg p-3"
              >
                <div className="text-sm">
                  <div className="font-medium text-blue-600 dark:text-blue-400">{rule.condition}</div>
                  <div className="text-muted-foreground mt-1">→ {rule.action}</div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4 mr-2" />
            Powered by AI
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Features that make
            <span className="block text-primary">forms irresistible</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Every feature is designed to maximize user engagement and form completion rates. 
            See how AI transforms the entire form experience.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Feature Navigation */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause Demo' : 'Play Demo'}
              </Button>
              <div className="text-sm text-muted-foreground">Auto-cycling features</div>
            </div>

            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setActiveFeature(index);
                    setDemoProgress(0);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      
                      {/* Benefits */}
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            Learn More <ArrowRight className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for active feature */}
                  {isActive && isPlaying && (
                    <div className="mt-4 bg-muted rounded-full h-1 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${demoProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Demo Area */}
          <div className="sticky top-24">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl"></div>
              <div className="relative bg-card border rounded-2xl p-8 shadow-xl">
                
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${currentFeature.color} text-white`}>
                    <currentFeature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-semibold">{currentFeature.title}</h4>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderDemo()}
                  </motion.div>
                </AnimatePresence>

                {/* Demo Footer */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <div className="flex gap-2">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === activeFeature
                            ? 'bg-primary w-8'
                            : 'bg-muted w-2'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeFeature + 1} of {features.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
