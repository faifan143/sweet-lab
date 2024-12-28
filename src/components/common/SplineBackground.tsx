/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-emerald-400/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const FloatingShapes = ({ type }: { type: string }) => {
  const shapes = {
    بسطة: [
      "M0 0L30 0L15 30Z", // Triangle
      "M0 0H30V30H0Z", // Square
      "M15 0L30 30H0Z", // Inverted Triangle
    ],
    جامعة: [
      "M0 15C0 6.716 6.716 0 15 0C23.284 0 30 6.716 30 15C30 23.284 23.284 30 15 30C6.716 30 0 23.284 0 15Z", // Circle
      "M0 0L30 0L15 30Z", // Triangle
      "M0 0H30V30H0Z", // Square
    ],
    عام: [
      "M15 0L30 30H0Z", // Inverted Triangle
      "M0 15C0 6.716 6.716 0 15 0C23.284 0 30 6.716 30 15C30 23.284 23.284 30 15 30C6.716 30 0 23.284 0 15Z", // Circle
      "M0 0L30 0L15 30Z", // Triangle
    ],
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {
        //   @ts-ignore
        shapes[type]?.map((path, i) => (
          <motion.svg
            key={i}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 0.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <path d={path} fill="currentColor" className="text-emerald-400/5" />
          </motion.svg>
        ))
      }
    </div>
  );
};

const SplineBackground = ({ activeTab }: { activeTab: string }) => {
  const styles = {
    gradient: "from-slate-900 via-emerald-900/20 to-slate-900",
    highlightColor: "rgba(52,211,153,0.05)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-0"
    >
      {/* Base gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`}
      />

      {/* Radial overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--highlight-color),transparent_50%)]"
        style={{ "--highlight-color": styles.highlightColor } as any}
      />

      {/* Animated elements */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ParticleEffect />
          <FloatingShapes type={activeTab} />
        </motion.div>
      </AnimatePresence>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />
    </motion.div>
  );
};

export default SplineBackground;
