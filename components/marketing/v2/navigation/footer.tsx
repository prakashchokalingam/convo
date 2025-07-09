'use client';

import { Sparkles, Twitter, Github, Linkedin, ArrowUp } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/shared/ui/button';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Templates', href: '/templates' },
    { name: 'API', href: '/api' },
    { name: 'Changelog', href: '/changelog' },
  ],
  'Use Cases': [
    { name: 'HR & Recruiting', href: '/use-cases/hr' },
    { name: 'Marketing', href: '/use-cases/marketing' },
    { name: 'Customer Support', href: '/use-cases/support' },
    { name: 'Healthcare', href: '/use-cases/healthcare' },
    { name: 'Education', href: '/use-cases/education' },
    { name: 'Enterprise', href: '/use-cases/enterprise' },
  ],
  Resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Community', href: '/community' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Security', href: '/security' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Status', href: 'https://status.convo.ai' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/convoai' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/convoai' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/convoai' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='bg-muted/30 border-t border-border'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Newsletter Subscription */}
        <div className='py-12 border-b border-border'>
          <div className='text-center max-w-2xl mx-auto'>
            <h3 className='text-2xl font-bold mb-4'>Stay updated with Convo</h3>
            <p className='text-muted-foreground mb-6'>
              Get the latest product updates, best practices, and industry insights delivered to
              your inbox.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              />
              <Button className='bg-primary hover:bg-primary/90'>Subscribe</Button>
            </div>
            <p className='text-xs text-muted-foreground mt-3'>No spam, unsubscribe at any time.</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className='py-12'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
            {/* Company Info */}
            <div className='col-span-2 md:col-span-3 lg:col-span-1'>
              <Link href='/v2-sparrow-jot' className='flex items-center space-x-2 mb-6'>
                <div className='bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2'>
                  <Sparkles className='h-6 w-6 text-white' />
                </div>
                <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                  Convo
                </span>
              </Link>
              <p className='text-sm text-muted-foreground mb-6 max-w-sm'>
                Building the future of form experiences with AI-powered conversational forms that
                actually convert.
              </p>

              {/* Social Links */}
              <div className='flex space-x-4'>
                {socialLinks.map(social => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className='text-muted-foreground hover:text-foreground transition-colors'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Icon className='h-5 w-5' />
                      <span className='sr-only'>{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className='font-semibold mb-4'>{category}</h4>
                <ul className='space-y-3'>
                  {links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className='py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground'>
            <p>&copy; 2024 Convo. All rights reserved.</p>
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-2'>🌍 Available worldwide</span>
              <span className='flex items-center gap-2'>⚡ 99.9% uptime</span>
              <span className='flex items-center gap-2'>🔒 SOC 2 certified</span>
            </div>
          </div>

          {/* Scroll to top */}
          <Button
            variant='outline'
            size='sm'
            onClick={scrollToTop}
            className='flex items-center gap-2'
          >
            Back to top
            <ArrowUp className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </footer>
  );
}
