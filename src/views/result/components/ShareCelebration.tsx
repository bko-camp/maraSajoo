"use client";

import { AnimatePresence, motion } from "framer-motion";

type ShareCelebrationProps = {
  show: boolean;
};

const ShareCelebration = ({ show }: ShareCelebrationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] max-w-md mx-auto overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                left: "50%",
                bottom: "-10%",
                scale: 0,
              }}
              animate={{
                opacity: 0,
                left: `${Math.random() * 100}%`,
                bottom: `${50 + Math.random() * 50}%`,
                scale: Math.random() * 2 + 1,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5 + Math.random() * 1,
                ease: "easeOut",
              }}
              className={`absolute w-3 h-3 rounded-full ${
                ["bg-yellow-400", "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"][
                  Math.floor(Math.random() * 5)
                ]
              }`}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareCelebration;
