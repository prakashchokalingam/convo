'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Building,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/shared/ui/button';


const useCases = [
  {
    id: 'hr',
    title: 'Human Resources',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description:
      'Transform recruitment and employee feedback with conversational forms that feel personal.',
    examples: [
      'Job Application Forms',
      'Employee Satisfaction Surveys',
      'Exit Interviews',
      'Performance Reviews',
    ],
    results: {
      completion: '+340%',
      time: '-65%',
      satisfaction: '4.8/5',
    },
    testimonial: {
      quote:
        'Our job application completion rate went from 23% to 78% after switching to conversational forms. Candidates love the experience!',
      author: 'Sarah Chen, HR Director at TechCorp',
    },
    cta: 'See HR Templates',
  },
  {
    id: 'marketing',
    title: 'Marketing & Sales',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    description:
      'Capture more leads and gather better customer insights with engaging marketing forms.',
    examples: [
      'Lead Generation Forms',
      'Customer Feedback Surveys',
      'Event Registration',
      'Product Research',
    ],
    results: {
      completion: '+287%',
      time: '-58%',
      satisfaction: '4.9/5',
    },
    testimonial: {
      quote:
        "We've tripled our lead quality since using Convo. The conversational approach gives us much richer customer data.",
      author: 'Mike Rodriguez, Marketing Manager at GrowthLab',
    },
    cta: 'Explore Marketing Forms',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description:
      'Improve patient intake and satisfaction with compassionate, conversational health forms.',
    examples: [
      'Patient Intake Forms',
      'Symptom Assessments',
      'Satisfaction Surveys',
      'Appointment Scheduling',
    ],
    results: {
      completion: '+410%',
      time: '-72%',
      satisfaction: '4.7/5',
    },
    testimonial: {
      quote:
        "Patients appreciate the human touch in our forms. It's reduced waiting room time and improved care quality.",
      author: 'Dr. Emily Watson, Wellness Clinic',
    },
    cta: 'View Healthcare Solutions',
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    description:
      'Engage students and parents with interactive forms that make education administration easier.',
    examples: ['Student Registration', 'Course Feedback', 'Parent Surveys', 'Academic Assessments'],
    results: {
      completion: '+295%',
      time: '-61%',
      satisfaction: '4.6/5',
    },
    testimonial: {
      quote:
        'Students actually enjoy filling out our course evaluations now. The response rate has been incredible.',
      author: 'Prof. James Liu, University of Innovation',
    },
    cta: 'Discover Education Forms',
  },
  {
    id: 'retail',
    title: 'Retail & E-commerce',
    icon: ShoppingCart,
    color: 'from-orange-500 to-orange-600',
    description:
      'Boost customer satisfaction and gather valuable shopping insights with conversational forms.',
    examples: ['Customer Reviews', 'Product Feedback', 'Return Processing', 'Shopping Preferences'],
    results: {
      completion: '+245%',
      time: '-54%',
      satisfaction: '4.8/5',
    },
    testimonial: {
      quote:
        "Our customers now provide much more detailed feedback. It's helped us improve our products significantly.",
      author: 'Lisa Park, E-commerce Director at ShopSmart',
    },
    cta: 'Shop Retail Templates',
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    icon: Building,
    color: 'from-gray-600 to-gray-700',
    description:
      'Scale form experiences across your organization with enterprise-grade conversational forms.',
    examples: ['Employee Onboarding', 'Vendor Assessments', 'Compliance Forms', 'Internal Surveys'],
    results: {
      completion: '+312%',
      time: '-68%',
      satisfaction: '4.9/5',
    },
    testimonial: {
      quote:
        'Convo has streamlined our entire onboarding process. New employees complete forms 3x faster than before.',
      author: 'David Kim, Operations Director at MegaCorp',
    },
    cta: 'Enterprise Solutions',
  },
];

export function UseCasesSection() {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const currentCase = useCases[activeUseCase];
  const Icon = currentCase.icon;

  return (
    <section id='use-cases' className='py-20 lg:py-32 bg-muted/30'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6'
          >
            <Briefcase className='w-4 h-4 mr-2' />
            Use Cases
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'
          >
            Perfect for every
            <span className='block text-primary'>industry</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-muted-foreground max-w-3xl mx-auto'
          >
            From HR to healthcare, see how organizations across industries are using conversational
            forms to improve engagement and gather better data.
          </motion.p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Use Case Navigation */}
          <div className='lg:col-span-1'>
            <div className='space-y-4'>
              {useCases.map((useCase, index) => {
                const UseCaseIcon = useCase.icon;
                const isActive = index === activeUseCase;

                return (
                  <motion.button
                    key={useCase.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveUseCase(index)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${useCase.color} text-white`}
                      >
                        <UseCaseIcon className='w-5 h-5' />
                      </div>
                      <div>
                        <h3 className='font-semibold'>{useCase.title}</h3>
                        <p className='text-sm text-muted-foreground mt-1'>{useCase.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Use Case Details */}
          <div className='lg:col-span-2'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeUseCase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='bg-card border rounded-2xl p-8 shadow-lg'
              >
                {/* Header */}
                <div className='flex items-center gap-4 mb-6'>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${currentCase.color} text-white`}
                  >
                    <Icon className='w-8 h-8' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold'>{currentCase.title}</h3>
                    <p className='text-muted-foreground'>{currentCase.description}</p>
                  </div>
                </div>

                {/* Examples */}
                <div className='mb-8'>
                  <h4 className='font-semibold mb-4'>Common Use Cases:</h4>
                  <div className='grid grid-cols-2 gap-3'>
                    {currentCase.examples.map((example, index) => (
                      <div key={index} className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className='grid grid-cols-3 gap-4 mb-8 p-4 bg-muted rounded-xl'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {currentCase.results.completion}
                    </div>
                    <div className='text-xs text-muted-foreground'>Completion Rate</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {currentCase.results.time}
                    </div>
                    <div className='text-xs text-muted-foreground'>Time Reduction</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {currentCase.results.satisfaction}
                    </div>
                    <div className='text-xs text-muted-foreground'>User Rating</div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className='bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6'>
                  <blockquote className='text-foreground mb-4 italic'>
                    "{currentCase.testimonial.quote}"
                  </blockquote>
                  <div className='text-sm text-muted-foreground'>
                    — {currentCase.testimonial.author}
                  </div>
                </div>

                {/* CTA */}
                <div className='flex items-center justify-between'>
                  <Button
                    className={`bg-gradient-to-r ${currentCase.color} text-white hover:opacity-90`}
                  >
                    {currentCase.cta}
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>

                  <div className='text-sm text-muted-foreground'>
                    {activeUseCase + 1} of {useCases.length} industries
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20'>
            <h3 className='text-2xl font-bold mb-4'>Ready to transform your industry?</h3>
            <p className='text-muted-foreground mb-6'>
              Join thousands of organizations creating better form experiences with AI.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='bg-primary hover:bg-primary/90'>
                Start Free Trial
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button size='lg' variant='outline'>
                Book a Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
