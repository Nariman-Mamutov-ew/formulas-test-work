import { create } from 'zustand';

type State = {
  value: string;
};

type Actions = {
  updateFormula: (newFormula: string) => void;
};

export const useStore = create<State & Actions>((set) => ({
  value: '',
  updateFormula: (newFormula) => set(() => ({ value: newFormula })),
}));

export default useStore;
