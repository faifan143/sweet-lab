"use client";
import { motion } from "framer-motion";

// Page Title Component
export const PageTitle = () => (
  <div className="container mx-auto px-4 mb-12">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold text-white mb-4">
        المستودع - المشتريات الخام
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full" />
    </motion.div>
  </div>
);
