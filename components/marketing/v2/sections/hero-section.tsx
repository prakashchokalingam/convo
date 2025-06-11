"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Play,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Completion Rate Increase', value: '267%', icon: TrendingUp },
  { label: 'Happy Customers', value: '50K+', icon: Users },
  { label: 'Forms Created', value: '2M+', icon: MessageSquare },
];

const aiDemo = [
  { text: "Create a customer feedback form", delay: 0 },
  { text: "✨ AI analyzing requirements...", delay: 1500 },
  { text: "📝 Generating form fields...", delay: 3000 },
  { text: "🎯 Adding smart validation...", delay: 4500 },
  { text: "💬 Converting to conversation...", delay: 6000 },
  { text: "🚀 Form ready in 8 seconds!", delay: 7500 },
];

const conversationalDemo = [
  { type: 'bot', message: "Hi! I'd love to get your feedback 😊", delay: 8500 },
  { type: 'user', message: "Sure, happy to help!", delay: 10000 },
  { type: 'bot', message: "Great! What's your name?", delay: 11500 },
  { type: 'user', message: "Alex Johnson", delay: 13000 },
  { type: 'bot', message: "Nice to meet you, Alex! How would you rate our service?", delay: 14500 },
  { type: 'rating', message: "⭐⭐⭐⭐⭐", delay: 16000 },
];

export function HeroSection() {
  const [currentDemo, setCurrentDemo] = useState<'ai' | 'conversation'>('ai');
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    // AI Demo Animation
    if (currentDemo === 'ai') {
      setVisibleSteps(0);
      aiDemo.forEach((step, index) => {
        setTimeout(() => {
          setVisibleSteps(index + 1);
          if (index === aiDemo.length - 1) {
            setTimeout(() => setCurrentDemo('conversation'), 1000);
          }
        }, step.delay);
      });
    }
  }, [currentDemo]);

  useEffect(() => {
    // Conversation Demo Animation
    if (currentDemo === 'conversation') {
      setVisibleMessages(0);
      conversationalDemo.forEach((message, index) => {
        setTimeout(() => {
          setVisibleMessages(index + 1);
          if (index === conversationalDemo.length - 1) {
            setTimeout(() => setCurrentDemo('ai'), 2000);
          }
        }, message.delay - 8000);
      });
    }
  }, [currentDemo]);

  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Form Builder
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-6"
            >
              Forms that feel like
              <span className="block text-primary">conversations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Transform boring forms into engaging conversations with AI. Boost completion rates by up to 300% with intelligent, adaptive forms that understand and respond to your users.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/sign-up" className="flex items-center gap-2">
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-muted" asChild>
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-2xl lg:text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Demo Header */}
              <div className="bg-muted/50 border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Convo AI Form Builder
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6 h-80">
                <AnimatePresence mode="wait">
                  {currentDemo === 'ai' && (
                    <motion.div
                      key="ai-demo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">AI Form Generation</h3>
                      </div>
                      
                      {aiDemo.slice(0, visibleSteps).map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg text-sm ${
                            step.text.includes('✨') || step.text.includes('🚀')
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-muted'
                          }`}
                        >
                          {step.text}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {currentDemo === 'conversation' && (
                    <motion.div
                      key="conversation-demo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">Conversational Experience</h3>
                      </div>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {conversationalDemo.slice(0, visibleMessages).map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                                message.type === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : message.type === 'rating'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.message}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Demo Footer */}
              <div className="bg-muted/30 border-t px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Live Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">+267% completion</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-green-500 text-white rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                87% completion rate
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Built in 8 seconds
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
