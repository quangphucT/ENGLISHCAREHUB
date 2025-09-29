// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LoginResponse } from "@/types/auth";

interface UserState {
  data: LoginResponse | null;
  userEmail: string | null;
  setAccount: (account: LoginResponse) => void;
  setUserEmail: (email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      data: null,
      userEmail: null,
      setAccount: (data) => set({ data }),
      setUserEmail: (email) => set({ userEmail: email }),
      logout: () => set({ data: null, userEmail: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        data: state.data,
        userEmail: state.userEmail,
      }),
    }
  )
);
