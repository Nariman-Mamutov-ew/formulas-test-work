import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

export type Formula = {
  id: string;
  formulaValue: string;
  endDate: string | null;
  startDate: string | null;
};

type State = {
  formulas: Array<Formula>;
};

type Actions = {
  updateFormula: (newFormula: Formula) => void;
  addNewFormula: VoidFunction;
  deleteFormula: (id: string) => void;
};

export const useStore = create<State & Actions>((set) => ({
  formulas: [
    {
      id: uuidv4(),
      formulaValue: '',
      startDate: null,
      endDate: null,
    },
  ],
  updateFormula: (newFormula) =>
    set((state) => {
      const updatedFormulas = state.formulas.map((formula) => {
        if (formula.id === newFormula.id) {
          return {
            ...formula,
            ...newFormula,
          };
        }
        return formula;
      });

      return { formulas: updatedFormulas };
    }),
  addNewFormula: () =>
    set((state) => {
      const existingFormulas = state.formulas;
      existingFormulas.push({
        id: uuidv4(),
        formulaValue: '',
        startDate: null,
        endDate: null,
      });

      return { formulas: existingFormulas };
    }),
  deleteFormula: (id) =>
    set((state) => ({
      formulas: state.formulas.filter((formula) => formula.id !== id),
    })),
}));

export default useStore;
