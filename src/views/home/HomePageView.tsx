"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { useSajuAnalysis } from "@/hooks";
import { AUTH_LOGIN_PATH } from "@/lib/auth-guide";
import { useSajuPendingStore } from "@/store";
import { toSajuFormPayload, type SajuFormInput } from "@/types/saju";

import { SajuHero, SajuInputForm, SajuLoadingOverlay } from "./components";

const SAJU_RESUME_LOCK_KEY = "mara-saju-resume-lock";

const HomePageView = () => {
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
      <SajuHero />
      <SajuInputForm
        register={register}
        control={control}
        errors={errors}
        isTimeUnknown={isTimeUnknown}
        isSubmitDisabled={status === "loading" || isLoading}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
      />
      <SajuLoadingOverlay
        isLoading={isLoading}
        loadingMsgIdx={loadingMsgIdx}
        loadingMessages={loadingMessages}
      />
    </div>
  );
};

export default HomePageView;
