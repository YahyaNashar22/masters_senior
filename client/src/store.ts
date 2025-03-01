import axios from "axios";
import { create } from "zustand";

type User = {
  _id: string;
  fullname: string;
  email: string;
  token: string;
  role: string;
  status: string;
} | null;

type AuthStore = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
};

const backend = import.meta.env.VITE_BACKEND;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  login: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user)); // Persist user
  },
  logout: async () => {
    const user = get().user; // Get the current user from the store

    if (user) {
      try {
        await axios.get(`${backend}/users/logout/${user._id}`);
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
    set({ user: null });
    localStorage.removeItem("user"); // Clear on logout
  },
}));
