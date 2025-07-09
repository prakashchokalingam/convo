'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/shared/ui/button';


const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Use Cases', href: '#use-cases' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Integrations', href: '#integrations' },
  { name: 'Resources', href: '#' },
];

export function NavigationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50'>
      <nav
        className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8'
        aria-label='Global'
      >
        {/* Logo */}
        <div className='flex lg:flex-1'>
          <Link href='/v2-sparrow-jot' className='-m-1.5 p-1.5 flex items-center space-x-2 group'>
            <div className='relative'>
              <div className='absolute inset-0 bg-primary/20 rounded-lg blur group-hover:bg-primary/30 transition-colors'></div>
              <div className='relative bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2'>
                <Sparkles className='h-6 w-6 text-white' />
              </div>
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
              Convo
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex lg:gap-x-8'>
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group'
            >
              {item.name}
              <span className='absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform'></span>
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4'>
          <Button variant='ghost' asChild>
            <Link href='/sign-in'>Sign In</Link>
          </Button>
          <Button
            asChild
            className='bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all'
          >
            <Link href='/sign-up' className='flex items-center gap-2'>
              Start Free Trial
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <Menu className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='lg:hidden fixed inset-0 z-50'
          >
            <div className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border'>
              <div className='flex items-center justify-between'>
                <Link href='/v2-sparrow-jot' className='-m-1.5 p-1.5 flex items-center space-x-2'>
                  <div className='bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2'>
                    <Sparkles className='h-6 w-6 text-white' />
                  </div>
                  <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                    Convo
                  </span>
                </Link>
                <button
                  type='button'
                  className='-m-2.5 rounded-md p-2.5 text-muted-foreground hover:text-foreground'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className='sr-only'>Close menu</span>
                  <X className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='mt-6 flow-root'>
                <div className='-my-6 divide-y divide-border'>
                  <div className='space-y-2 py-6'>
                    {navigation.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className='-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className='py-6 space-y-4'>
                    <Button variant='ghost' className='w-full' asChild>
                      <Link href='/sign-in'>Sign In</Link>
                    </Button>
                    <Button className='w-full bg-primary hover:bg-primary/90' asChild>
                      <Link href='/sign-up'>Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
