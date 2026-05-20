import { SocialLoginButtons } from "./SocialLoginButtons";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <div className="text-center mb-12 mt-16">
        <h1
          className="text-4xl font-black mb-4 tracking-tighter text-glitch"
          data-text="로그인"
        >
          로그인
        </h1>
        <p className="text-gray-400 font-medium">
          소셜 계정으로 간편하게 시작하세요
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <SocialLoginButtons />
      </div>

      <p className="text-center text-xs text-gray-500 mt-10">
        로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
      </p>
    </div>
  );
}
