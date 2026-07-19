import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from './burger-constructor/constructorSlice';
import { feedOrdersSocketMiddleware } from './feed-orders/feedOrdersMiddleware';
import { feedOrdersSlice } from './feed-orders/feedOrdersSlice';
import { ingredientModalSlice } from './ingredient-modal/ingredientModalSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';
import { profileOrdersSocketMiddleware } from './profile-orders/profileOrdersMiddleware';
import { profileOrdersSlice } from './profile-orders/profileOrdersSlice';
import { userSlice } from './user/userSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  ingredientModalSlice,
  orderSlice,
  userSlice,
  feedOrdersSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      feedOrdersSocketMiddleware,
      profileOrdersSocketMiddleware
    ),
  devTools: import.meta.env.DEV,
});

export type TRootState = ReturnType<typeof rootReducer>;
export type TAppDispatch = typeof store.dispatch;
