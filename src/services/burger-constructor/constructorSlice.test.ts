import { describe, expect, it } from 'vitest';

import { mockBun, mockMain, mockSauce } from '@utils/test-mocks';

import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  moveIngredient,
  removeIngredient,
} from './constructorSlice';

const reducer = constructorSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

describe('constructorSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('should add a bun', () => {
    const state = reducer(initialState, addIngredient(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(state.bun?.uniqueId).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  it('should replace bun when another bun is added', () => {
    const withBun = reducer(initialState, addIngredient(mockBun));
    const anotherBun = { ...mockBun, _id: 'bun-2', name: 'Флюоресцентная булка' };
    const state = reducer(withBun, addIngredient(anotherBun));

    expect(state.bun?._id).toBe('bun-2');
    expect(state.ingredients).toEqual([]);
  });

  it('should add a filling', () => {
    const state = reducer(initialState, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockMain);
    expect(state.ingredients[0].uniqueId).toEqual(expect.any(String));
  });

  it('should remove a filling by uniqueId', () => {
    const withFilling = reducer(initialState, addIngredient(mockMain));
    const uniqueId = withFilling.ingredients[0].uniqueId;
    const state = reducer(withFilling, removeIngredient(uniqueId));

    expect(state.ingredients).toEqual([]);
  });

  it('should move a filling', () => {
    const state = reducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, uniqueId: 'id-1' },
          { ...mockSauce, uniqueId: 'id-2' },
        ],
      },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients.map((item) => item.uniqueId)).toEqual(['id-2', 'id-1']);
  });

  it('should clear constructor', () => {
    let state = reducer(initialState, addIngredient(mockBun));
    state = reducer(state, addIngredient(mockMain));
    state = reducer(state, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
