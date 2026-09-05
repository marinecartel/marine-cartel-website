"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const RFQContext = createContext<any>(null);

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([]);

  const addToRFQ = (product: any) => {
    setItems((prev) => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <RFQContext.Provider value={{ items, addToRFQ, removeItem }}>
      {children}
    </RFQContext.Provider>
  );
}

export const useRFQ = () => useContext(RFQContext);