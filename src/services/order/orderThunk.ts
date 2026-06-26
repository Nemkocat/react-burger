import { createAsyncThunk } from '@reduxjs/toolkit';

import { selectOrderIngredientIds } from '@services/burger-constructor/constructorSelectors';
import { postOrder } from '@utils/api';

import type { TRootState } from '@services/store';
import type { TOrderResponse } from '@utils/types';

export const createOrder = createAsyncThunk<
  TOrderResponse,
  void,
  { state: TRootState; rejectValue: string }
>('order/create', async (_, { getState, rejectWithValue }) => {
  const ingredientIds = selectOrderIngredientIds(getState());

  if (!ingredientIds) {
    return rejectWithValue('Добавьте булку');
  }

  return postOrder(ingredientIds);
});
