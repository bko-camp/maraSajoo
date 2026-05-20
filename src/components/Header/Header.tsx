"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { AUTH_DEFAULT_REDIRECT, AUTH_LOGIN_PATH } from "@/lib/auth-guide";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  const isLoginPage = pathname === AUTH_LOGIN_PATH;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: AUTH_DEFAULT_REDIRECT });
    router.push(AUTH_DEFAULT_REDIRECT);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/80 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 h-14">
        <Link
          href="/"
          className="text-lg font-black tracking-tight text-red-500 hover:text-red-400 transition-colors shrink-0"
        >
          마라사주
        </Link>

        <nav className="flex items-center gap-2 min-w-0">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" aria-label="로딩 중" />
          ) : (
            <>
              {isAuthenticated && (
                <Link
                  href="/user/profile"
                  className="px-3 py-1.5 text-sm font-bold text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]"
                >
                  마이페이지
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 text-sm font-bold text-gray-400 border border-gray-800 rounded-lg hover:border-red-500 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                !isLoginPage && (
                  <Link
                    href={AUTH_LOGIN_PATH}
                    className="px-3 py-1.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    로그인
                  </Link>
                )
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
