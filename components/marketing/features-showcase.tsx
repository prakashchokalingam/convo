'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/shared/ui/button';


const features = [
  {
    id: 'ai-creation',
    title: 'AI-Powered Creation',
    description:
      'Describe your form in plain English and watch our AI build it instantly with smart field types, validation rules, and conditional logic.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    demo: {
      type: 'text-animation',
      content: [
        'Create a customer feedback form',
        'Add name, email, and rating fields',
        'Include conditional follow-up questions',
        '✨ Form created in 3 seconds!',
      ],
    },
  },
  {
    id: 'conversational',
    title: 'Conversational Experience',
    description:
      'Transform any form into a natural conversation that feels like chatting with a human. Boost engagement and completion rates dramatically.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    demo: {
      type: 'chat-simulation',
      content: [
        { type: 'bot', message: "Hi! I'd love to get your feedback. What's your name?" },
        { type: 'user', message: 'Sarah Chen' },
        {
          type: 'bot',
          message: 'Nice to meet you, Sarah! How would you rate your experience today?',
        },
        { type: 'user', message: '⭐⭐⭐⭐⭐' },
        { type: 'bot', message: 'Wonderful! What did you like most about it?' },
      ],
    },
  },
  {
    id: 'analytics',
    title: 'Smart Analytics',
    description:
      'Get AI-powered insights that help you understand responses, identify patterns, and optimize your forms for better conversion.',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    demo: {
      type: 'chart-animation',
      content: {
        completion: 87,
        avgTime: '2.3min',
        insights: [
          '📈 Completion rate up 250%',
          '🎯 Drop-off reduced by 65%',
          '💡 Users prefer shorter questions',
        ],
      },
    },
  },
  {
    id: 'performance',
    title: 'Lightning Fast',
    description:
      'Forms load instantly and work seamlessly across all devices. Built for speed with global CDN and optimized performance.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    demo: {
      type: 'performance-metrics',
      content: {
        loadTime: '0.3s',
        uptime: '99.9%',
        devices: ['Desktop', 'Mobile', 'Tablet'],
        regions: 12,
      },
    },
  },
];

export function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) {return;}

    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentFeature = features[activeFeature];

  const renderDemo = () => {
    const demo = currentFeature.demo;

    switch (demo.type) {
      case 'text-animation':
        return (
          <div className='space-y-3'>
            {demo.content.map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className={`p-3 rounded-lg ${
                  text.includes('✨')
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-muted'
                }`}
              >
                {text}
              </motion.div>
            ))}
          </div>
        );

      case 'chat-simulation':
        return (
          <div className='space-y-3 max-h-80 overflow-y-auto'>
            {demo.content.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.8 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {message.message}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'chart-animation':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className='text-3xl font-bold text-green-600'
                >
                  {demo.content.completion}%
                </motion.div>
                <div className='text-sm text-muted-foreground'>Completion Rate</div>
              </div>
              <div className='text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className='text-3xl font-bold text-blue-600'
                >
                  {demo.content.avgTime}
                </motion.div>
                <div className='text-sm text-muted-foreground'>Avg. Time</div>
              </div>
            </div>
            <div className='space-y-2'>
              {demo.content.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  className='text-sm bg-muted p-2 rounded'
                >
                  {insight}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'performance-metrics':
        return (
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{demo.content.loadTime}</div>
                <div className='text-sm text-muted-foreground'>Load Time</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-600'>{demo.content.uptime}</div>
                <div className='text-sm text-muted-foreground'>Uptime</div>
              </div>
            </div>
            <div className='space-y-3'>
              <div>
                <div className='text-2xl font-bold'>{demo.content.regions}</div>
                <div className='text-sm text-muted-foreground'>Global Regions</div>
              </div>
              <div className='space-y-1'>
                {demo.content.devices.map((device, index) => (
                  <div key={index} className='flex items-center gap-2 text-sm'>
                    <CheckCircle className='w-4 h-4 text-green-500' />
                    {device}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className='py-20 lg:py-32 bg-gradient-to-br from-background via-background to-secondary/20'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'>
            See ConvoForms in
            <span className='block text-primary'>action</span>
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Discover how our features work together to create the most engaging form experience.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Feature Navigation */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-8'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsPlaying(!isPlaying)}
                className='flex items-center gap-2'
              >
                {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <span className='text-sm text-muted-foreground'>Auto-playing demo</span>
            </div>

            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;

              return (
                <motion.div
                  key={feature.id}
                  className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className='flex items-start gap-4'>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                      <Icon className='w-6 h-6' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                      <p className='text-muted-foreground leading-relaxed'>{feature.description}</p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className='mt-4'
                        >
                          <Button variant='outline' size='sm' className='gap-2'>
                            Learn More <ArrowRight className='w-4 h-4' />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Demo Area */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl'></div>
            <div className='relative bg-card border rounded-2xl p-8 shadow-xl'>
              <div className='flex items-center gap-3 mb-6'>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${currentFeature.color} text-white`}
                >
                  <currentFeature.icon className='w-5 h-5' />
                </div>
                <h4 className='text-lg font-semibold'>{currentFeature.title}</h4>
              </div>

              <AnimatePresence mode='wait'>
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

              {/* Progress indicator */}
              <div className='flex gap-2 mt-8'>
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === activeFeature ? 'bg-primary flex-1' : 'bg-muted w-8'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
