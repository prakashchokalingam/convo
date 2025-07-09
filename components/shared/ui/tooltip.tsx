'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  delay = 300,
  className,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled || !content.trim()) {return;}
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getTooltipClasses = () => {
    const baseClasses =
      'absolute z-[60] px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-xs backdrop-blur-sm';

    switch (side) {
      case 'top':
        return cn(baseClasses, 'bottom-full left-1/2 transform -translate-x-1/2 mb-2', className);
      case 'bottom':
        return cn(baseClasses, 'top-full left-1/2 transform -translate-x-1/2 mt-2', className);
      case 'left':
        return cn(baseClasses, 'right-full top-1/2 transform -translate-y-1/2 mr-2', className);
      case 'right':
        return cn(baseClasses, 'left-full top-1/2 transform -translate-y-1/2 ml-2', className);
      default:
        return cn(baseClasses, className);
    }
  };

  const getArrowClasses = () => {
    const baseArrowClasses = 'absolute w-0 h-0';

    switch (side) {
      case 'top':
        return cn(
          baseArrowClasses,
          'top-full left-1/2 transform -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900'
        );
      case 'bottom':
        return cn(
          baseArrowClasses,
          'bottom-full left-1/2 transform -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-gray-900'
        );
      case 'left':
        return cn(
          baseArrowClasses,
          'left-full top-1/2 transform -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-transparent border-l-gray-900'
        );
      case 'right':
        return cn(
          baseArrowClasses,
          'right-full top-1/2 transform -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-900'
        );
      default:
        return baseArrowClasses;
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative inline-block'
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            ref={tooltipRef}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0,
              x: side === 'left' ? 10 : side === 'right' ? -10 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0,
              x: side === 'left' ? 10 : side === 'right' ? -10 : 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={getTooltipClasses()}
          >
            <div className='break-words leading-relaxed'>{content}</div>
            <div className={getArrowClasses()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
