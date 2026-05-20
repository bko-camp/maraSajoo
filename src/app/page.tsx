"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSajuAnalysis } from "@/hooks";
import { AUTH_LOGIN_PATH } from "@/lib/auth-guide";
import { useSajuPendingStore } from "@/stores";
import { toSajuFormPayload, type SajuFormInput } from "@/types/saju";

const SAJU_RESUME_LOCK_KEY = "mara-saju-resume-lock";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const { analyze, isLoading, loadingMsgIdx, loadingMessages } = useSajuAnalysis();
  const setPending = useSajuPendingStore((s) => s.setPending);
  const clearPending = useSajuPendingStore((s) => s.clearPending);
  const hasResumed = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SajuFormInput>({
    defaultValues: {
      gender: "여",
      isTimeUnknown: false,
    },
  });

  const isTimeUnknown = watch("isTimeUnknown");

  useEffect(() => {
    if (status !== "authenticated") return;

    const tryResume = () => {
      const pending = useSajuPendingStore.getState().pending;
      if (!pending || hasResumed.current || isLoading) return;
      if (sessionStorage.getItem(SAJU_RESUME_LOCK_KEY)) return;

      sessionStorage.setItem(SAJU_RESUME_LOCK_KEY, "1");
      hasResumed.current = true;
      analyze(pending).then((ok) => {
        sessionStorage.removeItem(SAJU_RESUME_LOCK_KEY);
        if (ok) clearPending();
        else hasResumed.current = false;
      });
    };

    if (useSajuPendingStore.persist.hasHydrated()) {
      tryResume();
      return;
    }

    return useSajuPendingStore.persist.onFinishHydration(tryResume);
  }, [status, isLoading, analyze, clearPending]);

  const onSubmit = async (data: SajuFormInput) => {
    if (status === "loading") return;

    const payload = toSajuFormPayload(data);

    if (status !== "authenticated") {
      setPending(payload);
      router.push(AUTH_LOGIN_PATH);
      return;
    }

    await analyze(payload);
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 relative">
      {/* 1. Hero Section */}
      <div className="text-center mb-10 mt-8 pt-10">
        <h1
          className="text-5xl font-black mb-4 tracking-tighter text-glitch"
          data-text="마라맛 보살"
        >
          마라맛 보살
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          &quot;어차피 망한 인생, 팩트폭행이나 맞고 가라.&quot;
        </p>
      </div>

      {/* 2. Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col z-10">

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">이름</label>
          <input
            {...register("name", { required: "이름을 입력해라." })}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="홍길동"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Gender Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">성별</label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => field.onChange("여")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${field.value === "여" ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-gray-400"
                    }`}
                >
                  여자
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("남")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${field.value === "남" ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-gray-400"
                    }`}
                >
                  남자
                </button>
              </div>
            )}
          />
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">생년월일</label>
          <div className="flex gap-2 relative">
            <select
              {...register("birthYear", { required: true })}
              className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
            >
              <option value="">년도</option>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select
              {...register("birthMonth", { required: true })}
              className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
            <select
              {...register("birthDay", { required: true })}
              className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
            >
              <option value="">일</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>
          {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
            <p className="text-red-500 text-xs mt-1">생년월일을 모두 선택해라.</p>
          )}
        </div>

        {/* Birth Time */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">태어난 시간</label>
          <div className="flex gap-4 items-center">
            <select
              {...register("birthTime")}
              disabled={isTimeUnknown}
              className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 disabled:opacity-50 transition-colors appearance-none"
            >
              <option value="">시간 선택</option>
              <option value="자시">자시 (23:30 ~ 01:29)</option>
              <option value="축시">축시 (01:30 ~ 03:29)</option>
              <option value="인시">인시 (03:30 ~ 05:29)</option>
              <option value="묘시">묘시 (05:30 ~ 07:29)</option>
              <option value="진시">진시 (07:30 ~ 09:29)</option>
              <option value="사시">사시 (09:30 ~ 11:29)</option>
              <option value="오시">오시 (11:30 ~ 13:29)</option>
              <option value="미시">미시 (13:30 ~ 15:29)</option>
              <option value="신시">신시 (15:30 ~ 17:29)</option>
              <option value="유시">유시 (17:30 ~ 19:29)</option>
              <option value="술시">술시 (19:30 ~ 21:29)</option>
              <option value="해시">해시 (21:30 ~ 23:29)</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 whitespace-nowrap">
              <input
                type="checkbox"
                {...register("isTimeUnknown")}
                className="w-5 h-5 accent-red-600 rounded"
              />
              모름
            </label>
          </div>
        </div>

        <div className="flex-1" />

        {/* CTA Button */}
        <button
          type="submit"
          disabled={status === "loading" || isLoading}
          className="w-full bg-red-600 text-white font-black text-lg py-5 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-60 disabled:animate-none"
        >
          내 인생 팩폭 맞기 🔥
        </button>
      </form>

      {/* 3. Loading Overlay */}
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

    </div>
  );
}
