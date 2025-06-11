"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/button';
import { Slider } from '@/components/shared/ui/slider';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function ROICalculatorSection() {
  const [monthlyForms, setMonthlyForms] = useState([500]);
  const [currentCompletion, setCurrentCompletion] = useState([25]);
  const [valuePerResponse, setValuePerResponse] = useState([50]);
  const [results, setResults] = useState({
    currentRevenue: 0,
    newRevenue: 0,
    monthlyIncrease: 0,
    yearlyIncrease: 0,
    roi: 0
  });

  useEffect(() => {
    const forms = monthlyForms[0];
    const completion = currentCompletion[0] / 100;
    const value = valuePerResponse[0];
    
    // Current revenue
    const currentRevenue = forms * completion * value;
    
    // New completion rate (conservative 2.5x improvement)
    const newCompletion = Math.min(completion * 2.5, 0.9); // Cap at 90%
    const newRevenue = forms * newCompletion * value;
    
    const monthlyIncrease = newRevenue - currentRevenue;
    const yearlyIncrease = monthlyIncrease * 12;
    
    // ROI calculation (assuming $49/month cost)
    const annualCost = 49 * 12;
    const roi = ((yearlyIncrease - annualCost) / annualCost) * 100;

    setResults({
      currentRevenue,
      newRevenue,
      monthlyIncrease,
      yearlyIncrease,
      roi
    });
  }, [monthlyForms, currentCompletion, valuePerResponse]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

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
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm font-medium mb-6"
          >
            <Calculator className="w-4 h-4 mr-2" />
            ROI Calculator
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Calculate your potential
            <span className="block text-primary">revenue increase</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            See how much additional revenue you could generate by improving your form completion rates with Convo.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Target className="w-5 h-5 text-primary" />
              </div>
              Your Current Metrics
            </h3>

            <div className="space-y-8">
              
              {/* Monthly Forms */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Monthly Form Submissions
                </label>
                <div className="px-4">
                  <Slider
                    value={monthlyForms}
                    onValueChange={setMonthlyForms}
                    max={5000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>100</span>
                  <span className="font-medium">{formatNumber(monthlyForms[0])}</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Current Completion Rate */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Current Completion Rate (%)
                </label>
                <div className="px-4">
                  <Slider
                    value={currentCompletion}
                    onValueChange={setCurrentCompletion}
                    max={80}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>5%</span>
                  <span className="font-medium">{currentCompletion[0]}%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Value Per Response */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Value per Form Response ($)
                </label>
                <div className="px-4">
                  <Slider
                    value={valuePerResponse}
                    onValueChange={setValuePerResponse}
                    max={500}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>$10</span>
                  <span className="font-medium">${valuePerResponse[0]}</span>
                  <span>$500</span>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="mt-8 p-4 bg-muted rounded-xl">
              <h4 className="font-semibold mb-3 text-sm">Calculation Assumptions:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>2.5x average completion rate improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Conservative estimates based on real customer data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Pro plan cost: $49/month</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Current vs New Revenue */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="bg-green-500 rounded-lg p-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Revenue Impact
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground mb-1">
                    {formatCurrency(results.currentRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(results.newRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">With Convo</div>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-xl p-4 border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(results.monthlyIncrease)}
                  </div>
                  <div className="text-sm text-muted-foreground">Additional Monthly Revenue</div>
                </div>
              </div>
            </div>

            {/* Annual Impact */}
            <div className="bg-card border rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                Annual Impact
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                  <span className="font-medium">Additional Annual Revenue</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(results.yearlyIncrease)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                  <span className="font-medium">Annual Convo Cost</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(588)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <span className="font-medium text-green-700 dark:text-green-300">Return on Investment</span>
                  <span className="text-2xl font-bold text-green-600">
                    {results.roi > 0 ? `${Math.round(results.roi)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Ready to unlock this potential?</h3>
              <p className="mb-6 opacity-90">
                Start your free trial today and see the results within the first week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-border"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">50K+</span>
            </div>
            <p className="text-sm text-muted-foreground">Customers using our calculator</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">267%</span>
            </div>
            <p className="text-sm text-muted-foreground">Average completion increase</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">2 weeks</span>
            </div>
            <p className="text-sm text-muted-foreground">Average time to see results</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">2.8M+</span>
            </div>
            <p className="text-sm text-muted-foreground">Additional revenue generated</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
