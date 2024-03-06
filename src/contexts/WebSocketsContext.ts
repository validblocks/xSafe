import React, { useContext } from 'react';
import { Socket } from 'socket.io-client';

type WebSocketsContextReturnType = {
  socket: Socket | null;
};

export const WebSocketsContext =
  React.createContext<WebSocketsContextReturnType>({
    socket: null,
  });

export const useWebSocketsContext = () => useContext(WebSocketsContext);
