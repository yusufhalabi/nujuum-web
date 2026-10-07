import { useEffect, useRef, useState } from "react";
import { Dashboard } from "./Dashboard";
import { Logo, Icon, Phone, MessageWindow } from "./components";
import { Link } from "./Link";
import { lessonCards } from "./lessons";

function TextShams({ className = "" }: { className?: string }) {
  return (
    <a href="sms:+14156576917" className={"button text-shams " + className}>
      <span className="messages-icon" aria-hidden="true"><Icon name="chat" size={20} /></span>
      Text Shams
    </a>
  );
}

function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        ["Lessons", "/lessons"],
        ["Explore", "/explore"],
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
      <div className="footer-cta"><TextShams /></div>
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
          <span>Meet Shams</span>Closer, with every word
          <Icon name="right" size={14} />
        </Link>
        <h1>
          Your Arabic Tutor,
          <br /> in iMessage
        </h1>
        <div className="hero-buttons">
          <TextShams />
        </div>
      </div>
      <div className="hero-phone">
        <Phone />
      </div>
      <TextShams className="mobile-hero-cta" />
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
    "Lessons built around you",
    "Practice by text or voice",
    "Pick up where you left off",
    "Turn your interests into lessons",
  ];
  return (
    <>
      <section className="life-section">
        <h2>
          A little Arabic,
          <br />
          every day
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
        <TextShams />
      </section>
      <section className="features wrap">
        {features.map((title, i) => (
          <article className={"feature-row feature-" + i} key={title}>
            <div className="feature-copy">
              <h2>{title}</h2>
              <TextShams />
              {(i === 0 || i === 3) && (
                <Link to="/lessons" className="text-link">
                  Explore lessons <Icon name="arrow" size={14} />
                </Link>
              )}
            </div>
            <div className="feature-art">
              <FeatureArt index={i} />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
function Community() {
  return (
    <section className="community wrap">
      <h2>A conversation for every day</h2>
      <div className="story-grid">
        {[
          "At your favorite café",
          "Closer to your people",
          "Somewhere new",
        ].map((name) => (
          <Link to="/lessons" className="story-card" key={name}>
            <Icon name="chat" size={18} />
            <b>{name}</b>
            <small>
              Explore lessons
              <Icon name="arrow" size={13} />
            </small>
          </Link>
        ))}
      </div>
      <Link to="/explore" className="text-link">
        Find your next conversation <Icon name="arrow" size={14} />
      </Link>
      <TextShams />
    </section>
  );
}
function FinalCTA() {
  return (
    <section className="final-cta">
      <h2>
        Your Arabic journey
        <br />
        starts with a text
      </h2>
      <div className="button-pair">
        <TextShams />
      </div>
    </section>
  );
}

function Landing() {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = main.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const elements = root.querySelectorAll<HTMLElement>(
      ".life-section h2, .feature-row, " +
      ".community h2, .story-card, .final-cta > *",
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0 });

    for (const element of elements) {
      // Never hide content already in view, including a restored scroll position.
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) continue;
      element.classList.add("scroll-reveal");
      observer.observe(element);
    }

    const revealFocused = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        event.target.closest(".scroll-reveal")?.classList.add("is-visible");
      }
    };
    const disableMotion = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        elements.forEach((element) => element.classList.add("is-visible"));
      }
    };
    root.addEventListener("focusin", revealFocused);
    reducedMotion.addEventListener("change", disableMotion);
    return () => {
      observer.disconnect();
      root.removeEventListener("focusin", revealFocused);
      reducedMotion.removeEventListener("change", disableMotion);
      elements.forEach((element) => element.classList.remove("scroll-reveal", "is-visible"));
    };
  }, []);

  return (
    <main ref={main}>
      <Hero />
      <Features />
      <Community />
      <FinalCTA />
    </main>
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
            <TextShams />
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
              "Travel",
              ["ciao", "bonjour", "hola"],
            ],
            [
              "Family & Connection",
              "Conversation",
              ["مرحبا", "hello", "こんにちは"],
            ],
          ].map(([title, category, words]) => (
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
          <div className="example-prompt">“{selected.example}”</div>
          <TextShams />
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
        "Shams is your personal Arabic tutor, designed to help you learn through everyday conversations in iMessage. The conversations shown on this website are illustrative previews.",
      ],
      [
        "Do I need another app?",
        "Use the messaging app you already have. Text Shams opens a conversation in your messaging app; you choose when to send your first message.",
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
        "Absolutely. Tell Shams you’re just starting, and practice at your own pace.",
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
        "Does Text Shams send a message automatically?",
        "No. It opens your messaging app with Shams as the recipient. You write and send the message yourself. The conversation previews on this website stay in your browser.",
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
        "Shams means “sun” in Arabic. A small, familiar presence in your day, helping you find your words, one conversation at a time.",
        "Your personal language tutor. Right in your texts.",
      ],
    ],
    docs: [
      "Just say hello.",
      "How Shams works",
      [
        "1. Text Shams. Open your messaging app and say hello. Tell Shams what brings you to Arabic.",
        "2. Find your rhythm. Choose your level and a little time to practice. Five minutes is a lovely place to start.",
        "3. Start a conversation. Try a phrase, ask a question, or practice a real-life situation. Keep coming back, one text at a time.",
      ],
    ],
    privacy: [
      "Your conversations are personal.",
      "Privacy",
      [
        "This website no longer collects email signups. Previously submitted early-access email addresses remain in our Supabase database. We do not sell your email address.",
        "Any learning preferences and sample conversations you enter in the interactive product preview are stored in this browser on this device.",
        "The Text Shams links open your messaging app. The website itself does not send messages, collect payments, or send your preview conversations to an AI service.",
        "To remove your local preview data, open Settings and select Clear preview data. Production privacy terms will be provided before the live service launches.",
      ],
    ],
    terms: [
      "A few things to know.",
      "Preview terms",
      [
        "The learning conversations on this website are interactive demonstrations of the intended Shams experience.",
        "No paid service, account subscription, or live messaging connection is created by using this preview.",
        "Production service terms will be available before launch.",
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
      <TextShams />
    </main>
  );
}
export default function App() {
  const initialPath = window.location.pathname.replace(/\/$/, "") || "/";
  const [path, setPath] = useState(initialPath);
  useEffect(() => {
    const update = () => {
      const nextPath = window.location.pathname.replace(/\/$/, "") || "/";
      setPath(nextPath);
    };
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("popstate", update);
    };
  }, []);
  const landing = ["/", "/get-started", "/login", "/pricing"].includes(path);
  useEffect(() => {
    document.title =
      landing
        ? "Shams | Your Arabic Tutor, in iMessage"
        : path.slice(1).replace(/^./, (x) => x.toUpperCase()) + " | Shams";
  }, [path, landing]);
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
    <div className={"marketing" + (landing ? " landing-page" : " secondary-page")}>
      {landing ? (
        <Landing />
      ) : ["/lessons", "/recipes", "/explore"].includes(path) ? (
        <Lessons />
      ) : path === "/faq" ? (
        <FAQ />
      ) : (
        <Info page={path.slice(1)} />
      )}
      <Footer />
    </div>
  );
}
