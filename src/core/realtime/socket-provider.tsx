'use client';

import { createContext, useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';

const SocketContext = createContext<Socket | null>(null);

// A true module-level singleton, not tied to a component's mount lifecycle.
// React Strict Mode's dev-only mount→cleanup→mount cycle would otherwise
// call `.disconnect()` on the "real" socket during the simulated cleanup,
// leaving it permanently disconnected (`.disconnect()` is manual and socket.io
// won't auto-reconnect after it). One connection per browser tab is also
// simply the right lifetime here — every protected page shares it.
let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(env.wsUrl, { transports: ['websocket'] });
  }
  return socket;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [instance] = useState<Socket | null>(() =>
    typeof window === 'undefined' ? null : getSocket(),
  );

  return (
    <SocketContext.Provider value={instance}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): Socket | null {
  return useContext(SocketContext);
}
