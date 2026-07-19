import { describe, expect, it } from 'vitest';

import { mockUser } from '@utils/test-mocks';

import { clearUserError, userSlice } from './userSlice';
import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from './userThunk';

import type { TAuthResponse } from '@utils/types';

const reducer = userSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

const authResponse: TAuthResponse = {
  success: true,
  accessToken: 'Bearer token',
  refreshToken: 'refresh',
  user: mockUser,
};

describe('userSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it('should clear user error', () => {
    const withError = { ...initialState, error: 'error' };
    expect(reducer(withError, clearUserError()).error).toBeNull();
  });

  it('should handle checkUserAuth.pending', () => {
    const state = reducer(initialState, checkUserAuth.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle checkUserAuth.fulfilled', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      checkUserAuth.fulfilled(mockUser, '', undefined)
    );

    expect(state).toMatchObject({
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
    });
  });

  it('should handle checkUserAuth.rejected', () => {
    const state = reducer(
      { ...initialState, isLoading: true, user: mockUser },
      checkUserAuth.rejected(null, '', undefined, 'Unauthorized')
    );

    expect(state).toMatchObject({
      user: null,
      isAuthChecked: true,
      isLoading: false,
    });
  });

  it('should handle registerUser.pending and fulfilled', () => {
    const pending = reducer(initialState, registerUser.pending('', mockUser as never));
    expect(pending.isLoading).toBe(true);

    const fulfilled = reducer(
      pending,
      registerUser.fulfilled(authResponse, '', {
        email: mockUser.email,
        password: 'pass',
        name: mockUser.name,
      })
    );

    expect(fulfilled.user).toEqual(mockUser);
    expect(fulfilled.isLoading).toBe(false);
  });

  it('should handle registerUser.rejected', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      registerUser.rejected(null, '', { email: '', password: '', name: '' }, 'fail')
    );

    expect(state.error).toBe('fail');
    expect(state.isLoading).toBe(false);
  });

  it('should handle loginUser.pending, fulfilled and rejected', () => {
    const pending = reducer(
      initialState,
      loginUser.pending('', { email: '', password: '' })
    );
    expect(pending.isLoading).toBe(true);

    const fulfilled = reducer(
      pending,
      loginUser.fulfilled(authResponse, '', { email: '', password: '' })
    );
    expect(fulfilled.user).toEqual(mockUser);

    const rejected = reducer(
      { ...initialState, isLoading: true },
      loginUser.rejected(null, '', { email: '', password: '' }, 'bad credentials')
    );
    expect(rejected.error).toBe('bad credentials');
  });

  it('should handle logoutUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, user: mockUser, isLoading: true },
      logoutUser.fulfilled({ success: true, message: 'ok' }, '', undefined)
    );

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('should handle updateUserProfile.pending, fulfilled and rejected', () => {
    const payload = { name: 'New', email: 'new@test.com', password: '' };

    const pending = reducer(initialState, updateUserProfile.pending('', payload));
    expect(pending.isLoading).toBe(true);

    const fulfilled = reducer(
      pending,
      updateUserProfile.fulfilled({ name: 'New', email: 'new@test.com' }, '', payload)
    );
    expect(fulfilled.user).toEqual({ name: 'New', email: 'new@test.com' });

    const rejected = reducer(
      { ...initialState, isLoading: true },
      updateUserProfile.rejected(null, '', payload, 'update fail')
    );
    expect(rejected.error).toBe('update fail');
  });
});
