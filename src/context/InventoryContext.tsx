import React, { createContext, useContext, useEffect, useState } from 'react';
import initialCarsData from '../data/cars.json';
import { Car } from '../types/car';

const STORAGE_KEY = 'autosat_inventory_v3';

interface InventoryContextValue {
  cars: Car[];
  isLoading: boolean;
  getCarById: (id: string) => Car | undefined;
  addCar: (car: Car) => void;
  updateCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  toggleSoldStatus: (id: string) => void;
  resetToSeed: () => void;
  exportJson: () => string;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Car[];
        }
      }
    } catch {
      // Fallback to seed JSON if storage unavailable
    }
    return initialCarsData as Car[];
  });

  const [isLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    } catch {
      // Ignore storage quota errors
    }
  }, [cars]);

  const getCarById = (id: string) => cars.find((c) => c.id === id);

  const addCar = (car: Car) => {
    setCars((prev) => [car, ...prev]);
  };

  const updateCar = (updated: Car) => {
    setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleSoldStatus = (id: string) => {
    setCars((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'available' ? 'sold' : 'available' } : c
      )
    );
  };

  const resetToSeed = () => {
    const seed = initialCarsData as Car[];
    setCars(seed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {
      // Ignore
    }
  };

  const exportJson = () => JSON.stringify(cars, null, 2);

  return (
    <InventoryContext.Provider
      value={{
        cars,
        isLoading,
        getCarById,
        addCar,
        updateCar,
        deleteCar,
        toggleSoldStatus,
        resetToSeed,
        exportJson,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return ctx;
}
