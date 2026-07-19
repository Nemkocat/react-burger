import { createSocketMiddleware } from '@services/middleware/socket-middleware';

import {
  feedOrdersClose,
  feedOrdersConnect,
  feedOrdersConnecting,
  feedOrdersDisconnect,
  feedOrdersError,
  feedOrdersMessage,
  feedOrdersOpen,
} from './feedOrdersSlice';

import type { TOrdersSocketMessage } from '@utils/types';

export const feedOrdersSocketMiddleware = createSocketMiddleware<TOrdersSocketMessage>({
  connect: feedOrdersConnect,
  disconnect: feedOrdersDisconnect,
  onConnecting: feedOrdersConnecting,
  onOpen: feedOrdersOpen,
  onClose: feedOrdersClose,
  onError: feedOrdersError,
  onMessage: feedOrdersMessage,
});
