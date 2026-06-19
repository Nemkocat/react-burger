import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TIngredientModalState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientModalState = {
  selectedIngredient: null,
};

export const ingredientModalSlice = createSlice({
  name: 'ingredientModal',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    },
  },
  selectors: {
    selectSelectedIngredient: (state) => state.selectedIngredient,
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientModalSlice.actions;
