import { create } from 'zustand';

const useStore = create((set) => ({
  income: 0,
  setIncome: (amount) => set({ income: amount }), 

  categories: [
    'Food',
    'Transportation',
    'Rent',
    'Entertainment',
    'Healthcare',
    'Other',
    'Savings'
  ],
}));

export default useStore;