"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";

import type { SajuFormInput } from "@/types/saju";

type SajuInputFormProps = {
  register: UseFormRegister<SajuFormInput>;
  control: Control<SajuFormInput>;
  errors: FieldErrors<SajuFormInput>;
  isTimeUnknown: boolean;
  isSubmitDisabled: boolean;
  onSubmit: (data: SajuFormInput) => void;
  handleSubmit: UseFormHandleSubmit<SajuFormInput>;
};

const SajuInputForm = ({
  register,
  control,
  errors,
  isTimeUnknown,
  isSubmitDisabled,
  onSubmit,
  handleSubmit,
}: SajuInputFormProps) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 flex-1 flex flex-col z-10"
    >
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-300">이름</label>
        <input
          {...register("name", { required: "이름을 입력해라." })}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors"
          placeholder="홍길동"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

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
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  field.value === "여"
                    ? "bg-red-600 text-white"
                    : "bg-[#1a1a1a] text-gray-400"
                }`}
              >
                여자
              </button>
              <button
                type="button"
                onClick={() => field.onChange("남")}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  field.value === "남"
                    ? "bg-red-600 text-white"
                    : "bg-[#1a1a1a] text-gray-400"
                }`}
              >
                남자
              </button>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-300">생년월일</label>
        <div className="flex gap-2 relative">
          <select
            {...register("birthYear", { required: true })}
            className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
          >
            <option value="">년도</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ),
            )}
          </select>
          <select
            {...register("birthMonth", { required: true })}
            className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
          >
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            {...register("birthDay", { required: true })}
            className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
          >
            <option value="">일</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
        {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
          <p className="text-red-500 text-xs mt-1">생년월일을 모두 선택해라.</p>
        )}
      </div>

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

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full bg-red-600 text-white font-black text-lg py-5 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-60 disabled:animate-none"
      >
        내 인생 팩폭 맞기 🔥
      </button>
    </form>
  );
};

export default SajuInputForm;
