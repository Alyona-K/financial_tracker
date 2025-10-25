// import { create } from "zustand";
// import { User } from "./user.types";
// import { fetchUserByCredentials, registerUser } from "./user.api";

// type UserState = {
//   currentUser: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => void;
// };

// export const useUserStore = create<UserState>((set) => ({
//   currentUser: null,
//   isAuthenticated: false,

//   login: async (email, password) => {
//     const user = await fetchUserByCredentials(email, password);
//     if (!user) throw new Error("Invalid email or password");
//     set({ currentUser: user, isAuthenticated: true });
//   },

//   register: async (email, password, name) => {
//     const newUser = await registerUser({ email, password, name });
//     set({ currentUser: newUser, isAuthenticated: true });
//   },

//   logout: () => set({ currentUser: null, isAuthenticated: false }),
// }));
