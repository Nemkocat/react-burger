import { BASE_URL } from '@utils/constants';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@utils/token';

import type {
  TAuthResponse,
  TIngredient,
  TIngredientsResponse,
  TMessageResponse,
  TOrderResponse,
  TTokenResponse,
  TUser,
  TUserResponse,
} from '@utils/types';

type TRequestOptions = RequestInit & {
  authorized?: boolean;
};

const checkResponse = <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return response
    .json()
    .catch(() => Promise.reject(new Error(`Ошибка ${response.status}`)))
    .then((data: { message?: string }) =>
      Promise.reject(new Error(data.message ?? `Ошибка ${response.status}`))
    );
};

const refreshTokenRequest = (): Promise<TTokenResponse> => {
  const token = getRefreshToken();

  if (!token) {
    return Promise.reject(new Error('Refresh token not found'));
  }

  return fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
    .then((response) => checkResponse<TTokenResponse>(response))
    .then((data) => {
      if (!data.success) {
        return Promise.reject(new Error('Не удалось обновить токен'));
      }

      setTokens(data.accessToken, data.refreshToken);
      return data;
    });
};

export const fetchWithRefresh = <T>(
  url: string,
  options: TRequestOptions = {}
): Promise<T> => {
  const { authorized = false, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (authorized) {
    const accessToken = getAccessToken();

    if (accessToken) {
      (requestHeaders as Record<string, string>).authorization = accessToken;
    }
  }

  return fetch(url, { ...rest, headers: requestHeaders })
    .then((response) => {
      if (response.status === 403 && authorized) {
        return refreshTokenRequest().then((tokenData) =>
          fetch(url, {
            ...rest,
            headers: {
              ...requestHeaders,
              authorization: tokenData.accessToken,
            },
          })
        );
      }

      return response;
    })
    .then((response) => checkResponse<T>(response))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      return Promise.reject(new Error(message));
    });
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
      return Promise.reject(new Error(message));
    });

export const postOrder = (ingredients: string[]): Promise<TOrderResponse> =>
  fetchWithRefresh<TOrderResponse>(`${BASE_URL}/orders`, {
    method: 'POST',
    authorized: true,
    body: JSON.stringify({ ingredients }),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось оформить заказ'));
    }

    return data;
  });

export const registerUser = (payload: {
  email: string;
  password: string;
  name: string;
}): Promise<TAuthResponse> =>
  fetchWithRefresh<TAuthResponse>(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось зарегистрироваться'));
    }

    setTokens(data.accessToken, data.refreshToken);
    return data;
  });

export const loginUser = (payload: {
  email: string;
  password: string;
}): Promise<TAuthResponse> =>
  fetchWithRefresh<TAuthResponse>(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось войти'));
    }

    setTokens(data.accessToken, data.refreshToken);
    return data;
  });

export const logoutUser = (): Promise<TMessageResponse> => {
  const token = getRefreshToken();

  return fetchWithRefresh<TMessageResponse>(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({ token }),
  }).then((data) => {
    clearTokens();
    return data;
  });
};

export const getUser = (): Promise<TUser> =>
  fetchWithRefresh<TUserResponse>(`${BASE_URL}/auth/user`, {
    authorized: true,
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось получить данные пользователя'));
    }

    return data.user;
  });

export const updateUser = (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<TUser> =>
  fetchWithRefresh<TUserResponse>(`${BASE_URL}/auth/user`, {
    method: 'PATCH',
    authorized: true,
    body: JSON.stringify(payload),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось обновить данные пользователя'));
    }

    return data.user;
  });

export const forgotPassword = (email: string): Promise<TMessageResponse> =>
  fetchWithRefresh<TMessageResponse>(`${BASE_URL}/password-reset`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось отправить письмо'));
    }

    return data;
  });

export const resetPassword = (payload: {
  password: string;
  token: string;
}): Promise<TMessageResponse> =>
  fetchWithRefresh<TMessageResponse>(`${BASE_URL}/password-reset/reset`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((data) => {
    if (!data.success) {
      return Promise.reject(new Error('Не удалось сбросить пароль'));
    }

    return data;
  });
