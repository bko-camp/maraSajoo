"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Share2, Download, AlertTriangle } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { getPaymentWidget } from "@/lib/tossPayment";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

function readTossPaymentAmount(): number {
    const n = Number(process.env.NEXT_PUBLIC_TOSS_PAYMENT_AMOUNT);
    return Number.isFinite(n) && n > 0 ? n : 990;
}

const TOSS_PAYMENT_AMOUNT = readTossPaymentAmount();
const TOSS_ORDER_NAME =
    process.env.NEXT_PUBLIC_TOSS_ORDER_NAME?.trim() || "마라맛 사주 폭탄 제거 2026";
const TOSS_ORDER_ID_PREFIX =
    process.env.NEXT_PUBLIC_TOSS_ORDER_ID_PREFIX?.trim() || "MARA_";
const TOSS_AGREEMENT_VARIANT_KEY =
    process.env.NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY?.trim() || "AGREEMENT";

export default function ResultPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const shareNodeRef = useRef<HTMLDivElement>(null);

    // Try to cast types if necessary or ignore since it's Next app router
    const [isPaid, setIsPaid] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isShareDisabled, setIsShareDisabled] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const isUnlocked = isPaid || shareCount >= 3;

    useEffect(() => {
        // 1. Fetch analyzed data
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/saju?id=${id}`);
                if (res.ok) {
                    const json = await res.json();
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

        // 2. Initialize Toss Payment SDK in background
        getPaymentWidget()
            .then((widget) => setPaymentWidget(widget))
            .catch(console.error);

    }, [id]);

    useEffect(() => {
        // Re-render payment widget when modal opens and widget is ready
        if (isPaymentModalOpen && paymentWidget) {
            paymentWidget.renderPaymentMethods("#payment-method", TOSS_PAYMENT_AMOUNT);
            paymentWidget.renderAgreement("#agreement", { variantKey: TOSS_AGREEMENT_VARIANT_KEY });
        }
    }, [isPaymentModalOpen, paymentWidget]);

    const handleShare = async () => {
        if (!shareNodeRef.current) return;
        try {
            const canvas = await html2canvas(shareNodeRef.current, { backgroundColor: "#000" });
            const imageData = canvas.toDataURL("image/png");

            // Mobile share API support
            if (navigator.share) {
                const blob = await (await fetch(imageData)).blob();
                const file = new File([blob], "marasajoo.png", { type: "image/png" });
                await navigator.share({
                    title: "내 마라맛 사주 결과",
                    files: [file]
                });
            } else {
                // Fallback to download
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

        const kakao = (window as any).Kakao;

        if (!kakao) {
            alert("카카오 SDK가 로드되지 않았습니다.");
            return;
        }

        if (!kakao.isInitialized()) {
            kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }

        kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '내 마라맛 사주 결과',
                description: '어차피 망한 인생, 팩트폭행이나 맞고 가라.',
                imageUrl: 'https://marasajoo.com/thumbnail.png',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '결과 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });

        setShareCount(prev => {
            const newCount = prev + 1;
            if (newCount === 3) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 4000);
            }
            return newCount;
        });
    };

    const requestPayment = async () => {
        if (!paymentWidget) return;
        try {
            await paymentWidget.requestPayment({
                orderId: `${TOSS_ORDER_ID_PREFIX}${id}_${Date.now()}`,
                orderName: TOSS_ORDER_NAME,
                successUrl: `${window.location.origin}/api/payment/success?id=${id}`,
                failUrl: `${window.location.origin}/result/${id}?fail=true`,
            });
            // The Next page flow will redirect to successUrl if it works.
            // After success, the API route should set `isPaid` to true in DB and redirect back here or a clean page.
        } catch (e) {
            console.error("Payment Error:", e);
        }
    };

    if (loading) return <div className="min-h-screen text-white flex items-center justify-center font-bold">로딩 중...</div>;
    if (!data) return <div className="min-h-screen text-white flex items-center justify-center font-bold">정보를 가져오는데 실패했다.</div>;

    const { content } = data;

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 relative">

            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-400 mb-6 text-center">{data.userInfo.name} 니 사주 결과 나왔다.</h1>

                {/* SECTION A: Shareable Card */}
                <div
                    ref={shareNodeRef}
                    className="border-2 border-red-500 rounded-xl p-6 bg-[#0a0a0a] shadow-[0_0_15px_rgba(239,68,68,0.3)] mb-8"
                >
                    <div className="text-3xl font-black text-white mb-6 leading-relaxed">
                        "{content.summary}"
                    </div>

                    <div className="bg-red-950/30 -mx-6 px-6 py-5 border-y border-red-900/50 mb-6">
                        <h3 className="text-red-500 font-bold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            보살의 팩트폭행
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                            {content.roast}
                        </p>
                    </div>

                    <div className="flex justify-between items-center opacity-50 mt-8">
                        <span className="text-sm font-bold text-red-500">🔥 마라맛 보살</span>
                        <span className="text-xs">marasajoo.com</span>
                    </div>
                </div>

                {/* Share Action Buttons */}
                <div className="flex gap-4 mb-12">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl flex justify-center items-center gap-2 text-white font-bold hover:bg-[#2a2a2a] transition"
                    >
                        <Share2 className="w-5 h-5" />
                        인스타/카톡 박제
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-14 bg-red-900/40 text-red-500 border border-red-900 p-4 rounded-xl flex justify-center items-center hover:bg-red-900/60 transition"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                {/* SECTION B: Paywall & Solution */}
                <div className="relative">
                    <h2 className="text-xl font-black text-white mb-4">
                        ⚠️ 2026년, 니 돈을 다 털어먹을 액운과 대처법
                    </h2>

                    <div className={`
            border border-gray-800 rounded-xl p-6 relative overflow-hidden transition-all duration-1000
            ${!isUnlocked ? 'h-64' : 'auto'}
          `}>
                        <p className={`
               text-lg leading-relaxed
               ${!isUnlocked ? 'blur-sm text-gray-500 select-none' : 'text-gray-100 font-medium'}
             `}>
                            {content.paid_solution}
                        </p>

                        {/* Not Paid State Gradient Overlay */}
                        {!isUnlocked && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-end p-6">
                                <p className="text-center font-bold text-gray-300 mb-8 max-w-[250px]">
                                    {content.bait}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA Bottom Sticky (If not unlocked) */}
            {!isUnlocked && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="w-full bg-yellow-400 text-black font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse"
                    >
                        <Lock className="w-5 h-5" />
                        💸 {TOSS_PAYMENT_AMOUNT.toLocaleString("ko-KR")}원 결제하고 바로 확인하기
                    </button>
                    <button
                        onClick={handleKakaoShare}
                        disabled={isShareDisabled}
                        className="w-full bg-[#FEE500] text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        💬 카톡방 3곳에 공유하고 무료로 보기 (현재 {shareCount}/3)
                    </button>
                </div>
            )}

            {/* Celebration Particles */}
            <AnimatePresence>
                {showCelebration && (
                    <div className="fixed inset-0 pointer-events-none z-[100] max-w-md mx-auto overflow-hidden">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    left: "50%",
                                    bottom: "-10%",
                                    scale: 0
                                }}
                                animate={{
                                    opacity: 0,
                                    left: `${Math.random() * 100}%`,
                                    bottom: `${50 + Math.random() * 50}%`,
                                    scale: Math.random() * 2 + 1,
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 1.5 + Math.random() * 1,
                                    ease: "easeOut"
                                }}
                                className={`absolute w-3 h-3 rounded-full ${['bg-yellow-400', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Widget Modal (BottomSheet) */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 max-w-md mx-auto"
                            onClick={() => setIsPaymentModalOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl p-6 z-50 shadow-2xl h-[75vh] overflow-y-auto"
                        >
                            <h3 className="text-black font-black text-2xl mb-4">
                                복비 결제 ({TOSS_PAYMENT_AMOUNT.toLocaleString("ko-KR")}원)
                            </h3>
                            <div id="payment-method" className="w-full" />
                            <div id="agreement" className="w-full mb-6" />
                            <button
                                onClick={requestPayment}
                                className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg"
                            >
                                결제하기
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
