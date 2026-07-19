import { refreshTokenRequest } from '@utils/api';
import { getAccessTokenForSocket } from '@utils/orders';
import { getAccessToken } from '@utils/token';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

export type TWsActions<TMessage> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TMessage>;
  onInvalidToken?: ActionCreatorWithoutPayload;
};

type TSocketMiddlewareOptions = {
  withTokenRefresh?: boolean;
};

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';

const replaceTokenInUrl = (url: string, token: string): string => {
  const [base] = url.split('?');
  return `${base}?token=${token}`;
};

export const createSocketMiddleware = <TMessage>(
  wsActions: TWsActions<TMessage>,
  options: TSocketMiddlewareOptions = {}
): Middleware => {
  const { withTokenRefresh = false } = options;

  return (store) => {
    let socket: WebSocket | null = null;
    let shouldReconnect = false;
    let currentUrl = '';
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isRefreshingToken = false;

    const clearReconnectTimer = (): void => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const detachSocketHandlers = (): void => {
      if (!socket) {
        return;
      }

      socket.onopen = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;
    };

    const closeSocket = (stopReconnect = true): void => {
      clearReconnectTimer();

      if (stopReconnect) {
        shouldReconnect = false;
      }

      if (socket) {
        detachSocketHandlers();
        socket.close();
        socket = null;
      }
    };

    const openSocket = (url: string): void => {
      closeSocket(false);
      currentUrl = url;
      shouldReconnect = true;
      socket = new WebSocket(url);

      if (wsActions.onConnecting) {
        store.dispatch(wsActions.onConnecting());
      }

      socket.onopen = (): void => {
        if (wsActions.onOpen) {
          store.dispatch(wsActions.onOpen());
        }
      };

      socket.onerror = (): void => {
        store.dispatch(wsActions.onError('Ошибка WebSocket-соединения'));
      };

      socket.onclose = (): void => {
        if (wsActions.onClose) {
          store.dispatch(wsActions.onClose());
        }

        if (shouldReconnect && currentUrl) {
          clearReconnectTimer();
          reconnectTimer = setTimeout(() => {
            openSocket(currentUrl);
          }, 3000);
        }
      };

      socket.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as TMessage & {
            success?: boolean;
            message?: string;
          };

          if (
            withTokenRefresh &&
            data &&
            data.success === false &&
            data.message === INVALID_TOKEN_MESSAGE
          ) {
            if (wsActions.onInvalidToken) {
              store.dispatch(wsActions.onInvalidToken());
            }

            if (isRefreshingToken) {
              return;
            }

            isRefreshingToken = true;

            void refreshTokenRequest()
              .then((tokenData) => {
                const rawToken = getAccessTokenForSocket(tokenData.accessToken);
                const nextUrl = replaceTokenInUrl(currentUrl, rawToken);
                openSocket(nextUrl);
              })
              .catch(() => {
                shouldReconnect = false;
                store.dispatch(wsActions.onError(INVALID_TOKEN_MESSAGE));
              })
              .finally(() => {
                isRefreshingToken = false;
              });

            return;
          }

          store.dispatch(wsActions.onMessage(data));
        } catch {
          store.dispatch(wsActions.onError('Некорректные данные WebSocket'));
        }
      };
    };

    return (next) => (action) => {
      if (wsActions.connect.match(action)) {
        let url = action.payload;

        if (withTokenRefresh) {
          const accessToken = getAccessToken();

          if (accessToken) {
            url = replaceTokenInUrl(url, getAccessTokenForSocket(accessToken));
          }
        }

        openSocket(url);
      }

      if (wsActions.disconnect.match(action)) {
        closeSocket(true);
        currentUrl = '';
      }

      return next(action);
    };
  };
};
