type Bubble = { from: "automation" | "customer"; text: string };

const CONVERSATION: Bubble[] = [
  {
    from: "automation",
    text: "Ciao Marco! Grazie per averci scelto oggi 🙌 Ci farebbe davvero piacere un tuo feedback su Google, bastano 30 secondi → [link recensione]",
  },
  { from: "customer", text: "Certo, arrivo subito! Servizio fantastico, tornerò sicuramente 😊" },
  { from: "automation", text: "Grazie mille! Ci vediamo alla prossima visita." },
];

/**
 * Honest, clearly-labeled mockup of an automation in action — not a real
 * client result (none of the AI modules has one yet). Static, no signature
 * motion, consistent with the sober animation principle used everywhere
 * outside the hero and the before/after slider.
 */
export function AutomationDemo() {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-5 py-3">
        <span className="text-sm font-semibold text-foreground">Recensioni Automatiche</span>
        <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-lime">
          Esempio dimostrativo
        </span>
      </div>
      <div className="flex flex-col gap-3 p-5">
        {CONVERSATION.map((bubble, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              bubble.from === "automation"
                ? "self-start rounded-bl-sm bg-lime text-primary-foreground"
                : "self-end rounded-br-sm bg-secondary text-foreground/90"
            }`}
          >
            {bubble.text}
          </div>
        ))}
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Conversazione di esempio, non un cliente reale — mostra come funziona il modulo.
      </p>
    </div>
  );
}
