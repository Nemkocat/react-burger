import { describe, expect, it } from 'vitest';

import { mockBun, mockMain } from '@utils/test-mocks';

import { ingredientsSlice } from './ingredientsSlice';
import { fetchIngredients } from './ingredientsThunk';

const reducer = ingredientsSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

describe('ingredientsSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  it('should handle fetchIngredients.pending', () => {
    const state = reducer(
      { ...initialState, isLoading: false, error: 'old error' },
      fetchIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const ingredients = [mockBun, mockMain];
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(state).toEqual({
      items: ingredients,
      isLoading: false,
      error: null,
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const state = reducer(
      { items: [mockBun], isLoading: true, error: null },
      fetchIngredients.rejected(new Error('Network error'), '', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Network error',
    });
  });

  it('should use default error message when rejected without message', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {},
    };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([]);
  });
});
