"use client";

import { motion } from 'framer-motion';

const customers = [
  { name: 'TechCorp', logo: 'TC' },
  { name: 'DataFlow', logo: 'DF' },
  { name: 'CloudSync', logo: 'CS' },
  { name: 'InnovateLab', logo: 'IL' },
  { name: 'NextGen Solutions', logo: 'NG' },
  { name: 'DigitalEdge', logo: 'DE' },
  { name: 'FutureWorks', logo: 'FW' },
  { name: 'StreamlineHQ', logo: 'SH' },
];

export function SocialProofSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm font-medium text-muted-foreground mb-8">
            Trusted by 50,000+ businesses worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="group relative">
                {/* Logo placeholder - in real implementation, these would be actual logos */}
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground font-bold text-sm group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary transition-all duration-300">
                  {customer.logo}
                </div>
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {customer.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-border"
        >
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">2M+</div>
            <p className="text-sm text-muted-foreground">Forms Created</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50K+</div>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">267%</div>
            <p className="text-sm text-muted-foreground">Avg. Conversion Boost</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
