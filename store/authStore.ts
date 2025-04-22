import { defineStore, getActivePinia } from "pinia";
import { apiClient } from "~/api/apiClient";
import { routeRoles } from "~/middleware/route.global";
import type { LoginParams, State } from "~/types/auth";

const activePinia = getActivePinia() as any;

export const authStore = defineStore("auth", {
  state: (): State => ({
    authenticated: false,
    role: undefined,
    errorMessage: "",
  }),
  getters: {},
  actions: {
    async login(credential: LoginParams) {
      const { logined } = useAuth();

      const config = useRuntimeConfig();
      try {
        const response = await apiClient(String(config.public.baseApi)).post(
          "login",
          {
            username: credential.email,
            password: credential.password,
          },
        );
        const token = response?.data?.token;
        const roleParams = response?.data?.role;
        this.authenticated = true;
        this.role = roleParams;
        await logined(token as string, roleParams as string);
        const redirect =
          routeRoles[String(roleParams) as keyof typeof routeRoles];
        return navigateTo(redirect);
      } catch (e: any) {
        this.authenticated = false;
        this.errorMessage = e?.response?.data;
      }
    },
    async getRole() {
      const config = useRuntimeConfig();
      const { getToken } = useAuth();

      try {
        const header = {
          authorization: "Bearer " + getToken?.(),
        };
        const response = await apiClient(
          String(config.public.baseApi),
          header,
        ).get("user/get-role");
        this.role = String(response?.data?.role);
        const role = useCookie("suggested-user-role", {
          sameSite: true,
          secure: false,
        });
        role.value = String(response?.data?.role);
      } catch (e) {}
    },
    async setErrorMessage(message: string) {
      this.errorMessage = message;
    },
    async logout() {
      const { logouted } = useAuth();
      logouted();
      await activePinia?._s.forEach((store: { $reset: () => any }) =>
        store.$reset(),
      );
      this.authenticated = false;
    },
  },
});
