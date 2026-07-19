import { createSocketMiddleware } from '@services/middleware/socket-middleware';

import {
  profileOrdersClose,
  profileOrdersConnect,
  profileOrdersConnecting,
  profileOrdersDisconnect,
  profileOrdersError,
  profileOrdersInvalidToken,
  profileOrdersMessage,
  profileOrdersOpen,
} from './profileOrdersSlice';

import type { TOrdersSocketMessage } from '@utils/types';

export const profileOrdersSocketMiddleware =
  createSocketMiddleware<TOrdersSocketMessage>(
    {
      connect: profileOrdersConnect,
      disconnect: profileOrdersDisconnect,
      onConnecting: profileOrdersConnecting,
      onOpen: profileOrdersOpen,
      onClose: profileOrdersClose,
      onError: profileOrdersError,
      onMessage: profileOrdersMessage,
      onInvalidToken: profileOrdersInvalidToken,
    },
    { withTokenRefresh: true }
  );
