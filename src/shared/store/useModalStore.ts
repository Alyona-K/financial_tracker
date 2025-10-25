import { create } from "zustand";

interface ModalState {
  activeModal:
    | null
    | "addTransaction"
    | "editTransaction"
    | "addCategory"
    | "editCategory";
  openModal: (name: ModalState["activeModal"]) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}));
