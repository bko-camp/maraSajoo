export type AuthPagePolicy = "public" | "guest" | "protected";

export const AUTH_LOGIN_PATH = "/auth/login";
export const AUTH_DEFAULT_REDIRECT = "/";

/** 비로그인 전용 (로그인 시 홈으로 이동) */
export const AUTH_GUEST_PREFIXES = [AUTH_LOGIN_PATH] as const;

/** 로그인 필수 (미로그인 시 홈으로 이동) */
export const AUTH_PROTECTED_PREFIXES = ["/user"] as const;

export function matchRoutePrefix(pathname: string, prefix: string): boolean {
  if (prefix === "/") return pathname === "/";
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function resolveAuthPolicy(pathname: string): AuthPagePolicy {
  if (AUTH_GUEST_PREFIXES.some((p) => matchRoutePrefix(pathname, p))) {
    return "guest";
  }
  if (AUTH_PROTECTED_PREFIXES.some((p) => matchRoutePrefix(pathname, p))) {
    return "protected";
  }
  return "public";
}
