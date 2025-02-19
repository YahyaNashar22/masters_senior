import { create } from "zustand";

type User = {
  _id: string;
  fullname: string;
  email: string;
  token: string;
  role: string;
} | null;

type AuthStore = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  login: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user)); // Persist user
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("user"); // Clear on logout
  },
}));
