import { describe, expect, it } from 'vitest';

import { mockBun } from '@utils/test-mocks';

import {
  clearSelectedIngredient,
  ingredientModalSlice,
  setSelectedIngredient,
} from './ingredientModalSlice';

const reducer = ingredientModalSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

describe('ingredientModalSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      selectedIngredient: null,
    });
  });

  it('should set selected ingredient', () => {
    const state = reducer(initialState, setSelectedIngredient(mockBun));

    expect(state.selectedIngredient).toEqual(mockBun);
  });

  it('should clear selected ingredient', () => {
    const withIngredient = reducer(initialState, setSelectedIngredient(mockBun));
    const state = reducer(withIngredient, clearSelectedIngredient());

    expect(state.selectedIngredient).toBeNull();
  });
});
