'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqData = [
  {
    question: 'How does AI form creation work?',
    answer:
      'Simply describe your form in plain English, and our AI analyzes your requirements to automatically generate form fields, validation rules, and conditional logic. The process takes just seconds and creates professional, optimized forms ready for deployment.',
  },
  {
    question: 'What makes conversational forms better than traditional forms?',
    answer:
      'Conversational forms feel like natural conversations, reducing user friction and anxiety. They guide users through one question at a time, provide instant feedback, and adapt based on responses. This approach typically increases completion rates by 200-300%.',
  },
  {
    question: 'Can I customize the appearance and branding?',
    answer:
      'Yes! ConvoForms offers extensive customization options including custom colors, fonts, logos, and themes. You can match your brand perfectly and even add custom CSS for advanced styling. White-label options are available on higher plans.',
  },
  {
    question: 'How secure is my data?',
    answer:
      'We take security seriously with enterprise-grade encryption, GDPR compliance, SOC 2 certification, and regular security audits. Your data is encrypted in transit and at rest, with options for data residency and custom security configurations for enterprise customers.',
  },
  {
    question: 'What integrations are available?',
    answer:
      'ConvoForms integrates with 100+ tools including Zapier, Slack, HubSpot, Salesforce, Google Sheets, Mailchimp, and more. We also provide a robust API and webhooks for custom integrations. New integrations are added regularly based on user requests.',
  },
  {
    question: 'Is there a free plan available?',
    answer:
      'Yes! Our free plan includes 3 forms and 100 responses per month, perfect for getting started. You can upgrade anytime as your needs grow. All plans include core features like AI creation and conversational mode.',
  },
  {
    question: 'How do I embed forms on my website?',
    answer:
      'Forms can be embedded using a simple JavaScript snippet, iframe, or popup overlay. We provide multiple embedding options to fit your workflow, including WordPress plugins and no-code integrations for popular website builders.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Absolutely! You can export responses in multiple formats including CSV, Excel, JSON, and PDF. We also offer real-time data sync with your preferred tools and maintain complete data portability - your data is always yours.',
  },
  {
    question: 'What kind of support do you provide?',
    answer:
      'We offer email support for all users, priority support for paid plans, and dedicated success managers for enterprise customers. Our help center includes comprehensive documentation, video tutorials, and best practices guides.',
  },
  {
    question: 'How does pricing work for high-volume usage?',
    answer:
      'Our plans scale with your usage. For high-volume needs, we offer custom enterprise plans with volume discounts, dedicated infrastructure, and flexible billing options. Contact our sales team for personalized pricing.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
  };

  return (
    <section className='py-20 lg:py-32 bg-secondary/30'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6'>
            <HelpCircle className='w-4 h-4 mr-2' />
            Frequently Asked Questions
          </div>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>Everything you need to know</h2>
          <p className='text-lg text-muted-foreground'>
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        <div className='space-y-4'>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className='border rounded-xl bg-card overflow-hidden'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className='w-full p-6 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors'
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.includes(index)}
              >
                <h3 className='text-lg font-semibold pr-4'>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex-shrink-0'
                >
                  <ChevronDown className='w-5 h-5 text-muted-foreground' />
                </motion.div>
              </button>

              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <div className='px-6 pb-6 pt-0'>
                      <div className='border-t pt-4'>
                        <p className='text-muted-foreground leading-relaxed'>{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <p className='text-muted-foreground mb-4'>Still have questions?</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors'>
              Contact Support
            </button>
            <button className='px-6 py-3 border rounded-lg font-medium hover:bg-secondary transition-colors'>
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
