"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Cookie notice — intentionally simple.
 *
 * Audit result (see /cookie for the full inventory): this site loads no
 * analytics, marketing pixels, or third-party embeds that set cookies.
 * Fonts are self-hosted at build time via next/font, so there is no
 * runtime request to Google's servers either. Per the Garante's own 2021
 * guidelines, a site using only strictly-technical cookies does not need
 * the multi-choice "accept / reject / customize" banner — a plain notice
 * is enough. If analytics/marketing are added later, this component (and
 * /cookie) must be upgraded to the full opt-in banner with prior blocking.
 */

const STORAGE_KEY = "limitless-cookie-notice-ack";
const RE_PROMPT_DAYS = 180;
const OPEN_EVENT = "limitless:open-cookie-info";

function isAcknowledged() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw) as { ts: number };
    const days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
    return days < RE_PROMPT_DAYS;
  } catch {
    return false;
  }
}

function acknowledge() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
  } catch {
    // localStorage unavailable — the notice will simply reappear next visit.
  }
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      className="underline-offset-4 hover:text-lime hover:underline"
    >
      Gestisci preferenze cookie
    </button>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Reads localStorage, so it must run after mount (SSR always renders
    // hidden); not a candidate for lazy useState init without risking a
    // hydration mismatch between server and client output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!isAcknowledged());
    const onOpen = () => setDialogOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  function handleAck() {
    acknowledge();
    setVisible(false);
  }

  return (
    <>
      {visible && (
        <div
          role="region"
          aria-label="Informativa cookie"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 px-5 py-4 backdrop-blur-xl md:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/90">
              Questo sito utilizza solo cookie tecnici, necessari al suo funzionamento. Nessun
              cookie di profilazione o analytics è installato.{" "}
              <Link href="/cookie" className="underline-offset-4 hover:text-lime hover:underline">
                Leggi la Cookie Policy
              </Link>
              .
            </p>
            <Button onClick={handleAck} className="btn-lime shrink-0">
              Ho capito
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferenze cookie</DialogTitle>
            <DialogDescription>
              Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento
              (nessuna preferenza da configurare). Non sono installati cookie di
              statistica/analytics né di marketing/profilazione. Se in futuro venissero aggiunti,
              questo pannello permetterà di accettarli o rifiutarli per categoria.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href="/cookie" className="btn-ghost">
              Vai alla Cookie Policy
            </Link>
            <Button onClick={() => setDialogOpen(false)} className="btn-lime">
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
