"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true dopo l'idratazione (false nel render del server e senza JS). */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Movimento ridotto o Risparmio dati attivo: i video non partono da soli. */
export function useLowMotion() {
  return useSyncExternalStore(
    noop,
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      return reduce || Boolean(c?.saveData);
    },
    () => false,
  );
}
