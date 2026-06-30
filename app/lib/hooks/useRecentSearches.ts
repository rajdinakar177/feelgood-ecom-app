// app/lib/hooks/useRecentSearches.ts
"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "feelgood-recent-searches";
const MAX_RECENT = 6;

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  const addSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecent((prev) => {
      const updated = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())]
        .slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeSearch = useCallback((term: string) => {
    setRecent((prev) => {
      const updated = prev.filter((t) => t !== term);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { recent, addSearch, removeSearch, clearAll };
}