"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type SajuLoadingOverlayProps = {
  isLoading: boolean;
  loadingMsgIdx: number;
  loadingMessages: string[];
};

const SajuLoadingOverlay = ({
  isLoading,
  loadingMsgIdx,
  loadingMessages,
}: SajuLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 mx-auto max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="mb-8"
          >
            <Loader2 className="w-16 h-16 text-red-600" />
          </motion.div>

          <motion.p
            key={loadingMsgIdx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-2xl font-black text-center text-white text-neon-red"
          >
            {loadingMessages[loadingMsgIdx]}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SajuLoadingOverlay;
