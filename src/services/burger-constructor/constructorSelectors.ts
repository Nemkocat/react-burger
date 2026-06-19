import { createSelector } from '@reduxjs/toolkit';

import type { TConstructorIngredient } from '@utils/types';

type TConstructorRootState = {
  burgerConstructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const selectConstructorBun = (
  state: TConstructorRootState
): TConstructorIngredient | null => state.burgerConstructor.bun;

const selectConstructorFillings = (
  state: TConstructorRootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectIngredientCounts = createSelector(
  [selectConstructorBun, selectConstructorFillings],
  (bun, fillings) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    fillings.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }
);

export const selectTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorFillings],
  (bun, fillings) => {
    if (!bun) {
      return 0;
    }

    return (
      bun.price * 2 + fillings.reduce((sum, ingredient) => sum + ingredient.price, 0)
    );
  }
);

export const selectOrderIngredientIds = createSelector(
  [selectConstructorBun, selectConstructorFillings],
  (bun, fillings) => {
    if (!bun) {
      return null;
    }

    return [bun._id, ...fillings.map((ingredient) => ingredient._id), bun._id];
  }
);
