import { useEffect, useState } from "react";
import { session } from "./api.js";
import { MODULES } from "./modules.js";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Crm from "./Crm.jsx";
import Itsm from "./Itsm.jsx";
import Finance from "./Finance.jsx";

const PAGES = { home: Home, crm: Crm, itsm: Itsm, finance: Finance };

export default function App() {
  const [signedIn, setSignedIn] = useState(Boolean(session.key));
  const [page, setPage] = useState("home");

  useEffect(() => {
    const out = () => setSignedIn(false);
    window.addEventListener("mak-unauthorized", out);
    return () => window.removeEventListener("mak-unauthorized", out);
  }, []);

  const signOut = () => {
    session.clear();
    setSignedIn(false);
    setPage("home");
  };

  if (!signedIn) {
    return (
      <Login
        onSuccess={() => {
          setPage("home");
          setSignedIn(true);
        }}
      />
    );
  }

  const Page = PAGES[page] || Home;
  const nav = [{ id: "home", name: "Home" }, ...MODULES];

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Main">
        <p className="brand-mark">mak-system</p>
        <ul>
          {nav.map((n) => (
            <li key={n.id}>
              <button
                className={`nav-item ${page === n.id ? "active" : ""}`}
                aria-current={page === n.id ? "page" : undefined}
                onClick={() => setPage(n.id)}
              >
                {n.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-foot">
          <span>Tenant: {session.tenant}</span>
          <button className="link" onClick={signOut}>
            Sign out
          </button>
        </div>
      </nav>
      <main className="content">
        <Page open={setPage} />
      </main>
    </div>
  );
}
