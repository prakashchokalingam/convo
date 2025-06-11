'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, MousePointer2, Sparkles } from 'lucide-react'

export function EmptyCanvas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-8"
    >
      <div className="max-w-md mx-auto">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 mx-auto empty-state-icon rounded-full flex items-center justify-center">
            <Plus className="h-12 w-12" />
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-6 w-6 text-warning" />
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [-5, 5, -5],
              y: [5, -5, 5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-2 -left-2"
          >
            <MousePointer2 className="h-5 w-5 text-primary" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Start Building Your Form
          </h3>
          <p className="text-muted-foreground mb-6">
            Drag fields from the library on the left to begin creating your form. 
            You can reorder, customize, and configure each field as needed.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 text-left">
            <div className="flex-shrink-0 w-6 h-6 empty-state-step rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Choose a field type</p>
              <p className="text-xs text-muted-foreground">Browse the field library and select what you need</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 text-left">
            <div className="flex-shrink-0 w-6 h-6 empty-state-step rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Drag it to the canvas</p>
              <p className="text-xs text-muted-foreground">Drop the field anywhere in this area</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 text-left">
            <div className="flex-shrink-0 w-6 h-6 empty-state-step rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Customize and configure</p>
              <p className="text-xs text-muted-foreground">Use the properties panel to set labels, validations, and more</p>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="inline-flex items-center space-x-2 text-sm empty-state-cta px-4 py-2 rounded-full">
            <MousePointer2 className="h-4 w-4" />
            <span>Get started by dragging a field from the left panel</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}