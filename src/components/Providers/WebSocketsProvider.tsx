import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
// import { xSafeApiUrl } from 'src/config';
import { WebSocketsContext } from 'src/contexts/WebSocketsContext';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { SocketEvent } from 'src/types/websockets';

interface WebSocketsProviderProps {
  children: React.ReactNode;
}

export const WebSocketsProvider: React.FC<WebSocketsProviderProps> = ({
  children,
}) => {
  const oldContractAddress = useRef<string | null>(null);
  const currentContract = useSelector(currentMultisigContractSelector);

  const envUrl = import.meta.env.VITE_WEBSOCKETS_URL;
  const socket = useRef(
    socketIOClient(envUrl ?? '', {
      transports: ['polling'],
    }),
  );

  useEffect(() => {
    if (!currentContract?.address) return;

    const currentAddr = currentContract.address;

    if (currentAddr !== oldContractAddress) {
      socket.current.removeAllListeners();
      socket.current.emit(SocketEvent.UNREGISTER);
      console.log('UNREGISTER EMITTED ', socket.current.id);
      socket.current.emit(SocketEvent.REGISTER, currentAddr);
      console.log('REGISTER EMITTED ', currentContract?.address);
      oldContractAddress.current = currentAddr;
    }

    socket.current.on(SocketEvent.REGISTER_RESPONSE, () => {
      console.log('REGISTER RESPONSE: Registered to WebSocket server');
    });

    socket.current.on(SocketEvent.UNREGISTER_RESPONSE, () => {
      console.log('UNREGISTER RESPONSE: Unregistered to WebSocket server');
    });

    return () => {
      if (socket?.current && !currentAddr) {
        socket.current.emit(SocketEvent.UNREGISTER);
        socket.current.removeAllListeners();
        socket.current.close();
      }
    };
  }, [currentContract?.address]);

  return (
    <WebSocketsContext.Provider value={{ socket: socket.current }}>
      {children}
    </WebSocketsContext.Provider>
  );
};
