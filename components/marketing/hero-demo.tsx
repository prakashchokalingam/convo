"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/shared/ui/button";
import { Play, Pause, Volume2, Maximize } from "lucide-react";

export function HeroDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          {/* Video Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 shadow-2xl">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Mock Browser UI */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700 rounded px-3 py-1 text-sm text-gray-300">
                      convo.ai/demo
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-primary/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-12 h-12 text-primary ml-1" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    See ConvoForms in Action
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Watch how AI transforms a simple form description into an engaging conversational experience
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isPlaying ? "Pause Demo" : "Play Demo"}
                  </Button>
                </div>
              </div>

              {/* Animated Elements */}
              <motion.div
                className="absolute top-20 left-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="text-white text-sm">
                  <div className="font-semibold mb-1">AI Analysis</div>
                  <div className="text-gray-300">Processing form requirements...</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-20 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="text-white text-sm">
                  <div className="font-semibold mb-1">Conversion Rate</div>
                  <div className="text-green-400 font-bold">+267% ↗</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <div className="text-white text-sm text-center">
                  <div className="font-semibold mb-1">Form Created</div>
                  <div className="text-gray-300">Ready for deployment ✨</div>
                </div>
              </motion.div>
            </div>

            {/* Video Controls Overlay */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3"
              >
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPlaying(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <motion.div
                      className="bg-primary h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 10, ease: "linear" }}
                    />
                  </div>
                  
                  <div className="text-white text-sm">2:30</div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Floating Stats */}
          <motion.div
            className="absolute -bottom-6 left-8 bg-card border rounded-xl p-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.3s</div>
              <div className="text-sm text-muted-foreground">Build Time</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 right-8 bg-card border rounded-xl p-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </motion.div>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              title: "AI Form Generation",
              description: "Describe your form in natural language and watch AI build it instantly",
              time: "0:15"
            },
            {
              title: "Conversational Mode",
              description: "Transform static forms into engaging conversations with one click",
              time: "0:45"
            },
            {
              title: "Real-time Analytics",
              description: "See completion rates and user behavior insights as they happen",
              time: "1:30"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
            >
              <div className="text-sm text-primary font-medium mb-2">{feature.time}</div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}