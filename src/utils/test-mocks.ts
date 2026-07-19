import type { TIngredient, TOrder } from '@utils/types';

export const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  __v: 0,
};

export const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Хрустящие минеральные кольца',
  type: 'main',
  proteins: 808,
  fat: 689,
  carbohydrates: 609,
  calories: 986,
  price: 300,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png',
  __v: 0,
};

export const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 100,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  __v: 0,
};

export const mockOrder: TOrder = {
  _id: 'order-1',
  ingredients: [mockBun._id, mockMain._id],
  status: 'done',
  name: 'Space бургер',
  number: 12345,
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:01:00.000Z',
};

export const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
};
