import { useEffect, useState } from "react";
import { api } from "./api.js";
import { ACCOUNT_NOTE, MODULES } from "./modules.js";

const STATUS_LABEL = { live: "Connected", pending: "Not connected yet" };

export default function Home({ open }) {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    api
      .health()
      .then((r) => setOnline(Boolean(r.ok)))
      .catch(() => setOnline(false));
  }, []);

  const where = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "Local session, backend on AWS"
    : "Running on AWS";

  return (
    <section>
      <h1>mak-system admin portal</h1>
      <p className="status-line">
        <span className={`dot ${online === null ? "wait" : online ? "ok" : "bad"}`} aria-hidden="true" />
        {online === null ? "Checking the backend…" : online ? "Backend online" : "Backend unreachable"}
        <span className="status-where">{where}</span>
      </p>

      <h2 className="section-title">Modules</h2>
      <ul className="module-list">
        {MODULES.map((m) => (
          <li key={m.id}>
            <div className="module-main">
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
            </div>
            <span className={`badge ${m.status}`}>{STATUS_LABEL[m.status]}</span>
            <button className="ghost" onClick={() => open(m.id)}>
              Open {m.name}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Accounts</h2>
      <p className="muted">{ACCOUNT_NOTE}</p>
    </section>
  );
}
