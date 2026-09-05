import React, { createContext, useContext, useState, useEffect } from "react";
import { RequesterUser, fetchRequesters } from "../api.js";

const LOCAL_STORAGE_KEY = "toktickit_requester";

interface RequesterContextType {
  selectedRequester: RequesterUser | null;
  setSelectedRequester: (user: RequesterUser | null) => void;
  clearRequester: () => void;
  requesters: RequesterUser[];
  isLoading: boolean;
  error: string | null;
  refreshRequesters: () => Promise<void>;
}

const RequesterContext = createContext<RequesterContextType | undefined>(undefined);

export const RequesterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRequester, setSelectedRequesterState] = useState<RequesterUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [requesters, setRequesters] = useState<RequesterUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequesters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRequesters();
      setRequesters(data);

      // Validate selected user still exists in active requesters
      if (selectedRequester) {
        const found = data.find((r) => r.id === selectedRequester.id);
        if (!found) {
          setSelectedRequesterState(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else {
          // Update details if changed
          setSelectedRequesterState(found);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(found));
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load requesters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequesters();
  }, []);

  const setSelectedRequester = (user: RequesterUser | null) => {
    setSelectedRequesterState(user);
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const clearRequester = () => {
    setSelectedRequester(null);
  };

  return (
    <RequesterContext.Provider
      value={{
        selectedRequester,
        setSelectedRequester,
        clearRequester,
        requesters,
        isLoading,
        error,
        refreshRequesters: loadRequesters,
      }}
    >
      {children}
    </RequesterContext.Provider>
  );
};

export function useRequester() {
  const context = useContext(RequesterContext);
  if (!context) {
    throw new Error("useRequester must be used within a RequesterProvider");
  }
  return context;
}
