import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from "@/components/ui/use-toast";

// Define stricter event types (replace 'any' with actual event names and data types later)
interface ServerToClientEvents {
  // Example: receiveMessage: (message: { text: string; sender: string }) => void;
  noArg: () => void; // Placeholder if no events defined yet
}

interface ClientToServerEvents {
  // Example: sendMessage: (message: { text: string; room: string }) => void;
  hello: () => void; // Placeholder if no events defined yet
}


interface SocketContextType {
  // Use the stricter Socket type
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connected: boolean;
  // connect function might not be needed if auto-connecting, but keep disconnect
  // connect: () => void; // Optional: You could keep this if manual connection is ever needed
  disconnect: () => void;
}

// Use Partial<> for default context to avoid null checks everywhere initially
// Or provide valid initial functions/values
const SocketContext = createContext<Partial<SocketContextType>>({
  socket: null,
  connected: false,
  disconnect: () => console.warn("Disconnect function called before Provider setup"),
});

export const useSocket = (): Partial<SocketContextType> => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
  serverUrl: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  serverUrl
}) => {
  // Use the stricter Socket type here too
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  // Manual disconnect function remains useful
  const disconnect = () => {
    if (socket) {
      console.log('Disconnecting manually...');
      socket.disconnect();
      // State updates will happen via the 'disconnect' event listener below
    }
  };

  // Effect to handle connection and listeners
  useEffect(() => {
    console.log('SocketProvider useEffect running. Connecting...');

    // Create the socket instance
    const socketInstance = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true // This is default, but explicit is fine
    });

    // ---- EVENT LISTENERS ----
    const onConnect = () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
      toast({
        title: "Connected",
        description: "Successfully connected to messaging server",
      });
    };

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
      // Only show toast if it wasn't a manual disconnect client-side
      if (reason !== 'io client disconnect') {
        toast({
          title: "Disconnected",
          description: `Lost connection: ${reason}`,
          variant: "destructive"
        });
      }
      // No need to setSocket(null) here, reconnection might happen
    };

    const onConnectError = (error: Error) => {
      console.error('Connection error:', error);
      setConnected(false); // Ensure connected is false on error
      toast({
        title: "Connection Error",
        description: `Could not connect: ${error.message}`,
        variant: "destructive"
      });
    };

    // Attach listeners
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    // Set the socket instance in state
    setSocket(socketInstance);

    // ---- CLEANUP LOGIC ----
    return () => {
      console.log('SocketProvider cleanup. Disconnecting socket...');
      // Remove listeners
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      // Disconnect socket
      socketInstance.disconnect();
      // Reset state after disconnect during cleanup
      setConnected(false);
      setSocket(null);
    };
  }, [serverUrl, toast]); // Rerun effect if serverUrl changes

  return (
    // Provide the socket instance, connection status, and disconnect function
    <SocketContext.Provider value={{ socket, connected, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};