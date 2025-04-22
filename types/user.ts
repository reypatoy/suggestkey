import { BaseSelector } from "./baseSelector";
import type { ListResponse } from "./listResponse";

export type State = {
  listResponse: ListResponse<User>;
  saveUserMessage: string;
  isSaveUserSuccess: boolean;
  deleteUserMessage: string;
  deleteNotifMessage: string;
  isDeleteUserSuccess: boolean;
  customers: Customer[];
};

export type Customer = {
  id: string;
  username: string;
};
export class User {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  self?: boolean;

  constructor(init: User) {
    this.id = init.id;
    this.email = init.email;
    this.username = init.username;
    this.password = init.password;
    this.role = init.role;
    this.self = init.self;
  }
}

export class UserSelector extends BaseSelector {
  username?: string;
  role?: string;

  constructor(init: UserSelector) {
    super(init);
    this.username = init.username;
    this.role = init.role;
  }
}
