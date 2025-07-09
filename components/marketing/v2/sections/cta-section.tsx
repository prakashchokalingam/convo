'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  CheckCircle,
  Star,
  Play,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/shared/ui/button';

const features = [
  'AI-powered form generation',
  'Conversational user experience',
  'Advanced analytics & insights',
  '100+ integrations',
  'Enterprise-grade security',
  '24/7 support',
];

const stats = [
  { value: '267%', label: 'Higher completion rates' },
  { value: '50K+', label: 'Happy customers' },
  { value: '2M+', label: 'Forms created' },
  { value: '99.9%', label: 'Uptime guarantee' },
];

export function CTASection() {
  return (
    <section className='py-20 lg:py-32 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5'></div>
      <div className='absolute inset-0 bg-grid-pattern opacity-20'></div>

      <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Main CTA Content */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8'
          >
            <Sparkles className='w-4 h-4 mr-2' />
            Ready to transform your forms?
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl lg:text-6xl font-bold mb-6'
          >
            Start building better
            <span className='block text-primary'>forms today</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8'
          >
            Join thousands of businesses creating engaging, AI-powered conversational forms. Start
            your free trial today and see results within minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className='flex flex-col sm:flex-row gap-4 justify-center mb-8'
          >
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all'
              asChild
            >
              <Link href='/sign-up' className='flex items-center gap-2'>
                Start Free Trial
                <ArrowRight className='w-5 h-5' />
              </Link>
            </Button>

            <Button size='lg' variant='outline' className='text-lg px-8 py-6 border-2' asChild>
              <Link href='#demo' className='flex items-center gap-2'>
                <Play className='w-5 h-5' />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground'
          >
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              <span>No credit card required</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4 text-blue-500' />
              <span>30-day free trial</span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-yellow-500 fill-current' />
              <span>4.8/5 customer rating</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className='flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4'
            >
              <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
              <span className='text-sm font-medium'>{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-16'
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              className='text-center'
            >
              <div className='text-3xl lg:text-4xl font-bold text-primary mb-2'>{stat.value}</div>
              <div className='text-sm text-muted-foreground'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className='bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center'
        >
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Users className='w-5 h-5 text-primary' />
            <span className='font-semibold'>Trusted by 50,000+ businesses worldwide</span>
          </div>

          <div className='flex items-center justify-center gap-1 mb-4'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 text-yellow-500 fill-current' />
            ))}
            <span className='ml-2 font-medium'>4.8/5</span>
            <span className='text-muted-foreground ml-1'>(2,847 reviews)</span>
          </div>

          <p className='text-muted-foreground italic max-w-2xl mx-auto'>
            &quot;Convo has transformed how we collect customer feedback. The conversational approach
            feels so natural, and our response rates have never been higher.&quot;
          </p>
          <div className='text-sm text-muted-foreground mt-2'>
            — Sarah Chen, VP Marketing at TechCorp
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <h3 className='text-2xl font-bold mb-4'>What are you waiting for?</h3>
          <p className='text-muted-foreground mb-8'>
            Your competitors are already creating better form experiences. Don&apos;t get left behind.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all'
              asChild
            >
              <Link href='/sign-up' className='flex items-center gap-2'>
                Get Started Now
                <ArrowRight className='w-5 h-5' />
              </Link>
            </Button>

            <Button size='lg' variant='outline' asChild>
              <Link href='/contact'>Talk to Sales</Link>
            </Button>
          </div>

          <div className='flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground'>
            <span>🚀 Setup in minutes</span>
            <span>•</span>
            <span>💳 No credit card required</span>
            <span>•</span>
            <span>🎯 See results immediately</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
