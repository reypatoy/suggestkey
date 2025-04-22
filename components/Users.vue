<template>
  <div class="banner_title text-white text-4xl">ユーザー設定</div>
  <main>
    <div class="wrapper absolute inset-x-0 -top-20">
      <section id="container_users">
        <h2 class="h2 mb-2">ユーザー一覧</h2>
        <div class="context">
          <a href="#" class="tgl"></a>
          <form
            @submit.prevent="userListFunction.getUsers(selector)"
            class="pr-6"
          >
            <div class="searchform">
              <input
                placeholder="ユーザー名で検索"
                type="text"
                v-model="selector.username"
              />
              <button type="button"  @click="userListFunction.getUsers(selector)">search</button>
            </div>
          </form>
          <div class="btn-primary">
            <a
              href="#"
              data-modal="add"
              @click="
                isUserModalOpen = true;
                saveUserMessage = '';
                modalMode = 'add';
                isShowRoles = true;
              "
              >ユーザー追加</a
            >
          </div>
        </div>
        <ul class="sort !mb-0">
          <li>権限で絞り込み：</li>
          <li
            class="rounded-md p-1 hover:bg-gray-200"
            :class="selector.role === '1' ? 'bg-gray-100' : ''"
          >
            <a href="#" @click="searchByRole('1')">お客様アカウント</a>
          </li>
          <li
            class="rounded-md p-1 hover:bg-gray-200"
            :class="selector.role === '2' ? 'bg-gray-100' : ''"
          >
            <a href="#" @click="searchByRole('2')">営業アカウント</a>
          </li>
          <li
            class="rounded-md p-1 hover:bg-gray-200"
            :class="selector.role === '3' ? 'bg-gray-100' : ''"
          >
            <a href="#" @click="searchByRole('3')">管理者アカウント</a>
          </li>
        </ul>
        <div>
          <span
            class="px-6 py-20 font-medium mb-2"
            :class="
              store.isDeleteUserSuccess ? 'text-green-500' : 'text-red-500'
            "
            >{{ store.deleteUserMessage }}</span
          >
          <table class="t1 mw9">
            <thead>
              <tr>
                <td class="user_no">ID</td>
                <td class="user_name">ユーザー名</td>
                <td class="user_auth">権限</td>
                <td class="user_edit">編集</td>
                <td class="user_delete">削除</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in listResponse?.result" :key="user?.id">
                <th class="user_no">{{ user?.id }}</th>
                <th class="user_name text-left">
                  <p>{{ user?.username }}</p>
                  <p>{{ user?.email }}</p>
                </th>
                <td class="user_auth">
                  {{ userListFunction.getUserAuthority(String(user.role)) }}
                </td>
                <td class="user_edit">
                  <div class="btn-primary">
                    <a
                      href="#"
                      data-modal="edit"
                      @click="
                        modalMode = 'edit';
                        newUser = new User(user);
                        isUserModalOpen = true;
                        saveUserMessage = '';
                        setRolesVisible(user);
                      "
                      >編集</a
                    >
                  </div>
                </td>
                <td class="user_delete">
                  <div class="btn-danger" v-if="!user.self">
                    <a
                      href="#"
                      data-modal="delete"
                      @click="openDeleteModal(user?.id)"
                    >
                      削除
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pager mt-2 text-center">
          <nav aria-label="Page navigation">
            <ul class="inline-flex space-x-1">
              <li v-for="page in totalPages" :key="page">
                <button
                  @click="changePage(page)"
                  :class="[
                    'px-3 py-1 border border-gray-300',
                    page === selector.page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100',
                  ]"
                >
                  {{ page }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  </main>

  <div v-if="isUserModalOpen" id="modal_add" class="modal show">
    <div class="wrapper">
      <section>
        <h2 class="h3 mb-2">ユーザー追加</h2>
        <span
          :class="store.isSaveUserSuccess ? 'text-green-600' : 'text-red-600'"
          >{{ saveUserMessage }}</span
        >
        <form @submit.prevent="saveUser">
          <div class="form_input">
            <p>ユーザー名</p>
            <input type="text" v-model="newUser.username" />
          </div>
          <div class="form_input">
            <p>Eメール</p>
            <input type="email" v-model="newUser.email" />
          </div>
          <div class="form_input">
            <p>パスワード</p>
            <input type="password" v-model="newUser.password" />
          </div>
          <div class="form_input" v-if="!newUser.self && isShowRoles">
            <p>権限</p>
            <label
              ><input
                type="radio"
                value="1"
                v-model="newUser.role"
              />お客様アカウント</label
            >
            <label
              ><input
                type="radio"
                value="2"
                v-model="newUser.role"
              />営業アカウント</label
            >
            <label
              ><input
                type="radio"
                value="3"
                v-model="newUser.role"
              />管理者アカウント</label
            >
          </div>

          <div class="form_input mt-1 tc">
            <div class="btn-primary">
              <input type="submit" value="保存" />
            </div>
            <div class="btn-cancel">
              <input
                type="button"
                value="キャンセル"
                @click="
                  isUserModalOpen = false;
                  saveUserMessage = '';
                  newUser = new User({ role: '1' });
                "
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>

  <ModalConfirmDialog
    :card-text="store.deleteNotifMessage"
    :model-value="isDeleteUserDialogOpen"
    @confirmed="
      isDeleteUserDialogOpen = false;
      deleteUser();
    "
    :button-text="'OK'"
    @cancel="isDeleteUserDialogOpen = false"
  />
  <ModalConfirmEditDialog
    :card-text="store.deleteNotifMessage"
    :model-value="isEditUserDialogOpen"
    @confirmed="
      isEditUserDialogOpen = false;
      updateCurrentUser();
    "
    :button-text="'OK'"
    @cancel="isEditUserDialogOpen = false"
  />
</template>

<script lang="ts" setup>
import { UserSelector, User } from "~/types/user";
import type { ListResponse } from "~/types/listResponse";
import { useMyUserStore } from "~/store/user";
import { authStore } from "~/store/authStore";

const store = useMyUserStore();
const userListFunction = users();
const selector = ref<UserSelector>(new UserSelector({ page: 1, limit: 10 }));
const listResponse = ref<ListResponse<User>>();
const isUserModalOpen = ref<boolean>(false);
const newUser = ref<User>(new User({ role: "1" }));
const saveUserMessage = ref<string>(null as unknown as string);
const deleteUserMessage = ref<string>(null as unknown as string);
const modalMode = ref<"add" | "edit">("add");
const isDeleteUserDialogOpen = ref<boolean>(false);
const isEditUserDialogOpen = ref<boolean>(false);
const deleteUserId = ref<string>();
const router = useRouter();
const _authStore = authStore();

const isShowRoles = ref<boolean>(true);

onMounted(async () => {
  await userListFunction.getUsers(selector.value);
});

const searchByRole = (role: string) => {
  if (selector.value.role === role) {
    role = "";
  }
  selector.value = new UserSelector({ ...selector.value, role });
  userListFunction.getUsers(selector.value);
};

const saveUser = async () => {
  let isCurrentUserUpdated = false;
  if (modalMode.value == "add") {
    await userListFunction.addUser(newUser.value);
    refreshUsers();
  } else {
    const currentUser = listResponse.value?.result?.find(
      (user: User) => user.self
    );

    if (
      currentUser &&
      currentUser?.id === newUser.value?.id &&
      (newUser.value?.username !== currentUser?.username ||
        newUser.value?.password !== currentUser?.password)
    ) {
      isCurrentUserUpdated = true;
    }
    if (isCurrentUserUpdated) {
      isEditUserDialogOpen.value = true;
    } else {
      await userListFunction.edit(newUser.value);
      refreshUsers();
    }
  }
};

const refreshUsers = async () => {
  if (store.isSaveUserSuccess) {
    setTimeout(() => {
      if (modalMode.value == "edit") {
        isUserModalOpen.value = false;
      }
      newUser.value = new User({ role: "1" });
    }, 1000);
    saveUserMessage.value = "";
    await userListFunction.getUsers(selector.value);
  }
};

const updateCurrentUser = async () => {
  await userListFunction.edit(newUser.value);
  await authStore().logout();
  router.push("/login").then(() => window.location.reload());
};

const deleteUser = async () => {
  if (
    Number(listResponse?.value?.result?.length) == 1 &&
    Number(selector.value.page) > 1
  ) {
    selector.value = new UserSelector({
      ...selector.value,
      page: selector.value.page - 1,
    });
  }
  await userListFunction.deleteUser(String(deleteUserId.value), selector.value);
};

watch(
  [store],
  () => {
    listResponse.value = store.listResponse;
    saveUserMessage.value = store.saveUserMessage;
    deleteUserMessage.value = store.deleteUserMessage;
  },
  { deep: true }
);

const totalPages = computed(() =>
  Math.ceil(Number(store.listResponse?.total || 0) / selector.value.limit)
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    selector.value.page = page;
    userListFunction.getUsers(selector.value);
  }
};

const openDeleteModal = async (id: number | undefined) => {
  await userListFunction.checkCustomerCase(String(id));

  if (id !== undefined) {
    deleteUserId.value = String(id);
    isDeleteUserDialogOpen.value = true;
  } else {
    console.error("User ID is undefined. Cannot delete the user.");
  }
};

watch(isUserModalOpen, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

onMounted(() => {
  if (isUserModalOpen.value) {
    document.body.style.overflow = "hidden";
  }
});

const setRolesVisible = (user: any) => {
  isShowRoles.value = false;

  if (String(_authStore.role) === "4") {
    isShowRoles.value = true;
  }

  if (user.role != "3") {
    isShowRoles.value = true;
  }
};
</script>
