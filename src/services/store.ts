import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from './burger-constructor/constructorSlice';
import { ingredientModalSlice } from './ingredient-modal/ingredientModalSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';
import { userSlice } from './user/userSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  ingredientModalSlice,
  orderSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type TRootState = ReturnType<typeof rootReducer>;
export type TAppDispatch = typeof store.dispatch;
