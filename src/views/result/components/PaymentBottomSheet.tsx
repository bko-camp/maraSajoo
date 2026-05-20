"use client";

import { AnimatePresence, motion } from "framer-motion";

import { TOSS_PAYMENT_AMOUNT } from "@/constants/payment";

type PaymentBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequestPayment: () => void;
};

const PaymentBottomSheet = ({
  isOpen,
  onClose,
  onRequestPayment,
}: PaymentBottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 max-w-md mx-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl p-6 z-50 shadow-2xl h-[75vh] overflow-y-auto"
          >
            <h3 className="text-black font-black text-2xl mb-4">
              복비 결제 ({TOSS_PAYMENT_AMOUNT.toLocaleString("ko-KR")}원)
            </h3>
            <div id="payment-method" className="w-full" />
            <div id="agreement" className="w-full mb-6" />
            <button
              type="button"
              onClick={onRequestPayment}
              className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg"
            >
              결제하기
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentBottomSheet;
