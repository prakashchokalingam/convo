"use client";

import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Globe,
  Award,
  Clock,
  CheckCircle,
  Server,
  UserCheck,
  FileCheck,
  Zap
} from 'lucide-react';

const trustCategories = [
  {
    title: 'Security & Privacy',
    icon: Shield,
    color: 'from-green-500 to-green-600',
    items: [
      {
        title: 'SOC 2 Type II Certified',
        description: 'Audited annually for security controls',
        icon: Award
      },
      {
        title: 'GDPR & CCPA Compliant',
        description: 'Full compliance with privacy regulations',
        icon: FileCheck
      },
      {
        title: 'End-to-End Encryption',
        description: 'AES-256 encryption for all data in transit and at rest',
        icon: Lock
      },
      {
        title: 'SSO & SAML Support',
        description: 'Enterprise-grade authentication options',
        icon: UserCheck
      }
    ]
  },
  {
    title: 'Reliability & Performance',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    items: [
      {
        title: '99.9% Uptime SLA',
        description: 'Guaranteed availability with monitoring',
        icon: Clock
      },
      {
        title: 'Global CDN',
        description: 'Lightning-fast loading worldwide',
        icon: Globe
      },
      {
        title: 'Auto-scaling Infrastructure',
        description: 'Handles traffic spikes automatically',
        icon: Server
      },
      {
        title: '24/7 Monitoring',
        description: 'Proactive system health monitoring',
        icon: CheckCircle
      }
    ]
  }
];

const certifications = [
  {
    name: 'SOC 2',
    logo: 'S2',
    description: 'Type II Certified'
  },
  {
    name: 'GDPR',
    logo: 'GD',
    description: 'Compliant'
  },
  {
    name: 'CCPA',
    logo: 'CC',
    description: 'Compliant'
  },
  {
    name: 'ISO 27001',
    logo: 'ISO',
    description: 'Certified'
  },
  {
    name: 'HIPAA',
    logo: 'HP',
    description: 'Ready'
  }
];

const stats = [
  {
    value: '99.9%',
    label: 'Uptime',
    sublabel: 'Last 12 months'
  },
  {
    value: '&lt; 100ms',
    label: 'Response Time',
    sublabel: 'Global average'
  },
  {
    value: '256-bit',
    label: 'Encryption',
    sublabel: 'AES standard'
  },
  {
    value: '24/7',
    label: 'Security Monitoring',
    sublabel: 'Always protected'
  }
];

export function TrustIndicatorsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium mb-6"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security & Trust
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Enterprise-grade
            <span className="block text-primary">security you can trust</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Your data security is our top priority. We're committed to maintaining the highest standards 
            of security, compliance, and reliability for your peace of mind.
          </motion.p>
        </div>

        {/* Trust Categories */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {trustCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
                className="bg-card border rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>

                <div className="grid gap-6">
                  {category.items.map((item, itemIndex) => {
                    const ItemIcon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: (categoryIndex * 0.2) + (itemIndex * 0.1) }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
                      >
                        <div className="bg-card border rounded-lg p-2 flex-shrink-0">
                          <ItemIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-xl font-bold text-center mb-8">Certifications & Compliance</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-card border rounded-xl flex items-center justify-center text-muted-foreground font-bold text-sm mx-auto mb-3 group-hover:border-primary group-hover:text-primary transition-all">
                  {cert.logo}
                </div>
                <h4 className="font-semibold text-sm">{cert.name}</h4>
                <p className="text-xs text-muted-foreground">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Additional Security Features</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Two-factor authentication',
              'Role-based access control',
              'Activity audit logs',
              'Data residency options',
              'Regular security updates',
              'Penetration testing',
              'Backup & disaster recovery',
              'Data anonymization',
              'IP whitelisting'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Questions about our security?</h3>
          <p className="text-muted-foreground mb-6">
            Our security team is here to help. Review our detailed security documentation 
            or schedule a call to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              View Security Docs
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
              Schedule Security Call
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
