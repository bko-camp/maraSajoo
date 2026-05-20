export const readTossPaymentAmount = (): number => {
  const n = Number(process.env.NEXT_PUBLIC_TOSS_PAYMENT_AMOUNT);
  return Number.isFinite(n) && n > 0 ? n : 990;
};

export const TOSS_PAYMENT_AMOUNT = readTossPaymentAmount();
export const TOSS_ORDER_NAME =
  process.env.NEXT_PUBLIC_TOSS_ORDER_NAME?.trim() || "마라맛 사주 폭탄 제거 2026";
export const TOSS_ORDER_ID_PREFIX =
  process.env.NEXT_PUBLIC_TOSS_ORDER_ID_PREFIX?.trim() || "MARA_";
export const TOSS_AGREEMENT_VARIANT_KEY =
  process.env.NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY?.trim() || "AGREEMENT";
