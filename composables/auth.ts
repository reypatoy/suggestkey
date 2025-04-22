export type UseAuth = {
  isLogin: ComputedRef<boolean>;
  logined: (generatedToken: string, refresh_token: string) => Promise<void>;
  logouted: () => void;
  getToken?: () => string;
};
export const useAuth = (): UseAuth => {
  const cookieToken = useCookie("suggested-user-token");
  const cookieRole = useCookie("suggested-user-role");
  const isLogin = computed(() => !!cookieToken.value);
  const logined = async (
    generated_token: string,
    user_role: string,
  ): Promise<void> => {
    const token = useCookie("suggested-user-token", {
      sameSite: true,
      secure: false,
    });
    const role = useCookie("suggested-user-role", {
      sameSite: true,
      secure: false,
    });
    token.value = generated_token;
    role.value = user_role;
  };
  const logouted = () => {
    cookieToken.value = null;
    cookieRole.value = null;
  };

  const getToken = () => {
    return String(cookieToken.value);
  };

  return {
    isLogin,
    logined,
    logouted,
    getToken
  };
};
