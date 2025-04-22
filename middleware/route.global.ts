import { useAuth } from "~/composables/auth";
import { authStore } from "~/store/authStore";

export const routeRoles = {
  "1": "/user",
  "2": "/sales",
  "3": "/admin",
  "4": "/areus",
} as const;

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLogin } = useAuth();
  const store = authStore();
  const path = `/${to.fullPath.split("/")[1]}`;

  if (!isLogin.value) {
    if (path !== "/login") {
      return navigateTo("/login");
    }
  } else {
    if (!store.role) {
      await store.getRole();
    }
    const userPath = routeRoles[String(store.role) as keyof typeof routeRoles];
    if (path === "/" || path === "/login") {
      return navigateTo(userPath);
    } else if (path !== userPath && path !== "/unauthorized") {
      return navigateTo("/unauthorized");
    }
  }
});
