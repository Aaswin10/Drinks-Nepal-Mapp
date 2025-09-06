import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { io } from 'socket.io-client';

const SOCKET_CONFIG = {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
};

export const useSocketManager = (shouldConnect = false) => {
  const socketRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (socketRef.current?.connected || !shouldConnect) return socketRef.current;

    const socketUrl =
      Platform.OS === 'android' ? process.env.APP_SOCKET_URL_ANDROID : process.env.APP_SOCKET_URL;

    socketRef.current = io(socketUrl, SOCKET_CONFIG);

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
      reconnectAttemptsRef.current = 0;
    });

    socketRef.current.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
      reconnectAttemptsRef.current++;

      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.log('Max reconnection attempts reached');
        disconnect();
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        setTimeout(() => connect(), 1000);
      }
    });

    return socketRef.current;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const emitLocation = (orderId, latitude, longitude) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('updateLocation', {
        orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    if (shouldConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [shouldConnect]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    emitLocation,
    isConnected: socketRef.current?.connected || false,
  };
};