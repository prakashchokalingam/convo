'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeToggle } from '@/components/shared/theme/theme-toggle';
import { Button } from '@/components/shared/ui/button';
import { getLoginUrl, getSignupUrl } from '@/lib/subdomain';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center space-x-8'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center'>
              <span className='text-primary-foreground font-bold text-lg'>C</span>
            </div>
            <span className='text-xl font-semibold'>Convo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-8'>
            <div className='relative group'>
              <button
                className='flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                onMouseEnter={() => setIsProductDropdownOpen(true)}
                onMouseLeave={() => setIsProductDropdownOpen(false)}
              >
                <span>Product</span>
                <ChevronDown className='w-4 h-4' />
              </button>
              {isProductDropdownOpen && (
                <div
                  className='absolute top-full left-0 w-64 bg-background border rounded-lg shadow-lg py-2 mt-1'
                  onMouseEnter={() => setIsProductDropdownOpen(true)}
                  onMouseLeave={() => setIsProductDropdownOpen(false)}
                >
                  <Link href='/features' className='block px-4 py-2 text-sm hover:bg-secondary'>
                    <div className='font-medium'>Features</div>
                    <div className='text-muted-foreground text-xs'>Explore all capabilities</div>
                  </Link>
                  <Link href='/integrations' className='block px-4 py-2 text-sm hover:bg-secondary'>
                    <div className='font-medium'>Integrations</div>
                    <div className='text-muted-foreground text-xs'>Connect with your tools</div>
                  </Link>
                  <Link href='/api' className='block px-4 py-2 text-sm hover:bg-secondary'>
                    <div className='font-medium'>API</div>
                    <div className='text-muted-foreground text-xs'>Build custom solutions</div>
                  </Link>
                </div>
              )}
            </div>
            <Link
              href='/pricing'
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            >
              Pricing
            </Link>
            <Link
              href='/docs'
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            >
              Docs
            </Link>
            <Link
              href='/blog'
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            >
              Blog
            </Link>
            <Link
              href='/help'
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            >
              Help
            </Link>
          </nav>
        </div>

        {/* Right side */}
        <div className='flex items-center space-x-4'>
          <ThemeToggle />

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center space-x-3'>
            <Button variant='ghost' size='sm' asChild>
              <Link href={getLoginUrl()}>Sign In</Link>
            </Button>
            <Button size='sm' className='shadow-sm' asChild>
              <Link href={getSignupUrl()}>Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='lg:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className='lg:hidden border-t bg-background'>
          <div className='container py-4 space-y-4'>
            <nav className='space-y-2'>
              <Link href='/features' className='block py-2 text-sm font-medium'>
                Features
              </Link>
              <Link href='/pricing' className='block py-2 text-sm font-medium'>
                Pricing
              </Link>
              <Link href='/docs' className='block py-2 text-sm font-medium'>
                Docs
              </Link>
              <Link href='/blog' className='block py-2 text-sm font-medium'>
                Blog
              </Link>
              <Link href='/help' className='block py-2 text-sm font-medium'>
                Help
              </Link>
            </nav>
            <div className='pt-4 border-t space-y-2'>
              <Button variant='outline' className='w-full' asChild>
                <Link href='https://app.convoforms.com/sign-in'>Sign In</Link>
              </Button>
              <Button className='w-full' asChild>
                <Link href='https://app.convoforms.com/sign-up'>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
