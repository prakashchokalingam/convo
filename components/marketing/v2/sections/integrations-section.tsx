'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight, ExternalLink, Search, Filter } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/shared/ui/button';


const integrationCategories = [
  {
    id: 'productivity',
    name: 'Productivity',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'crm',
    name: 'CRM & Sales',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'communication',
    name: 'Communication',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'automation',
    name: 'Automation',
    color: 'from-pink-500 to-pink-600',
  },
];

const integrations = [
  {
    name: 'Slack',
    category: 'communication',
    logo: 'SL',
    description: 'Get instant notifications when forms are completed',
    popular: true,
  },
  {
    name: 'HubSpot',
    category: 'crm',
    logo: 'HS',
    description: 'Sync leads and contacts automatically',
    popular: true,
  },
  {
    name: 'Google Sheets',
    category: 'productivity',
    logo: 'GS',
    description: 'Export responses to spreadsheets in real-time',
    popular: true,
  },
  {
    name: 'Zapier',
    category: 'automation',
    logo: 'ZP',
    description: 'Connect with 5,000+ apps automatically',
    popular: true,
  },
  {
    name: 'Salesforce',
    category: 'crm',
    logo: 'SF',
    description: 'Seamlessly sync with your sales pipeline',
    popular: false,
  },
  {
    name: 'Microsoft Teams',
    category: 'communication',
    logo: 'MT',
    description: 'Share form updates with your team',
    popular: false,
  },
  {
    name: 'Google Analytics',
    category: 'analytics',
    logo: 'GA',
    description: 'Track form performance and conversions',
    popular: false,
  },
  {
    name: 'Mailchimp',
    category: 'automation',
    logo: 'MC',
    description: 'Add subscribers to email campaigns',
    popular: true,
  },
  {
    name: 'Notion',
    category: 'productivity',
    logo: 'NT',
    description: 'Create database entries from form responses',
    popular: false,
  },
  {
    name: 'Discord',
    category: 'communication',
    logo: 'DS',
    description: 'Post updates to Discord channels',
    popular: false,
  },
  {
    name: 'Airtable',
    category: 'productivity',
    logo: 'AT',
    description: 'Organize responses in powerful databases',
    popular: false,
  },
  {
    name: 'Zendesk',
    category: 'crm',
    logo: 'ZD',
    description: 'Create support tickets from form submissions',
    popular: false,
  },
];

export function IntegrationsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularIntegrations = integrations.filter(integration => integration.popular);

  return (
    <section id='integrations' className='py-20 lg:py-32'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium mb-6'
          >
            <Zap className='w-4 h-4 mr-2' />
            Integrations
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'
          >
            Connect with your
            <span className='block text-primary'>favorite tools</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-muted-foreground max-w-3xl mx-auto'
          >
            Seamlessly integrate Convo with your existing workflow. From CRM to communication tools,
            we have got you covered with 100+ native integrations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mb-16'
        >
          <h3 className='text-xl font-semibold mb-8 text-center'>Most Popular Integrations</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {popularIntegrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-card border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group cursor-pointer'
              >
                <div className='w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground font-bold text-sm mx-auto mb-4 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary transition-all'>
                  {integration.logo}
                </div>
                <h4 className='font-semibold mb-2'>{integration.name}</h4>
                <p className='text-sm text-muted-foreground'>{integration.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className='bg-muted/30 rounded-2xl p-8'>
          <div className='flex flex-col lg:flex-row gap-6 mb-8'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
              <input
                type='text'
                placeholder='Search integrations...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>

            <div className='flex gap-2 flex-wrap lg:flex-nowrap'>
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedCategory('all')}
                className='flex items-center gap-2'
              >
                <Filter className='w-4 h-4' />
                All
              </Button>
              {integrationCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredIntegrations.map((integration, index) => {
              const category = integrationCategories.find(cat => cat.id === integration.category);
              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-300 group cursor-pointer'
                >
                  <div className='flex items-start gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground font-bold text-xs group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary transition-all'>
                      {integration.logo}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold truncate'>{integration.name}</h4>
                        {integration.popular && (
                          <span className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full'>
                            Popular
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground mb-2'>
                        {integration.description}
                      </p>
                      <div
                        className={`inline-flex items-center text-xs px-2 py-1 rounded-full bg-gradient-to-r ${category?.color} text-white`}
                      >
                        {category?.name}
                      </div>
                    </div>
                    <ExternalLink className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors' />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className='text-center py-12'>
              <div className='text-muted-foreground mb-4'>No integrations found</div>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20'>
            <h3 className='text-2xl font-bold mb-4'>Need a custom integration?</h3>
            <p className='text-muted-foreground mb-6'>
              Our powerful API and webhooks make it easy to connect with any tool. Plus, our team
              can help build custom integrations for Enterprise customers.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='bg-primary hover:bg-primary/90'>
                View API Docs
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button size='lg' variant='outline'>
                Request Integration
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-border'
        >
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>100+</div>
            <p className='text-sm text-muted-foreground'>Native Integrations</p>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>5,000+</div>
            <p className='text-sm text-muted-foreground'>Zapier Connections</p>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>99.9%</div>
            <p className='text-sm text-muted-foreground'>Integration Uptime</p>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>&lt; 5min</div>
            <p className='text-sm text-muted-foreground'>Setup Time</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
