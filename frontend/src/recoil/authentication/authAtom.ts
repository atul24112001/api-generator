import { atom } from "recoil";

export type User = {
  name: string;
  email: string;
  id: number;
};

const AuthenticationState = atom<{
  user: null | User;
  isAuthenticated: boolean;
}>({
  key: "AUTHENTICATION_STATE",
  default: {
    user: null,
    isAuthenticated: false,
  },
});

export default AuthenticationState;
