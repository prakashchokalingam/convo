"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Play,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "HR Director",
    company: "TechCorp",
    companySize: "500+ employees",
    industry: "Technology",
    avatar: "SC",
    rating: 5,
    quote: "Our job application completion rate went from 23% to 78% after switching to conversational forms. Candidates love the personal touch, and we're getting much better quality applications.",
    results: {
      completionIncrease: "340%",
      timeSaved: "15 hours/week",
      satisfactionScore: "4.8/5"
    },
    videoThumbnail: true,
    featured: true
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    role: "Marketing Manager",
    company: "GrowthLab",
    companySize: "50-200 employees",
    industry: "Marketing Agency",
    avatar: "MR",
    rating: 5,
    quote: "We've tripled our lead quality since using Convo. The conversational approach gives us much richer customer data, and our sales team loves the qualified leads they're getting.",
    results: {
      completionIncrease: "287%",
      timeSaved: "8 hours/week",
      satisfactionScore: "4.9/5"
    },
    videoThumbnail: false,
    featured: false
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Practice Manager",
    company: "Wellness Clinic",
    companySize: "10-50 employees",
    industry: "Healthcare",
    avatar: "EW",
    rating: 5,
    quote: "Patients appreciate the human touch in our intake forms. It's reduced waiting room time by 40% and improved our care quality significantly. The patient satisfaction scores speak for themselves.",
    results: {
      completionIncrease: "410%",
      timeSaved: "12 hours/week",
      satisfactionScore: "4.7/5"
    },
    videoThumbnail: true,
    featured: false
  },
  {
    id: 4,
    name: "David Kim",
    role: "Operations Director",
    company: "MegaCorp",
    companySize: "1000+ employees",
    industry: "Enterprise",
    avatar: "DK",
    rating: 5,
    quote: "Convo has streamlined our entire onboarding process. New employees complete forms 3x faster than before, and our HR team can focus on what matters most - building relationships.",
    results: {
      completionIncrease: "312%",
      timeSaved: "25 hours/week",
      satisfactionScore: "4.9/5"
    },
    videoThumbnail: false,
    featured: true
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "E-commerce Director",
    company: "ShopSmart",
    companySize: "200-500 employees",
    industry: "Retail",
    avatar: "LP",
    rating: 5,
    quote: "Our customers now provide much more detailed feedback through our review forms. The insights have helped us improve our products and customer experience dramatically.",
    results: {
      completionIncrease: "245%",
      timeSaved: "6 hours/week",
      satisfactionScore: "4.8/5"
    },
    videoThumbnail: true,
    featured: false
  }
];

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            Customer Success Stories
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Loved by teams
            <span className="block text-primary">everywhere</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            See how organizations across industries are transforming their form experiences 
            and achieving remarkable results with Convo.
          </motion.p>
        </div>

        {/* Main Testimonial */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Testimonial Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border rounded-2xl p-8 shadow-lg relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="bg-primary rounded-full p-3">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6 mt-4">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{current.quote}"
                </blockquote>

                {/* Results */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-xl">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{current.results.completionIncrease}</div>
                    <div className="text-xs text-muted-foreground">Completion Boost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{current.results.timeSaved}</div>
                    <div className="text-xs text-muted-foreground">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{current.results.satisfactionScore}</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold">
                    {current.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{current.name}</div>
                    <div className="text-sm text-muted-foreground">{current.role}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="w-3 h-3" />
                      {current.company} • {current.companySize}
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {current.featured && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="w-10 h-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="w-10 h-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {currentTestimonial + 1} of {testimonials.length}
              </div>
            </div>
          </motion.div>

          {/* Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden border shadow-lg">
              {current.videoThumbnail ? (
                <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {!showVideo ? (
                    <>
                      <Button
                        size="lg"
                        onClick={() => setShowVideo(true)}
                        className="bg-white/90 text-primary hover:bg-white rounded-full w-16 h-16 p-0"
                      >
                        <Play className="w-8 h-8 ml-1" />
                      </Button>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                          <div className="font-medium">{current.name} shares their success story</div>
                          <div className="text-sm opacity-80">{current.company} • 3:24</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <div className="text-white text-center">
                        <Play className="w-16 h-16 mx-auto mb-4" />
                        <div>Video would play here</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVideo(false)}
                          className="mt-4"
                        >
                          Close Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                      {current.avatar}
                    </div>
                    <div className="font-semibold text-lg">{current.name}</div>
                    <div className="text-muted-foreground">{current.role} at {current.company}</div>
                    <div className="text-sm text-muted-foreground mt-2">{current.industry}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-12 border-t border-border"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold">50K+</span>
            </div>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-3xl font-bold">267%</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg. Completion Boost</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-3xl font-bold">4.8/5</span>
            </div>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="w-5 h-5 text-blue-500" />
              <span className="text-3xl font-bold">500+</span>
            </div>
            <p className="text-sm text-muted-foreground">Enterprise Customers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
