import type { AuthProvider } from "@/types/auth";

export const PROVIDER_LABELS: Record<
  AuthProvider,
  { label: string; className: string }
> = {
  google: {
    label: "Google",
    className: "bg-white text-[#191919] border border-gray-200",
  },
  kakao: {
    label: "카카오",
    className: "bg-[#FEE500] text-[#191919]",
  },
};
