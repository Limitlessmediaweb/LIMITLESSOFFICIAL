"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BUSINESS, PACKS } from "@/lib/content";

export function ContactForm() {
  const searchParams = useSearchParams();
  const packSlug = searchParams.get("pacchetto");
  const preselectedPack = PACKS.find((p) => p.slug === packSlug);

  const [form, setForm] = useState({ nome: "", email: "", messaggio: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setError(true);
      return;
    }
    setError(false);

    const subjectPack = preselectedPack ? ` — ${preselectedPack.name}` : "";
    const subject = `Richiesta consulenza${subjectPack} — ${form.nome || "Nuovo contatto"}`;
    const bodyLines = [
      `Nome: ${form.nome}`,
      `Email: ${form.email}`,
      preselectedPack ? `Pacchetto di interesse: ${preselectedPack.name}` : null,
      "",
      form.messaggio,
    ].filter((l) => l !== null);

    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    setSent(true);
  }

  const field =
    "w-full rounded-2xl border border-border bg-secondary px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/40";

  return (
    <form onSubmit={onSubmit} className="panel space-y-5 p-6 md:p-8" noValidate>
      {preselectedPack && (
        <p className="rounded-xl border border-lime/30 bg-lime-soft px-4 py-3 text-sm text-foreground/90">
          Richiesta per <strong>{preselectedPack.name}</strong>
        </p>
      )}

      <div>
        <Label htmlFor="nome" className="mb-2 block text-sm text-muted-foreground">
          Nome
        </Label>
        <Input
          id="nome"
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Il tuo nome"
          className={field}
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="nome@esempio.it"
          className={field}
        />
      </div>
      <div>
        <Label htmlFor="messaggio" className="mb-2 block text-sm text-muted-foreground">
          Messaggio
        </Label>
        <Textarea
          id="messaggio"
          required
          rows={5}
          value={form.messaggio}
          onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
          placeholder="Raccontaci la tua attività e cosa ti serve."
          className={field}
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consenso"
          checked={consent}
          onCheckedChange={(v) => {
            setConsent(v === true);
            if (v === true) setError(false);
          }}
          aria-describedby={error ? "consenso-errore" : undefined}
          className="mt-0.5"
        />
        <Label htmlFor="consenso" className="text-sm font-normal leading-relaxed text-muted-foreground">
          Ho letto l&apos;
          <Link href="/privacy" target="_blank" className="text-lime underline-offset-4 hover:underline">
            informativa privacy
          </Link>{" "}
          e acconsento al trattamento dei miei dati per essere ricontattato.
        </Label>
      </div>
      {error && (
        <p id="consenso-errore" role="alert" className="text-sm text-destructive">
          Devi accettare l&apos;informativa privacy per inviare la richiesta.
        </p>
      )}

      <Button type="submit" className="btn-lime w-full">
        Invia richiesta
      </Button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {sent
          ? "Si è aperto il tuo client email con i dati già compilati: invia il messaggio da lì per completare la richiesta."
          : "L'invio apre il tuo client email con i dati già compilati."}
      </p>
    </form>
  );
}
