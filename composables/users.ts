import { useMyUserStore } from "~/store/user";
import { User, UserSelector } from "~/types/user";

const userAuthority = {
  "1": "お客様アカウント",
  "2": "営業アカウント",
  "3": "管理者アカウント",
  "4": "Areus",
};

export const users = () => {
  definePageMeta({
    layout: "layout",
  });

  useHead({
    title: "Suggest Optimize",
  });

  const userStore = useMyUserStore();

  async function getUsers(selector: UserSelector): Promise<void> {
    await userStore.getUserList(selector);
  }

  function getUserAuthority(role: string): string {
    return userAuthority[role as keyof typeof userAuthority];
  }

  async function addUser(user: User): Promise<void> {
    await userStore.addUser(user);
  }

  async function edit(user: User): Promise<void> {
    await userStore.edit(user);
  }

  async function deleteUser(id: string, selector: UserSelector): Promise<void> {
    await userStore.delete(id);
    if (userStore.isDeleteUserSuccess) {
      await getUsers(selector);
    }
    setTimeout(() => {
      userStore.resetDeleteUserMessage();
    }, 10000);
  }

  async function checkCustomerCase(id: string): Promise<void> {
    await userStore.checkCustomerCase(id);
  }

  return {
    getUsers,
    getUserAuthority,
    addUser,
    edit,
    deleteUser,
    checkCustomerCase,
  };
};
