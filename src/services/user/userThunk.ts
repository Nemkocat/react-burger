import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUser,
  loginUser as loginUserApi,
  logoutUser as logoutUserApi,
  registerUser as registerUserApi,
  updateUser,
} from '@utils/api';
import { clearTokens, getRefreshToken } from '@utils/token';

import type { TAuthResponse, TUser } from '@utils/types';

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  if (!getRefreshToken()) {
    return null;
  }

  try {
    return await getUser();
  } catch (error) {
    clearTokens();
    const message =
      error instanceof Error ? error.message : 'Ошибка проверки авторизации';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  TAuthResponse,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('user/register', async (payload, { rejectWithValue }) => {
  try {
    return await registerUserApi(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка регистрации';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TAuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async (payload, { rejectWithValue }) => {
  try {
    return await loginUserApi(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка авторизации';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserApi();
    } catch (error) {
      clearTokens();
      const message = error instanceof Error ? error.message : 'Ошибка выхода';
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('user/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    return await updateUser(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка обновления профиля';
    return rejectWithValue(message);
  }
});
