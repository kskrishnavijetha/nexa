
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ServiceState {
  connectedServices: string[];
  addService: (service: string) => void;
  removeService: (service: string) => void;
}

const ServiceContext = createContext<ServiceState | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectedServices, setConnectedServices] = useState<string[]>([]);

  const addService = (service: string) => {
    setConnectedServices(prev => [...prev, service]);
  };

  const removeService = (service: string) => {
    setConnectedServices(prev => prev.filter(s => s !== service));
  };

  return (
    <ServiceContext.Provider value={{ connectedServices, addService, removeService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = (): ServiceState => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};
