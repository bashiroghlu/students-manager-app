import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  fullName: "",
  token: null,
  userId: null,
  status: "",
  login: () => {},
  logout: () => {},
});
