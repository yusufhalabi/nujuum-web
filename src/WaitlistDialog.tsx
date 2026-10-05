import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon, Logo } from "./components";
import { supabase } from "./supabase";

export function WaitlistDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      request.current?.abort();
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    setError("");
    if (!supabase) {
      setError("Signups are temporarily unavailable. Please try again soon.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setStatus("saving");
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const { error: databaseError } = await supabase
        .from("Waitlist")
        .insert({ email: email.trim().toLowerCase() })
        .abortSignal(controller.signal);
      // An existing address is already subscribed; show the same confirmation.
      if (databaseError && databaseError.code !== "23505") throw databaseError;
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("We couldn’t save your email. Please try again.");
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
    }
  }

  return (
    <dialog
      ref={dialog}
      className="waitlist-dialog"
      aria-labelledby="waitlist-title"
      aria-describedby="waitlist-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="waitlist-panel">
        <button className="waitlist-close" aria-label="Close signup" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
        <div className="waitlist-brand"><Logo /></div>
        {status === "success" ? (
          <div className="waitlist-confirmation" role="status">
            <span className="eyebrow">A little closer.</span>
            <h2 id="waitlist-title">You’re on the list.</h2>
            <p id="waitlist-description">Thanks for saying hello. We’ll email you when Shams is ready for you.</p>
            <button className="button dark" onClick={onClose}>Lovely, thank you</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Meet your next conversation</span>
            <h2 id="waitlist-title">A little practice.<br />A whole new world.</h2>
            <p id="waitlist-description">Your personal language tutor, right in your texts. Leave your email for early access to Shams.</p>
            <form className="waitlist-form" onSubmit={submit} aria-busy={status === "saving"}>
              <label htmlFor="waitlist-email">Email address</label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@example.com"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(""); }}
                required
                maxLength={254}
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                readOnly={status === "saving"}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "waitlist-error" : undefined}
              />
              {error && <p id="waitlist-error" className="waitlist-error" role="alert">{error}</p>}
              <button type="submit" className="button dark" disabled={status === "saving"}>
                {status === "saving" ? "Joining…" : "Join the waitlist"}
                {status !== "saving" && <Icon name="arrow" size={17} />}
              </button>
              <p className="waitlist-note">We’ll only email you about Shams. <a href="/privacy" onClick={onClose}>Privacy</a></p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
