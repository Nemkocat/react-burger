import { BASE_URL } from '@utils/constants';

import type { TIngredient, TIngredientsResponse } from '@utils/types';

const checkResponse = <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return Promise.reject(new Error(`Ошибка ${response.status}`));
};

export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${BASE_URL}/ingredients`)
    .then((response) => checkResponse<TIngredientsResponse>(response))
    .then((data) => {
      if (!data.success) {
        return Promise.reject(new Error('Не удалось загрузить ингредиенты'));
      }

      return data.data;
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(message);
      return Promise.reject(new Error(message));
    });
