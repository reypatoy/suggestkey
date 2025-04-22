export type LoginParams = {
  email: string;
  password: string;
};

export type Token = {
  token: string;
  role: string;
};

export type State = {
  authenticated: boolean;
  role: string | undefined;
  errorMessage: string;
};
