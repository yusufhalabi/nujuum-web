import { useState } from "react";
export function Logo({ boxed = false }: { boxed?: boolean }) {
  return (
    <span className={"shams-logo " + (boxed ? "logo-box" : "")}>
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="19" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="M20 2v6M20 30v6M3 19h6M31 19h6M8 7l4 4M28 27l4 4M8 31l4-4M28 11l4-4"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
const iconPaths: Record<string, string> = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  right: "m9 5 7 7-7 7",
  back: "m15 5-7 7 7 7",
  chevron: "m6 9 6 6 6-6",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 8h16M4 16h16",
  plus: "M12 5v14M5 12h14",
  check: "m5 12 4 4L19 6",
  chat: "M20 11a8 8 0 0 1-8 8H5l-3 2 1-6a8 8 0 1 1 17-4Z",
  plane: "m21 3-6 18-4-8-8-4 18-6ZM11 13l10-10",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  voice: "M12 3v18M8 7v10M4 10v4M16 6v12M20 9v6",
  sun: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  book: "M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v15h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3V4Zm9 2v15",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  play: "m8 4 12 8-12 8V4Z",
  calendar:
    "M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Zm2-3v6M17 2v6M3 10h18M7 14h2M12 14h2M7 17h2",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  mail: "M3 5h18v14H3V5Zm0 2 9 6 9-6",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Z",
  grid: "M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7ZM14 14h7v7h-7v-7Z",
  chart: "M4 20V10M12 20V4M20 20v-7",
  send: "M12 20V4M5 11l7-7 7 7",
  smile:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8 9h.01M16 9h.01M8 14s1 3 4 3 4-3 4-3",
};
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name] ?? iconPaths.chat} />
    </svg>
  );
}
export function Phone() {
  return (
    <div
      className="phone-device"
      role="img"
      aria-label="Preview of a Shams language lesson in iMessage"
    >
      <div className="phone-surface">
        <div className="phone-status">
          <b>9:41</b>
          <div className="dynamic-island" />
          <span className="phone-signals" aria-hidden="true">
            <svg width="61" height="12" viewBox="0 0 61 12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx=".7" />
              <rect x="4" y="6" width="3" height="6" rx=".7" />
              <rect x="8" y="3" width="3" height="9" rx=".7" />
              <rect x="12" width="3" height="12" rx=".7" />
              <path d="M20 3a11 11 0 0 1 15 0l-1.5 1.5a9 9 0 0 0-12 0Zm3 3a7 7 0 0 1 9 0l-1.5 1.5a5 5 0 0 0-6 0Zm3 3a3 3 0 0 1 3 0l-1.5 2Z" />
              <rect
                x="40"
                y="1.5"
                width="18"
                height="9"
                rx="2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth=".8"
                opacity=".5"
              />
              <rect x="42" y="3" width="14" height="6" rx="1" />
              <path d="M59 4v4c2 0 2-4 0-4" opacity=".5" />
            </svg>
          </span>
        </div>
        <div className="phone-contact">
          <span className="phone-back">‹</span>
          <Logo boxed />
          <b>
            Shams <span>›</span>
          </b>
        </div>
        <div className="phone-conversation">
          <div className="bubble incoming">
            a little Arabic for your day? ☀️
          </div>
          <div className="bubble outgoing">yes! how do I say good morning?</div>
          <div className="bubble incoming">
            <span lang="ar" dir="rtl">
              صباح الخير
            </span>{" "}
            (sabah el-kheir)
          </div>
          <div className="bubble incoming">
            literally, “a morning of goodness.”
            <br />
            try saying it out loud
          </div>
          <div className="bubble outgoing">sabah el-kheir ☀️</div>
          <small className="delivered">Delivered</small>
          <div className="bubble incoming typing">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="phone-composer">
          <span>＋</span>
          <div>
            Message Shams
            <Icon name="voice" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function MessageWindow({
  interactive = false,
}: {
  interactive?: boolean;
}) {
  const [draft, setDraft] = useState("hey Shams, let’s learn something new"),
    [sent, setSent] = useState<string[]>([]);
  return (
    <div className="imessage-window">
      <div className="imessage-header">
        <Logo boxed />
        <span>Shams</span>
      </div>
      <div className="imessage-transcript">
        <p className="imessage-welcome">
          Start your conversation with Shams by sending a message.
        </p>
        <p className="imessage-response">
          Your personal language tutor
          <br />
          <span>One conversation at a time.</span>
        </p>
        {interactive && (
          <small className="chat-preview-label">
            Conversation preview · Messages stay on this device
          </small>
        )}
        <div className="sent-messages">
          {sent.map((text, i) => (
            <div className="bubble outgoing" key={i}>
              {text}
            </div>
          ))}
        </div>
      </div>
      <form
        className="imessage-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) {
            setSent([...sent, draft.trim()]);
            setDraft("");
          }
        }}
      >
        <span className="composer-plus">＋</span>
        <input
          aria-label="Message Shams"
          placeholder="Message Shams"
          value={interactive ? draft : "hey Shams, let’s learn something new"}
          readOnly={!interactive}
          onChange={(e) => setDraft(e.target.value)}
        />
        {interactive ? (
          <button aria-label="Send preview message" disabled={!draft.trim()}>
            <Icon name="send" />
          </button>
        ) : (
          <Icon name="smile" size={28} />
        )}
      </form>
    </div>
  );
}
