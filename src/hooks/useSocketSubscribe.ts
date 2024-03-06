import { useEffect } from 'react';
import { useWebSocketsContext } from 'src/contexts/WebSocketsContext';
import { SocketEvent } from 'src/types/websockets';

export const useSocketSubscribe = (
  eventName: SocketEvent,
  eventHandler: (...args: unknown[]) => unknown,
) => {
  const { socket } = useWebSocketsContext();

  useEffect(() => {
    if (!socket || !eventName || !eventHandler) return;

    console.log('SocketIO: adding listener', eventName);
    socket?.on(eventName, eventHandler);

    return () => {
      console.log('SocketIO: removing listener', eventName);

      if (!socket || !eventName || !eventHandler) return;
      socket?.off(eventName, eventHandler);
    };
  }, [eventHandler, eventName, socket]);
};
