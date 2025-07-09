'use client';

import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  CreditCard,
  Sparkles,
  Zap,
  Crown,
  Building,
  Users,
  BarChart3,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/shared/ui/button';


const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    icon: Users,
    color: 'from-gray-500 to-gray-600',
    features: [
      '3 forms',
      '100 responses/month',
      'Basic conversational mode',
      'Email support',
      'Standard templates',
    ],
    limitations: ['Limited to 100 responses', 'Basic integrations only', 'Convo branding'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: 19,
    description: 'Great for small teams',
    icon: Sparkles,
    color: 'from-blue-500 to-blue-600',
    features: [
      '10 forms',
      '1,000 responses/month',
      'AI form generation',
      'Advanced conversational flows',
      'Priority email support',
      'Custom branding',
      'Basic analytics',
      '20+ integrations',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'Most popular for growing businesses',
    icon: Zap,
    color: 'from-primary to-primary/80',
    features: [
      'Unlimited forms',
      '10,000 responses/month',
      'Advanced AI features',
      'Smart routing & logic',
      'Priority support',
      'White-label options',
      'Advanced analytics',
      'All integrations',
      'Team collaboration',
      'Custom CSS',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For large organizations',
    icon: Building,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Unlimited everything',
      'Dedicated infrastructure',
      'Advanced security (SSO, SAML)',
      'Dedicated success manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced compliance',
      'Custom training',
      'Priority feature requests',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingPreviewSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const getPrice = (price: number | null) => {
    if (price === null) {return 'Custom';}
    if (price === 0) {return 'Free';}

    const finalPrice = isAnnual ? Math.round(price * 0.8) : price;
    return `$${finalPrice}`;
  };

  const getSavings = (price: number) => {
    if (price === 0) {return null;}
    const savings = Math.round(price * 0.2);
    return `Save $${savings}/mo`;
  };

  return (
    <section id='pricing' className='py-20 lg:py-32 bg-muted/30'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium mb-6'
          >
            <CreditCard className='w-4 h-4 mr-2' />
            Simple Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'
          >
            Plans that grow
            <span className='block text-primary'>with your business</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-muted-foreground max-w-3xl mx-auto mb-8'
          >
            Start free and scale as you grow. All plans include our core AI features and
            conversational forms.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className='inline-flex items-center bg-muted rounded-lg p-1'
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className='bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full'>
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className='grid lg:grid-cols-4 gap-8'>
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = getPrice(plan.price);
            const savings = plan.price ? getSavings(plan.price) : null;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-card border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105 lg:scale-110'
                    : 'border-border hover:border-primary/50'
                } transition-all duration-300`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <div className='bg-primary text-white text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2'>
                      <Crown className='w-4 h-4' />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className='text-center mb-8'>
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
                  <p className='text-muted-foreground text-sm mb-4'>{plan.description}</p>

                  <div className='mb-2'>
                    <span className='text-4xl font-bold'>{price}</span>
                    {plan.price !== null && plan.price > 0 && (
                      <span className='text-muted-foreground'>/{isAnnual ? 'mo' : 'mo'}</span>
                    )}
                  </div>

                  {savings && isAnnual && (
                    <div className='text-sm text-green-600 font-medium'>{savings}</div>
                  )}
                </div>

                {/* Features */}
                <div className='space-y-3 mb-8'>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className='flex items-center gap-3'>
                      <Check className='w-4 h-4 text-green-500 flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className='flex items-center gap-3 opacity-60'>
                      <div className='w-4 h-4 border border-muted-foreground rounded-full flex-shrink-0'></div>
                      <span className='text-sm text-muted-foreground'>{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : plan.name === 'Enterprise'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                        : ''
                  }`}
                  variant={
                    plan.popular ? 'default' : plan.name === 'Enterprise' ? 'default' : 'outline'
                  }
                >
                  {plan.cta}
                  {plan.name !== 'Enterprise' && <ArrowRight className='w-4 h-4 ml-2' />}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mt-16 text-center'
        >
          <Button variant='outline' size='lg' className='mb-8'>
            View Detailed Feature Comparison
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-border'
        >
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Shield className='w-5 h-5 text-green-500' />
              <span className='text-sm font-medium'>30-day free trial</span>
            </div>
            <p className='text-xs text-muted-foreground'>No credit card required</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <CreditCard className='w-5 h-5 text-blue-500' />
              <span className='text-sm font-medium'>Cancel anytime</span>
            </div>
            <p className='text-xs text-muted-foreground'>No long-term contracts</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <BarChart3 className='w-5 h-5 text-purple-500' />
              <span className='text-sm font-medium'>Usage-based scaling</span>
            </div>
            <p className='text-xs text-muted-foreground'>Pay only for what you use</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Users className='w-5 h-5 text-orange-500' />
              <span className='text-sm font-medium'>24/7 support</span>
            </div>
            <p className='text-xs text-muted-foreground'>For all paid plans</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
