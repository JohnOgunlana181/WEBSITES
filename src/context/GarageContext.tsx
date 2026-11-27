import React, { createContext, useContext, useEffect, useState } from 'react';
import { Car } from '../types/car';

const GARAGE_STORAGE_KEY = 'autosat_garage_ids_v1';
const SAVED_STORAGE_KEY = 'autosat_saved_ids_v1';
const COMPARE_STORAGE_KEY = 'autosat_compare_ids_v1';
export const MAX_COMPARE_CARS = 3;

interface GarageContextValue {
  garageIds: string[];
  savedIds: string[];
  compareIds: string[];
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToGarage: (carId: string) => void;
  removeFromGarage: (carId: string) => void;
  clearGarage: () => void;
  toggleSaved: (carId: string) => void;
  isSaved: (carId: string) => boolean;
  isInGarage: (carId: string) => boolean;
  getGarageCars: (allCars: Car[]) => Car[];
  toggleCompare: (carId: string) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  isInCompare: (carId: string) => boolean;
  getCompareCars: (allCars: Car[]) => Car[];
}

const GarageContext = createContext<GarageContextValue | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [garageIds, setGarageIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(GARAGE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(garageIds));
    } catch {
      // Ignore
    }
  }, [garageIds]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      // Ignore
    }
  }, [compareIds]);

  const addToGarage = (carId: string) => {
    setGarageIds((prev) => (prev.includes(carId) ? prev : [...prev, carId]));
    setDrawerOpen(true);
  };

  const removeFromGarage = (carId: string) => {
    setGarageIds((prev) => prev.filter((id) => id !== carId));
  };

  const clearGarage = () => setGarageIds([]);

  const toggleSaved = (carId: string) => {
    setSavedIds((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const toggleCompare = (carId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      }
      if (prev.length >= MAX_COMPARE_CARS) {
        return [...prev.slice(1), carId];
      }
      return [...prev, carId];
    });
  };

  const removeFromCompare = (carId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== carId));
  };

  const clearCompare = () => setCompareIds([]);

  const isSaved = (carId: string) => savedIds.includes(carId);
  const isInGarage = (carId: string) => garageIds.includes(carId);
  const isInCompare = (carId: string) => compareIds.includes(carId);
  const getGarageCars = (allCars: Car[]) =>
    garageIds.map((id) => allCars.find((c) => c.id === id)).filter((c): c is Car => Boolean(c));
  const getCompareCars = (allCars: Car[]) =>
    compareIds.map((id) => allCars.find((c) => c.id === id)).filter((c): c is Car => Boolean(c));

  return (
    <GarageContext.Provider
      value={{
        garageIds,
        savedIds,
        compareIds,
        drawerOpen,
        setDrawerOpen,
        addToGarage,
        removeFromGarage,
        clearGarage,
        toggleSaved,
        isSaved,
        isInGarage,
        getGarageCars,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        getCompareCars,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error('useGarage must be used within GarageProvider');
  return ctx;
}
