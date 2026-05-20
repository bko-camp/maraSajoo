"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas-pro";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

import {
  TOSS_AGREEMENT_VARIANT_KEY,
  TOSS_ORDER_ID_PREFIX,
  TOSS_ORDER_NAME,
  TOSS_PAYMENT_AMOUNT,
} from "@/constants/payment";
import { getPaymentWidget } from "@/lib/tossPayment";
import type { SajuResultRecord } from "@/types/saju-result";

import {
  PaymentBottomSheet,
  ResultBottomCta,
  ResultPaywall,
  ResultShareActions,
  ResultShareCard,
  ShareCelebration,
} from "./components";

const ResultPageView = () => {
  const { id } = useParams();
  const [data, setData] = useState<SajuResultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const shareNodeRef = useRef<HTMLDivElement>(null);

  const [isPaid, setIsPaid] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [isShareDisabled, setIsShareDisabled] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(
    null,
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isUnlocked = isPaid || shareCount >= 3;
  const resultId = typeof id === "string" ? id : id?.[0];

  useEffect(() => {
    if (!resultId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/saju?id=${resultId}`);
        if (res.ok) {
          const json: SajuResultRecord = await res.json();
          setData(json);
          setIsPaid(json.isPaid);
        } else {
          alert("결과를 찾을 수 없습니다.");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    getPaymentWidget()
      .then((widget) => setPaymentWidget(widget))
      .catch(console.error);
  }, [resultId]);

  useEffect(() => {
    if (isPaymentModalOpen && paymentWidget) {
      paymentWidget.renderPaymentMethods("#payment-method", TOSS_PAYMENT_AMOUNT);
      paymentWidget.renderAgreement("#agreement", {
        variantKey: TOSS_AGREEMENT_VARIANT_KEY,
      });
    }
  }, [isPaymentModalOpen, paymentWidget]);

  const handleShare = async () => {
    if (!shareNodeRef.current) return;
    try {
      const canvas = await html2canvas(shareNodeRef.current, {
        backgroundColor: "#000",
      });
      const imageData = canvas.toDataURL("image/png");

      if (navigator.share) {
        const blob = await (await fetch(imageData)).blob();
        const file = new File([blob], "marasajoo.png", { type: "image/png" });
        await navigator.share({
          title: "내 마라맛 사주 결과",
          files: [file],
        });
      } else {
        const a = document.createElement("a");
        a.href = imageData;
        a.download = "marasajoo_result.png";
        a.click();
      }
    } catch (e) {
      console.error("Capture failed:", e);
    }
  };

  const handleKakaoShare = () => {
    if (isShareDisabled) return;

    setIsShareDisabled(true);
    setTimeout(() => setIsShareDisabled(false), 3000);

    const kakao = (window as Window & { Kakao?: KakaoSDK }).Kakao;

    if (!kakao) {
      alert("카카오 SDK가 로드되지 않았습니다.");
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "내 마라맛 사주 결과",
        description: "어차피 망한 인생, 팩트폭행이나 맞고 가라.",
        imageUrl: "https://marasajoo.com/thumbnail.png",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "결과 보기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });

    setShareCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
      return newCount;
    });
  };

  const requestPayment = async () => {
    if (!paymentWidget || !resultId) return;
    try {
      await paymentWidget.requestPayment({
        orderId: `${TOSS_ORDER_ID_PREFIX}${resultId}_${Date.now()}`,
        orderName: TOSS_ORDER_NAME,
        successUrl: `${window.location.origin}/api/payment/success?id=${resultId}`,
        failUrl: `${window.location.origin}/result/${resultId}?fail=true`,
      });
    } catch (e) {
      console.error("Payment Error:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center font-bold">
        로딩 중...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center font-bold">
        정보를 가져오는데 실패했다.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black pb-28 relative">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-400 mb-6 text-center">
          {data.userInfo.name} 니 사주 결과 나왔다.
        </h1>

        <ResultShareCard ref={shareNodeRef} content={data.content} />
        <ResultShareActions onShare={handleShare} />
        <ResultPaywall content={data.content} isUnlocked={isUnlocked} />
      </div>

      {!isUnlocked && (
        <ResultBottomCta
          shareCount={shareCount}
          isShareDisabled={isShareDisabled}
          onOpenPayment={() => setIsPaymentModalOpen(true)}
          onKakaoShare={handleKakaoShare}
        />
      )}

      <ShareCelebration show={showCelebration} />
      <PaymentBottomSheet
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onRequestPayment={requestPayment}
      />
    </div>
  );
};

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string | undefined) => void;
  Share: {
    sendDefault: (options: Record<string, unknown>) => void;
  };
};

export default ResultPageView;
