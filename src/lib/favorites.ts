"use client";
import { useCallback, useEffect, useState } from "react";

/** Favorites are stored only on this device (localStorage). No account, nothing sent to a server. */
const KEY = "wtc:favorites:v1";
const EVT = "wtc:favorites-changed";
export type FavKey = `${"place" | "trail" | "event" | "neighborhood"}:${string}`;

function read(): FavKey[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(list: FavKey[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* storage unavailable (private mode) — favorites simply won't persist */
  }
}

export function useFavorites() {
  const [list, setList] = useState<FavKey[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setList(read());
    sync();
    setReady(true);
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const has = useCallback((k: FavKey) => list.includes(k), [list]);
  const toggle = useCallback((k: FavKey) => {
    const cur = read();
    write(cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]);
  }, []);
  return { list, has, toggle, ready };
}
