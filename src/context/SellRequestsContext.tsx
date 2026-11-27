import React, { createContext, useContext, useEffect, useState } from 'react';
import { SellRequest, SellRequestStatus } from '../types/car';

const SELL_REQUESTS_KEY = 'autosat_sell_requests_v1';

interface SellRequestsContextValue {
  sellRequests: SellRequest[];
  addSellRequest: (req: Omit<SellRequest, 'id' | 'createdAt' | 'status'>) => SellRequest;
  updateSellRequestStatus: (id: string, status: SellRequestStatus) => void;
  deleteSellRequest: (id: string) => void;
}

const SellRequestsContext = createContext<SellRequestsContextValue | undefined>(undefined);

export const SellRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellRequests, setSellRequests] = useState<SellRequest[]>(() => {
    try {
      const raw = localStorage.getItem(SELL_REQUESTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as SellRequest[];
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(SELL_REQUESTS_KEY, JSON.stringify(sellRequests));
    } catch {
      // Ignore storage quota errors
    }
  }, [sellRequests]);

  const addSellRequest = (input: Omit<SellRequest, 'id' | 'createdAt' | 'status'>): SellRequest => {
    const newItem: SellRequest = {
      ...input,
      id: `SELL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    setSellRequests((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateSellRequestStatus = (id: string, status: SellRequestStatus) => {
    setSellRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const deleteSellRequest = (id: string) => {
    setSellRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <SellRequestsContext.Provider
      value={{
        sellRequests,
        addSellRequest,
        updateSellRequestStatus,
        deleteSellRequest,
      }}
    >
      {children}
    </SellRequestsContext.Provider>
  );
};

export function useSellRequests() {
  const ctx = useContext(SellRequestsContext);
  if (!ctx) {
    throw new Error('useSellRequests must be used within SellRequestsProvider');
  }
  return ctx;
}
