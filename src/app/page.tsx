"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

type FormData = {
  name: string;
  gender: "남" | "여";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthTime: string;
  isTimeUnknown: boolean;
};

const LOADING_MESSAGES = [
  "신내림 받는 중...",
  "너의 망한 팔자 스캔 중...",
  "어휴... 한숨부터 나오네...",
  "거의 다 왔어, 각오해라...",
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      gender: "여",
      isTimeUnknown: false,
    },
  });

  const isTimeUnknown = watch("isTimeUnknown");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const formattedData = {
      ...data,
      birthDate: `${data.birthYear}-${String(data.birthMonth).padStart(2, '0')}-${String(data.birthDay).padStart(2, '0')}`
    };

    // Start loading messages cycle
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);

    try {
      // 1. Send data to our API route
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      // 2. Minimum 3 seconds artificial delay for dopamine buildup
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(interval);

      if (result.id) {
        // 3. Move to result page
        router.push(`/result/${result.id}`);
      } else {
        alert("사주 분석에 실패했습니다. 다시 시도해주세요.");
        setIsLoading(false);
      }

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsLoading(false);
      alert("서버 오류가 발생했습니다.");
    }
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
          "어차피 망한 인생, 팩트폭행이나 맞고 가라."
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
          className="w-full bg-red-600 text-white font-black text-lg py-5 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] transition-transform active:scale-95"
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
              key={loadingMsgIdx} // Re-animate on text change
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-2xl font-black text-center text-white text-neon-red"
            >
              {LOADING_MESSAGES[loadingMsgIdx]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
