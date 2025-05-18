import { createContext, useContext, useState } from 'react';

const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
  const [connection, setConnection] = useState(0);

  const increaseConnection = (amount = 1) => {
    setConnection((prev) => prev + amount);
  };

  const resetConnection = () => {
    setConnection(0);
  };

  return (
    <ConnectionContext.Provider value={{ connection, increaseConnection, resetConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
