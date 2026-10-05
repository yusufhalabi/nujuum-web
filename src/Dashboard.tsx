import { useState } from "react";
import { go } from "./navigation";
import { Link } from "./Link";
import { lessonCards } from "./lessons";
import { Icon, Logo, MessageWindow } from "./components";
import { readProfile, saveProfile } from "./profile";
const greetings: Record<string, [string, string, string]> = {
  Arabic: ["صباح الخير", "sabah el-kheir", "Good morning"],
  French: ["Bonjour", "bon-zhoor", "Hello / Good morning"],
  Spanish: ["Buenos días", "bweh-nos dee-as", "Good morning"],
  Italian: ["Buongiorno", "bwon-jor-no", "Good morning"],
  Japanese: ["おはようございます", "ohayō gozaimasu", "Good morning"],
  English: ["Good morning", "good mor-ning", "A warm way to start the day"],
};
export function Dashboard({ page }: { page: string }) {
  const [profile, setProfile] = useState(readProfile),
    [saved, setSaved] = useState(false),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState(false),
    [completed, setCompleted] = useState(false);
  const greeting = greetings[profile.language] || greetings.Arabic;
  const hour = new Date().getHours(),
    period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const save = () => {
    saveProfile(profile);
    setSaved(true);
  };
  if (page === "/messages")
    return (
      <main className="message-page">
        <Link to="/home" className="message-back">
          <Icon name="back" size={16} /> Back to Shams
        </Link>
        <MessageWindow interactive />
      </main>
    );
  return (
    <main className="dashboard">
      <div
        className={
          "dashboard-panel " + (page === "/home" ? "" : "dashboard-inner")
        }
      >
        <header className="dashboard-header">
          <Link
            to={page === "/home" ? "/about" : "/home"}
            aria-label={page === "/home" ? "About Shams" : "Back to home"}
          >
            {page === "/home" ? <Logo /> : <Icon name="back" />}
          </Link>
          <span>
            {page === "/home"
              ? new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : page === "/settings"
                ? "Settings"
                : page === "/practice"
                  ? "Daily practice"
                  : "Your progress"}
          </span>
          <Link to="/settings" className="avatar" aria-label="Settings">
            {profile.name.charAt(0).toUpperCase() || "S"}
          </Link>
        </header>
        {page === "/home" ? (
          <>
            <div className="dashboard-beach" />
            <div className="dashboard-greeting">
              <h1>
                Good {period}, {profile.name || "friend"}
              </h1>
              <p>A little {profile.language}, a brighter day</p>
            </div>
            <nav className="dashboard-actions" aria-label="Your Shams">
              <Link to="/practice">
                <Icon name="calendar" />
                <span>Daily practice</span>
              </Link>
              <Link to="/get-started?step=language">
                <Icon name="book" />
                <span>Your language</span>
              </Link>
              <Link to="/lessons">
                <Icon name="grid" />
                <span>Lessons</span>
              </Link>
              <Link to="/progress">
                <Icon name="chart" />
                <span>Progress</span>
              </Link>
              <Link to="/messages">
                <Icon name="chat" />
                <span>Message</span>
              </Link>
            </nav>
          </>
        ) : page === "/settings" ? (
          <section className="settings-content">
            <h1>Make Shams yours</h1>
            <p>Your little corner of the world.</p>
            <label>
              Your name
              <input
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  setSaved(false);
                }}
                maxLength={40}
              />
            </label>
            <label>
              Your language
              <select
                value={profile.language}
                onChange={(e) => {
                  setProfile({ ...profile, language: e.target.value });
                  setSaved(false);
                }}
              >
                {Object.keys(greetings).map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Daily practice
              <select
                value={profile.minutes}
                onChange={(e) => {
                  setProfile({ ...profile, minutes: e.target.value });
                  setSaved(false);
                }}
              >
                {["5 minutes", "10 minutes", "15 minutes", "20 minutes"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <button className="button dark" onClick={save}>
              {saved ? "Saved" : "Save changes"}
            </button>
            <p role="status" className="save-status">
              {saved ? "Your preferences are saved on this device." : ""}
            </p>
            <Link to="/privacy" className="settings-link">
              Privacy
              <Icon name="right" size={16} />
            </Link>
            <Link to="/faq" className="settings-link">
              Help & FAQs
              <Icon name="right" size={16} />
            </Link>
            <button
              className="clear-data"
              onClick={() => {
                localStorage.removeItem("shams-profile");
                go("/");
              }}
            >
              Clear preview data
            </button>
            <small className="preview-disclosure">
              Local preview · No live messaging account is connected.
            </small>
          </section>
        ) : page === "/practice" ? (
          <section className="practice-content">
            <span className="eyebrow">A FIVE-MINUTE BEGINNING</span>
            <h1>
              A brighter way
              <br />
              to say hello
            </h1>
            <p>Let’s start with a warm {profile.language} greeting.</p>
            <div className="lesson-flashcard">
              <span
                className="native-phrase"
                dir={profile.language === "Arabic" ? "rtl" : "ltr"}
              >
                {greeting[0]}
              </span>
              <span>{greeting[1]}</span>
              <small>{greeting[2]}</small>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setChecked(true);
              }}
            >
              <label>
                Give it a try
                <input
                  placeholder="Type the greeting…"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setChecked(false);
                  }}
                />
              </label>
              <button
                className="button dark"
                disabled={!answer.trim() || completed}
              >
                {completed ? "Practice complete" : "Check my answer"}
              </button>
            </form>
            {checked && (
              <div className="practice-feedback" role="status">
                {answer.trim().toLocaleLowerCase() ===
                  greeting[0].toLocaleLowerCase() ||
                answer.trim().toLocaleLowerCase() ===
                  greeting[1].toLocaleLowerCase() ? (
                  <>
                    <b>That’s it. A lovely beginning ☀️</b>
                    <p>
                      {greeting[0]} — a little phrase to take into your day.
                    </p>
                    {!completed && (
                      <button
                        className="text-button"
                        onClick={() => {
                          const updated = {
                            ...profile,
                            lessons: profile.lessons + 1,
                          };
                          saveProfile(updated);
                          setProfile(updated);
                          setCompleted(true);
                        }}
                      >
                        Finish today’s practice <Icon name="arrow" size={16} />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <b>Almost. Take another look.</b>
                    <p>
                      Try “{greeting[0]}” or “{greeting[1]}”. You’ve got this.
                    </p>
                  </>
                )}
              </div>
            )}
            <small className="preview-disclosure">
              A guided sample lesson. Open-ended tutoring is not connected yet.
            </small>
          </section>
        ) : (
          <section className="progress-content">
            <Logo boxed />
            <h1>One word at a time</h1>
            <p>Your {profile.language} journey, at your pace.</p>
            <div className="progress-stat">
              <strong>{profile.lessons}</strong>
              <span>
                {profile.lessons === 1
                  ? "practice completed"
                  : "practices completed"}
              </span>
            </div>
            <div className="progress-detail">
              <span>Your language</span>
              <b>{profile.language}</b>
              <span>Your starting point</span>
              <b>{profile.level}</b>
              <span>Your daily rhythm</span>
              <b>{profile.minutes}</b>
            </div>
            <Link to="/practice" className="button dark">
              {profile.lessons
                ? "Keep the conversation going"
                : "Start your first practice"}
            </Link>
            <h2>A little inspiration</h2>
            {lessonCards.slice(0, 2).map((card) => (
              <Link className="suggested-lesson" to="/lessons" key={card.name}>
                <Icon name={card.icon} />
                <span>{card.name}</span>
                <Icon name="right" size={16} />
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
