import { useEffect, useRef, useState } from "react";
import { go } from "./navigation";
import { Link } from "./Link";
import { readProfile, saveProfile, type Profile } from "./profile";
import { Icon, Logo } from "./components";

const steps = [
  "welcome",
  "use-case-picks",
  "phone",
  "otp",
  "connect-email",
  "checkout",
  "handoff",
];
const goals = [
  ["chat", "Conversation"],
  ["voice", "Pronunciation"],
  ["book", "Vocabulary"],
  ["plane", "Travel"],
  ["heart", "Family"],
  ["sun", "Daily practice"],
  ["mail", "Work"],
  ["book", "Reading"],
  ["voice", "Listening"],
  ["chat", "Confidence"],
  ["grid", "Culture"],
  ["calendar", "Study"],
];
export function Onboarding({ login = false }: { login?: boolean }) {
  const stepFromURL = () => {
    const requested = new URLSearchParams(location.search).get("step");
    const aliases: Record<string, string> = {
      code: "otp",
      language: "connect-email",
      level: "checkout",
      ready: "handoff",
    };
    const candidate = requested ? aliases[requested] || requested : null;
    return candidate && steps.includes(candidate)
      ? candidate
      : login
        ? "phone"
        : "welcome";
  };
  const [step, setStep] = useState(stepFromURL),
    [profile, setProfile] = useState(readProfile),
    [phone, setPhone] = useState(""),
    [country, setCountry] = useState("+1"),
    [code, setCode] = useState(""),
    [error, setError] = useState(""),
    [yearly, setYearly] = useState(false),
    [plan, setPlan] = useState(
      new URLSearchParams(location.search).get("plan") === "plus"
        ? "plus"
        : "immersion",
    );
  const heading = useRef<HTMLHeadingElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const onPop = () => {
      setStep(stepFromURL());
      setError("");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [login]); // eslint-disable-line react-hooks/exhaustive-deps
  const index = steps.indexOf(step);
  const advance = (next: string) => {
    setHasInteracted(true);
    saveProfile(profile);
    setError("");
    go("/get-started?step=" + next);
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const update = (changes: Partial<Profile>) =>
    setProfile({ ...profile, ...changes });
  const finish = () => {
    saveProfile({
      ...profile,
      name: profile.name.trim() || "friend",
      complete: true,
    });
    go("/messages");
  };
  const next = () => {
    if (step === "welcome") {
      if (!profile.name.trim()) return;
      advance("use-case-picks");
    } else if (step === "use-case-picks") advance("phone");
    else if (step === "phone") {
      if (phone.replace(/\D/g, "").length < 6) {
        setError("Enter a valid phone number, or explore the preview below.");
        return;
      }
      advance("otp");
    } else if (step === "otp") {
      if (code !== "123456") {
        setError("For this preview, enter 123456. No SMS is sent.");
        return;
      }
      advance("connect-email");
    } else if (step === "connect-email") advance("checkout");
    else if (step === "checkout") advance("handoff");
    else finish();
  };
  const titles: Record<string, React.ReactNode> = {
    welcome: (
      <>
        Welcome to Shams<span>What’s your name?</span>
      </>
    ),
    "use-case-picks": (
      <>
        What brings you to Shams,
        <br />
        {profile.name.trim() || "friend"}?
      </>
    ),
    phone: login ? "Welcome back to Shams" : <>What’s your phone number?</>,
    otp: (
      <>
        Enter your verification code<span>Preview code: 123456</span>
      </>
    ),
    "connect-email": (
      <>
        You’re all set<span>Your first Shams lesson is ready</span>
      </>
    ),
    checkout: (
      <>
        Get more from Shams
        <span>
          More practice,
          <br className="plan-mobile-break" /> on your terms
        </span>
      </>
    ),
    handoff: (
      <>
        Welcome to Shams<span>Start the conversation</span>
      </>
    ),
  };
  return (
    <main className={"onboarding onboarding-" + step}>
      <form
        className="onboarding-shell"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <div className="onboarding-top">
          {index === 0 || login ? (
            <Link to="/" aria-label="Shams home">
              <Logo boxed />
            </Link>
          ) : (
            <div
              className="step-progress"
              aria-label={`Step ${index + 1} of ${steps.length}`}
            >
              {steps.map((s, i) => (
                <span
                  className={i === index ? "current" : i < index ? "done" : ""}
                  key={s}
                />
              ))}
            </div>
          )}
          {index === 0 || step === "use-case-picks" ? (
            <button
              type="button"
              className="skip-button"
              onClick={() => {
                saveProfile(profile);
                go("/home");
              }}
            >
              Set up later
            </button>
          ) : step === "checkout" ? (
            <button
              type="button"
              className="skip-button"
              onClick={() => advance("handoff")}
            >
              Not now
            </button>
          ) : null}
        </div>
        <h1 ref={heading} tabIndex={-1}>
          {titles[step]}
        </h1>
        {step === "handoff" && (
          <p className="handoff-description">
            Tap the button below to start your conversation with Shams in the
            preview.
          </p>
        )}
        <div
          className={"onboarding-body" + (hasInteracted ? " step-enter" : "")}
          key={step}
        >
          {step === "welcome" && (
            <label className="name-field">
              <span className="sr-only">Your name</span>
              <input
                autoComplete="given-name"
                placeholder="Your first name"
                maxLength={40}
                value={profile.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </label>
          )}
          {step === "use-case-picks" && (
            <fieldset className="goal-fieldset">
              <legend>Pick a few to start</legend>
              <div className="goal-pills">
                {goals.map(([icon, label]) => (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={profile.goals.includes(label)}
                    key={label}
                    onClick={() =>
                      update({
                        goals: profile.goals.includes(label)
                          ? profile.goals.filter((g) => g !== label)
                          : [...profile.goals, label],
                      })
                    }
                  >
                    <Icon name={icon} size={17} />
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {step === "phone" && (
            <div className="phone-step">
              <label className="phone-input">
                <select
                  aria-label="Country calling code"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {[
                    ["+1", "🇺🇸 +1"],
                    ["+33", "🇫🇷 +33"],
                    ["+44", "🇬🇧 +44"],
                    ["+49", "🇩🇪 +49"],
                    ["+971", "🇦🇪 +971"],
                    ["+966", "🇸🇦 +966"],
                    ["+963", "🇸🇾 +963"],
                    ["+961", "🇱🇧 +961"],
                  ].map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  autoComplete="tel-national"
                  aria-label="Phone number"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                />
              </label>
              <p className="field-help">
                Enter a number to preview verification.
                <br />
                No verification text will be sent.
              </p>
            </div>
          )}
          {step === "otp" && (
            <div className="code-step">
              <label className="otp-entry">
                <span className="sr-only">Verification code</span>
                <span className="otp-cells" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={i}
                      className={i === Math.min(code.length, 5) ? "active" : ""}
                    >
                      {code[i] || ""}
                    </span>
                  ))}
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  aria-describedby="code-hint"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </label>
              <p id="code-hint" className="code-resend">
                Didn’t receive a code?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setCode("");
                    setError("Preview code: 123456. No SMS is sent.");
                  }}
                >
                  Resend code
                </button>
              </p>
            </div>
          )}
          {step === "connect-email" && (
            <div
              className="connection-confirmed"
              aria-label="Your Shams preview is ready"
            >
              <div className="connected-app">
                <Logo boxed />
                <span className="connected-check">
                  <Icon name="check" size={17} />
                </span>
              </div>
            </div>
          )}
          {step === "checkout" && (
            <div className="onboarding-plans">
              <div
                className="plan-billing"
                role="group"
                aria-label="Billing period"
              >
                <button
                  type="button"
                  aria-pressed={!yearly}
                  onClick={() => setYearly(false)}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  aria-pressed={yearly}
                  onClick={() => setYearly(true)}
                >
                  Yearly
                </button>
              </div>
              {[
                {
                  id: "plus",
                  name: "Plus",
                  description:
                    "Personal language lessons and pronunciation practice, built around your everyday life",
                  monthly: 19,
                  annual: 15,
                  includes: "Everything in Free, plus:",
                  features: [
                    "Personalized daily language lessons",
                    "Voice notes and pronunciation practice",
                    "Remember and revisit new words",
                    "More room to practice",
                  ],
                },
                {
                  id: "immersion",
                  name: "Immersion",
                  description:
                    "Your most personal language tutor, bringing real conversations into your everyday life",
                  monthly: 49,
                  annual: 39,
                  includes: "Everything in Plus, plus:",
                  features: [
                    "Longer, deeper conversations",
                    "Practice for real-life situations",
                    "Your most personalized learning plan",
                    "Priority support whenever you need a little more help",
                  ],
                },
              ].map((option) => (
                <button
                  type="button"
                  className="onboarding-plan"
                  aria-pressed={plan === option.id}
                  key={option.id}
                  onClick={() => setPlan(option.id)}
                >
                  <span className="onboarding-plan-name">{option.name}</span>
                  <span className="onboarding-plan-description">
                    {option.description}
                  </span>
                  <span className="onboarding-plan-price">
                    <b>${yearly ? option.annual : option.monthly}</b> /mo
                  </span>
                  <span className="onboarding-plan-billing">
                    Billed{" "}
                    {yearly ? `Yearly · $${option.annual * 12}` : "Monthly"}
                  </span>
                  {plan === option.id && (
                    <span className="onboarding-plan-features">
                      <span>{option.includes}</span>
                      <span className="plan-feature-list">
                        {option.features.map((feature) => (
                          <span key={feature}>
                            <Icon name="check" size={12} />
                            {feature}
                          </span>
                        ))}
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {step === "handoff" && (
            <div
              className="handoff-art"
              aria-label="Start a conversation with Shams in Messages"
            >
              <span
                className="messages-app-icon"
                role="img"
                aria-label="Apple Messages"
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <linearGradient
                      id="message-bubble"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#e6f4e1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 18C28 18 13 31 13 48c0 10 5 18 14 24l-5 12 17-7c4 1 7 1 11 1 22 0 37-13 37-30S72 18 50 18Z"
                    fill="url(#message-bubble)"
                  />
                </svg>
              </span>
              <span className="handoff-shams">
                <span className="hello-bubble">hey, i’m Shams</span>
                <Logo boxed />
              </span>
            </div>
          )}
        </div>
        <div className="onboarding-bottom">
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {step === "welcome" && (
            <p className="terms-copy">
              By continuing, you can explore our{" "}
              <Link to="/terms">preview terms</Link> and{" "}
              <Link to="/privacy">privacy notice</Link>.
            </p>
          )}
          <button
            className="button dark onboarding-continue"
            disabled={
              (step === "welcome" && !profile.name.trim()) ||
              (step === "use-case-picks" && !profile.goals.length) ||
              (step === "phone" && !phone.trim()) ||
              (step === "otp" && code.length !== 6)
            }
            type="submit"
          >
            {step === "handoff"
              ? "Message Shams"
              : step === "otp"
                ? "Verify"
                : step === "checkout"
                  ? "Continue preview"
                  : "Continue"}
          </button>
          {step === "phone" && (
            <button
              type="button"
              className="preview-skip"
              onClick={() => advance("otp")}
            >
              Explore without a phone number
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
