import { useEffect, useRef, useState } from "react";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";
import { Logo, Icon, Phone, MessageWindow } from "./components";
import { Link } from "./Link";
import { lessonCards } from "./lessons";
import { WaitlistDialog } from "./WaitlistDialog";
import { signupEvent } from "./navigation";

function Header() {
  const [menu, setMenu] = useState("");
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu("");
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <Link to="/" aria-label="Shams home" className="brand">
        <Logo />
      </Link>
      <nav aria-label="Primary" className="desktop-nav">
        {["Product", "Resources"].map((label) => (
          <div className="nav-group" key={label}>
            <button
              aria-expanded={menu === label}
              onClick={() => setMenu(menu === label ? "" : label)}
            >
              {label}
              <Icon name="chevron" size={14} />
            </button>
            {menu === label && (
              <div className="nav-popover" onClick={() => setMenu("")}>
                {(label === "Product"
                  ? [
                      ["Meet Shams", "/"],
                      ["Lessons", "/lessons"],
                      ["Your Shams", "/home"],
                    ]
                  : [
                      ["How it works", "/docs"],
                      ["FAQs", "/faq"],
                      ["About Shams", "/about"],
                    ]
                ).map(([text, path]) => (
                  <Link to={path} key={path}>
                    {text}
                    <Icon name="arrow" size={15} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link to="/pricing">Pricing</Link>
        <Link to="/about">Company</Link>
      </nav>
      <div className="header-actions">
        <Link to="/login">Log in</Link>
        <Link to="/get-started" className="button small dark">
          Get Started
        </Link>
      </div>
      <button
        className="mobile-menu-toggle"
        aria-label={menu === "mobile" ? "Close menu" : "Open menu"}
        aria-expanded={menu === "mobile"}
        onClick={() => setMenu(menu === "mobile" ? "" : "mobile")}
      >
        <Icon name={menu === "mobile" ? "close" : "menu"} />
      </button>
      {menu === "mobile" && (
        <nav
          className="mobile-menu"
          aria-label="Mobile navigation"
          onClick={() => setMenu("")}
        >
          {[
            ["Product", "/"],
            ["Lessons", "/lessons"],
            ["Pricing", "/pricing"],
            ["FAQs", "/faq"],
            ["Company", "/about"],
            ["Log in", "/login"],
          ].map(([label, path]) => (
            <Link key={label} to={path}>
              {label}
              <Icon name="arrow" />
            </Link>
          ))}
          <Link to="/get-started" className="button dark">
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        ["Log in", "/login"],
        ["Lessons", "/lessons"],
        ["Explore", "/explore"],
        ["Pricing", "/pricing"],
      ],
    },
    {
      title: "Resources",
      links: [
        ["How it works", "/docs"],
        ["FAQs", "/faq"],
      ],
    },
    { title: "Company", links: [["About", "/about"]] },
    {
      title: "Legal",
      links: [
        ["Privacy", "/privacy"],
        ["Terms", "/terms"],
      ],
    },
  ];
  return (
    <footer className="site-footer wrap">
      <div className="footer-links">
        {groups.map(({ title, links }) => (
          <div key={title}>
            <span>{title}</span>
            {links.map(([label, to]) => (
              <Link key={label} to={to}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Shams</span>
        <span>A little practice. A brighter world.</span>
        <span className="footer-status">
          <i /> Made for real conversations
        </span>
      </div>
      <div className="footer-wordmark" aria-label="Shams">
        shams
        <Logo />
      </div>
    </footer>
  );
}
function Hero() {
  return (
    <section className="hero">
      <div className="hero-art" />
      <div className="hero-content">
        <Link to="/about" className="announcement">
          <span>Meet Shams</span>A little closer, with every word
          <Icon name="right" size={14} />
        </Link>
        <h1>
          Meet Shams,
          <br className="desktop-break" /> your personal language tutor
        </h1>
        <p>A little practice, a real connection. Right in your texts.</p>
        <div className="hero-buttons">
          <Link to="/get-started" className="button dark">
            Get Started
          </Link>
          <Link to="/lessons" className="button light">
            Explore
          </Link>
        </div>
      </div>
      <div className="hero-phone">
        <Phone />
      </div>
      <Link to="/get-started" className="button dark mobile-hero-cta">
        Get Started
      </Link>
    </section>
  );
}
function FeatureArt({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="lesson-stack">
        {[
          "A little closer to home",
          "Ready for your next trip",
          "Everyday conversation",
        ].map((name, i) => (
          <div className="mini-lesson" key={name}>
            <div className={"lesson-symbol color-" + i}>
              <Icon name={["heart", "plane", "chat"][i]} size={30} />
            </div>
            <h4>{name}</h4>
            <p>A little practice, built around your life.</p>
            <span>
              <Logo /> Shams
            </span>
            <div className="mini-button">Let’s practice</div>
          </div>
        ))}
      </div>
    );
  if (index === 1)
    return (
      <div className="practice-art">
        <div className="note-date">TODAY, JUST FOR YOU</div>
        <div className="practice-message">
          <Logo boxed />
          <div>
            <b>Shams</b>
            <small>now</small>
            <p>Got five minutes? Let’s pick up where we left off ☀️</p>
          </div>
        </div>
        <div className="voice-note">
          <Icon name="play" />
          <div className="waveform">
            {Array.from({ length: 32 }, (_, i) => (
              <i key={i} style={{ height: 8 + ((i * 17) % 35) }} />
            ))}
          </div>
          <span>0:12</span>
        </div>
      </div>
    );
  if (index === 2)
    return (
      <div className="connection-art">
        <div className="orbit-circle" />
        <div className="language-orb orb-1">
          مرحبا<small>Arabic</small>
        </div>
        <div className="language-orb orb-2">
          hola<small>Spanish</small>
        </div>
        <div className="language-orb orb-3">
          bonjour<small>French</small>
        </div>
        <div className="language-orb orb-4">
          <Logo boxed />
          <small>Shams</small>
        </div>
      </div>
    );
  return (
    <div className="custom-lesson">
      <span>What would you like to practice?</span>
      <p>Ordering my first coffee in Damascus</p>
      <div>
        <span>
          <Icon name="chat" size={14} /> Conversation
        </span>
        <span className="mini-button">
          Let’s go <Icon name="arrow" size={14} />
        </span>
      </div>
    </div>
  );
}
function Features() {
  const features = [
    [
      "Adapts to your world with personal lessons",
      "Shams gets to know your goals, your interests, and your pace. Every conversation starts with you.",
    ],
    [
      "A little practice, on your schedule",
      "Make progress between the things you already do. Just send a text or a voice note whenever you have a moment.",
    ],
    [
      "Keeps the conversation going",
      "Build confidence with a tutor who remembers where you left off and helps you find the words.",
    ],
    [
      "Goes wherever your curiosity takes you",
      "Family conversations, a new city, or your favorite film. Turn the things you love into your next lesson.",
    ],
  ];
  return (
    <>
      <section className="life-section">
        <h2>
          Shams fits into your life<sup>(1)</sup>,<br />
          one conversation at a time
        </h2>
        <div className="language-ribbon" aria-hidden="true">
          {[
            "hola",
            "مرحبا",
            "bonjour",
            "ciao",
            "こんにちは",
            "hello",
            "안녕",
            "olá",
            "hallo",
            "你好",
            "hola",
            "مرحبا",
            "bonjour",
          ].map((word, i) => (
            <span key={i} className={"word-icon word-" + (i % 6)}>
              {word}
            </span>
          ))}
        </div>
        <div className="life-caption">
          <span>(1)</span>
          <p>
            Learn a language in a familiar place (iMessage), with a personal
            tutor who keeps things as real as a friend.
          </p>
        </div>
      </section>
      <section className="features wrap">
        {features.map(([title, description], i) => (
          <article className={"feature-row feature-" + i} key={title}>
            <div className="feature-art">
              <FeatureArt index={i} />
            </div>
            <div className="feature-copy">
              <span className="footnote">({i + 2})</span>
              <h2>{title}</h2>
              <p>{description}</p>
              {(i === 0 || i === 3) && (
                <Link to="/lessons" className="text-link">
                  Explore lessons <Icon name="arrow" size={14} />
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
export function Pricing({ standalone = false }: { standalone?: boolean }) {
  const [yearly, setYearly] = useState(false);
  return (
    <section
      className={"pricing wrap " + (standalone ? "pricing-standalone" : "")}
    >
      <div className="section-heading">
        <h2>Choose a plan to get started</h2>
        <p>
          Start with a conversation. Make Shams part of your day as your
          confidence grows.
        </p>
        <div className="billing-switch">
          <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button aria-pressed={yearly} onClick={() => setYearly(true)}>
            Yearly
          </button>
        </div>
      </div>
      <div className="price-grid">
        {[
          {
            name: "Free",
            description: "Get to know Shams and find your first words.",
            price: 0,
            features: [
              "No credit card required",
              "Everyday conversation practice",
              "A learning path that starts with you",
            ],
          },
          {
            name: "Plus",
            description: "Build a daily habit with a tutor who knows you.",
            price: yearly ? 15 : 19,
            features: [
              "Personalized daily lessons",
              "Voice notes and pronunciation practice",
              "Remember and revisit new words",
              "More room to practice",
            ],
          },
          {
            name: "Immersion",
            description:
              "Go a little further, with language in your everyday life.",
            price: yearly ? 39 : 49,
            features: [
              "Longer, deeper conversations",
              "Practice for real-life situations",
              "Your most personalized learning plan",
              "Priority support",
            ],
          },
        ].map((plan, i) => (
          <article className={"price-card price-" + i} key={plan.name}>
            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            <div className="price">
              <strong>${plan.price}</strong>
              <span>/ month</span>
            </div>
            <small>
              {i === 0
                ? "Free to explore"
                : yearly
                  ? `$${plan.price * 12} billed yearly`
                  : "Billed monthly"}
            </small>
            <p className="includes">
              {i === 0
                ? "Includes:"
                : `Everything in ${i === 1 ? "Free" : "Plus"}, plus:`}
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to={"/get-started?plan=" + plan.name.toLowerCase()}
              className={"button " + (i === 0 ? "light" : "dark")}
            >
              {i === 0 ? "Get Started" : "Try " + plan.name}
            </Link>
          </article>
        ))}
      </div>
      <p className="preview-note">
        Illustrative plans for the Shams preview. No payments are collected.
      </p>
      {standalone && (
        <div className="comparison">
          <h2>Find your rhythm</h2>
          <table>
            <thead>
              <tr>
                <th>Practice, your way</th>
                <th>Free</th>
                <th>Plus</th>
                <th>Immersion</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Personal learning path", "✓", "✓", "✓"],
                ["Text conversations", "✓", "✓", "✓"],
                ["Voice practice", "—", "✓", "✓"],
                ["Daily lessons", "—", "✓", "✓"],
                ["Deeper conversations", "—", "—", "✓"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={i}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
function Community() {
  return (
    <section className="community wrap">
      <h2>A conversation for every day</h2>
      <div className="story-grid">
        {[
          [
            "At your favorite café",
            "“One coffee, please.” A small sentence. A whole new kind of confidence.",
            "Coffee & conversation",
          ],
          [
            "Closer to your people",
            "Find the words for a longer call home, a family story, or a familiar joke.",
            "Family & connection",
          ],
          [
            "Somewhere new",
            "Ask for directions. Make a friend. Let a new place feel a little more like home.",
            "Travel & discovery",
          ],
        ].map(([name, body, tag]) => (
          <Link to="/lessons" className="story-card" key={name}>
            <Icon name="chat" size={18} />
            <b>{name}</b>
            <p>{body}</p>
            <small>
              {tag}
              <Icon name="arrow" size={13} />
            </small>
          </Link>
        ))}
      </div>
      <Link to="/explore" className="text-link">
        Find your next conversation <Icon name="arrow" size={14} />
      </Link>
    </section>
  );
}
function FinalCTA() {
  return (
    <section className="final-cta">
      <h2>
        A new language
        <br />
        starts with a text
      </h2>
      <div className="button-pair">
        <Link to="/get-started" className="button dark">
          Get Started
        </Link>
        <Link to="/lessons" className="button light">
          Explore
        </Link>
      </div>
    </section>
  );
}
function Lessons() {
  const [filter, setFilter] = useState("All"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<(typeof lessonCards)[number] | null>(
      null,
    );
  const dialog = useRef<HTMLDialogElement>(null);
  const collections = useRef<HTMLDivElement>(null);
  const [collectionEdges, setCollectionEdges] = useState({
    start: true,
    end: false,
  });
  const scrollCollections = (direction: number) => {
    const track = collections.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const distance =
      (card?.offsetWidth ?? 480) + parseFloat(getComputedStyle(track).gap);
    track.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  const cards = lessonCards.filter(
    (c) =>
      (filter === "All" || c.category === filter) &&
      (c.name + " " + c.description + " " + c.category)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <main className="lessons-page wrap">
      <section className="directory-hero">
        <div className="directory-intro">
          <p>Shams Lessons</p>
          <h1>Pick a conversation to make your world bigger</h1>
          <div className="button-pair">
            <Link to="/get-started" className="button dark">
              Get Started
            </Link>
            <Link to="/docs" className="button light">
              Make it yours
            </Link>
          </div>
        </div>
        <div className="directory-art" aria-hidden="true">
          <Logo boxed />
          {[
            "chat",
            "book",
            "plane",
            "heart",
            "voice",
            "sun",
            "calendar",
            "mail",
            "grid",
            "clock",
            "chat",
            "book",
          ].map((name, i) => (
            <span key={i} className={"floating-icon floating-" + i}>
              <Icon name={name} size={24} />
            </span>
          ))}
        </div>
      </section>
      <div className="directory-tabs" role="group" aria-label="Lesson types">
        {[
          ["All", "All"],
          ["Learn", "Vocabulary"],
          ["Practice", "Conversation"],
        ].map(([label, value]) => (
          <button
            key={label}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label === "Learn" && <Icon name="book" size={16} />}{" "}
            {label === "Practice" && <Icon name="chat" size={16} />} {label}
          </button>
        ))}
      </div>
      <section className="featured-collections">
        <h2>Featured</h2>
        <div
          className="collection-grid"
          ref={collections}
          onScroll={(event) => {
            const track = event.currentTarget;
            setCollectionEdges({
              start: track.scrollLeft < 2,
              end:
                track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
            });
          }}
        >
          {[
            [
              "Travel & Discovery",
              "Feel at home somewhere new",
              "Travel",
              ["ciao", "bonjour", "hola"],
            ],
            [
              "Family & Connection",
              "Find the words that bring you closer",
              "Conversation",
              ["مرحبا", "hello", "こんにちは"],
            ],
          ].map(([title, description, category, words]) => (
            <button
              className="collection-card"
              key={title as string}
              onClick={() => {
                setFilter(category as string);
                document.getElementById("lesson-catalog")?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
              }}
            >
              <div className="collection-art">
                {(words as string[]).map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="collection-view">
                View all <Icon name="arrow" size={14} />
              </span>
            </button>
          ))}
          <div className="collection-card collection-coming">
            <Logo boxed />
            <p>More conversations coming soon!</p>
          </div>
        </div>
        <div className="collection-arrows">
          <button
            aria-label="Previous collection"
            hidden={collectionEdges.start}
            onClick={() => scrollCollections(-1)}
          >
            <Icon name="back" size={16} />
          </button>
          <button
            aria-label="Next collection"
            hidden={collectionEdges.end}
            onClick={() => scrollCollections(1)}
          >
            <Icon name="right" size={16} />
          </button>
        </div>
      </section>
      <div className="catalog-controls" id="lesson-catalog">
        <div
          className="filter-tabs"
          role="group"
          aria-label="Lesson categories"
        >
          {[
            "All",
            "Conversation",
            "Travel",
            "Pronunciation",
            "Daily practice",
            "Vocabulary",
          ].map((x) => (
            <button
              key={x}
              aria-pressed={filter === x}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <label className="search">
          <Icon name="search" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons"
            aria-label="Search lessons"
          />
        </label>
      </div>
      <div className="lesson-grid">
        {cards.map((card, i) => (
          <button
            className="lesson-card"
            key={card.name}
            onClick={() => setSelected(card)}
          >
            <div className={"lesson-symbol color-" + (i % 3)}>
              <Icon name={card.icon} size={28} />
            </div>
            <h2>{card.name}</h2>
            <p>{card.description}</p>
            <span>
              <Logo /> Shams
              <Icon name="arrow" size={16} />
            </span>
          </button>
        ))}
      </div>
      {cards.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h2>No lessons found</h2>
          <p>Try another word or explore all lessons.</p>
          <button
            className="button light"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Show all lessons
          </button>
        </div>
      )}
      {selected && (
        <dialog
          ref={dialog}
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          aria-label={selected.name}
          className="lesson-modal"
        >
          <button
            autoFocus
            className="close-modal"
            onClick={() => dialog.current?.close()}
            aria-label="Close lesson"
          >
            <Icon name="close" />
          </button>
          <div className="lesson-symbol">
            <Icon name={selected.icon} size={32} />
          </div>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <div className="example-prompt">“{selected.example}”</div>
          <Link
            to={"/get-started?lesson=" + encodeURIComponent(selected.name)}
            className="button dark"
          >
            Try this with Shams
          </Link>
        </dialog>
      )}
    </main>
  );
}
const questions: [string, [string, string][]][] = [
  [
    "Getting started",
    [
      [
        "What is Shams?",
        "Shams is your personal language tutor, designed to help you learn through everyday conversations in iMessage. This website is a preview of the experience.",
      ],
      [
        "Do I need another app?",
        "The idea is simple: learn where you already text. The preview lets you explore the conversation and setup directly in your browser.",
      ],
      [
        "What can I practice?",
        "Everyday conversation, new vocabulary, pronunciation, travel, and staying connected with family. Choose what matters to you when you get started.",
      ],
    ],
  ],
  [
    "Your learning",
    [
      [
        "Can I start as a complete beginner?",
        "Absolutely. Choose “Just starting” during setup and Shams will meet you at the beginning.",
      ],
      [
        "Which language should I choose?",
        "Choose the language you want to bring into your life. The preview includes Arabic, French, Spanish, Italian, Japanese, and English.",
      ],
      [
        "Can I change my goals?",
        "Yes. Open your Shams dashboard and choose your learning settings to update your language, level, or daily practice.",
      ],
    ],
  ],
  [
    "Your account",
    [
      [
        "Is this connected to iMessage yet?",
        "The conversation shown here is a local preview. Live iMessage delivery will be available once the Shams messaging service is connected.",
      ],
      [
        "How much does Shams cost?",
        "You can explore this preview for free. The pricing page shows illustrative plans; there is no checkout and you will not be charged.",
      ],
      [
        "Where is my preview data stored?",
        "Your preferences and practice messages stay in this browser. You can clear them from your settings at any time.",
      ],
    ],
  ],
];
function FAQ() {
  return (
    <main className="faq-page">
      <h1>Shams FAQs</h1>
      {questions.map(([category, items]) => (
        <section key={category}>
          <h2>{category}</h2>
          {items.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Icon name="plus" size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      ))}
    </main>
  );
}
function Info({ page }: { page: string }) {
  const info: Record<string, [string, string, string[]]> = {
    about: [
      "A little closer, with every word.",
      "Meet Shams",
      [
        "Language is how we find our people, feel at home, and open ourselves to the world. Learning one should feel just as personal.",
        "Shams means “sun” in Arabic. A small, familiar presence in your day — helping you find your words, one conversation at a time.",
        "Your personal language tutor. Right in your texts.",
      ],
    ],
    docs: [
      "Just say hello.",
      "How Shams works",
      [
        "1. Make it yours. Tell Shams your name, the language you want to learn, and what brings you here.",
        "2. Find your rhythm. Choose your level and a little time to practice. Five minutes is a lovely place to start.",
        "3. Start a conversation. Try a phrase, ask a question, or practice a real-life situation. Keep coming back, one text at a time.",
      ],
    ],
    privacy: [
      "Your conversations are personal.",
      "Privacy",
      [
        "When you join the Shams waitlist, we store your email address in our Supabase database to send you early-access and launch updates about Shams. We do not sell your email address.",
        "Any learning preferences and sample conversations you enter in the interactive product preview are stored in this browser on this device.",
        "This preview does not send SMS messages, connect to iMessage, collect payments, or send your practice conversations to an AI service.",
        "To remove your local preview data, open Settings and select Clear preview data. Production privacy terms will be provided before the live service launches.",
      ],
    ],
    terms: [
      "A few things to know.",
      "Preview terms",
      [
        "This website is an interactive demonstration of Shams. Its learning conversations and plan options illustrate the intended experience.",
        "No paid service, account subscription, or live messaging connection is created by using this preview.",
        "Production service terms and final pricing will be available before launch.",
      ],
    ],
  };
  const [title, label, paras] = info[page] ?? info.about;
  return (
    <main className="info-page">
      <Logo boxed />
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
      {paras.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <Link to="/get-started" className="button dark">
        Meet Shams
      </Link>
    </main>
  );
}
export default function App() {
  const initialPath = window.location.pathname.replace(/\/$/, "") || "/";
  const [path, setPath] = useState(initialPath === "/get-started" ? "/" : initialPath);
  const [signupOpen, setSignupOpen] = useState(initialPath === "/get-started");
  useEffect(() => {
    const openSignup = () => setSignupOpen(true);
    const update = () => {
      const nextPath = window.location.pathname.replace(/\/$/, "") || "/";
      setPath(nextPath === "/get-started" ? "/" : nextPath);
      setSignupOpen(nextPath === "/get-started");
    };
    window.addEventListener("popstate", update);
    window.addEventListener(signupEvent, openSignup);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(signupEvent, openSignup);
    };
  }, []);
  useEffect(() => {
    document.title =
      path === "/"
        ? "Shams — Your personal language tutor"
        : path.includes("get-started")
          ? "Meet Shams"
          : path.slice(1).replace(/^./, (x) => x.toUpperCase()) + " — Shams";
  }, [path]);
  if (path === "/login")
    return <Onboarding login={path === "/login"} />;
  if (
    ["/home", "/settings", "/practice", "/progress", "/messages"].includes(path)
  )
    return <Dashboard key={path} page={path} />;
  if (path === "/preview/imessage")
    return (
      <div className="export-message">
        <MessageWindow />
      </div>
    );
  if (path === "/preview/phone")
    return (
      <div className="export-phone">
        <Phone />
      </div>
    );
  return (
    <div className={"marketing" + (path === "/" ? "" : " secondary-page")}>
      <Header />
      {path === "/" ? (
        <main>
          <Hero />
          <Features />
          <Pricing />
          <Community />
          <FinalCTA />
        </main>
      ) : path === "/pricing" ? (
        <main>
          <Pricing standalone />
        </main>
      ) : ["/lessons", "/recipes", "/explore"].includes(path) ? (
        <Lessons />
      ) : path === "/faq" ? (
        <FAQ />
      ) : (
        <Info page={path.slice(1)} />
      )}
      <Footer />
      {signupOpen && <WaitlistDialog onClose={() => {
        setSignupOpen(false);
        if (window.location.pathname.replace(/\/$/, "") === "/get-started") window.history.replaceState({}, "", "/");
      }} />}
    </div>
  );
}
