export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Ready to receive real testimonials as soon as they come in (see brief
 * §8) — not rendered anywhere yet since there is no real quote to show,
 * and an empty/fake placeholder would undermine trust rather than build it.
 * Wire it into the homepage's social-proof section by mapping a
 * `Testimonial[]` once the first ones are collected (e.g. "I 2 Re").
 */
export function TestimonialCard({ quote, author, role }: Testimonial) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-7">
      <blockquote className="font-display text-lg leading-relaxed tracking-[-0.01em] text-foreground/90">
        “{quote}”
      </blockquote>
      <figcaption className="mt-6 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{author}</span> — {role}
      </figcaption>
    </figure>
  );
}
