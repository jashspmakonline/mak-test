import { useState } from "react";
import { login } from "./api.js";
import { ACCOUNT_NOTE, MODULES } from "./modules.js";

export default function Login({ onSuccess }) {
  const [tenant, setTenant] = useState("mak");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(tenant.trim() || "mak", key);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <aside className="login-brand">
        <p className="brand-mark">mak-system</p>
        <h1>Admin portal</h1>
        <p className="brand-lead">One place to run the lunch delivery business.</p>
        <ul className="brand-modules">
          {MODULES.map((m) => (
            <li key={m.id}>
              <strong>{m.name}</strong>
              <span>{m.blurb}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <h2>Sign in</h2>
          <label>
            Tenant
            <input value={tenant} onChange={(e) => setTenant(e.target.value)} autoComplete="organization" />
          </label>
          <label>
            Access key
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="current-password"
              autoFocus
              required
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="fine-print">{ACCOUNT_NOTE}</p>
        </form>
      </main>
    </div>
  );
}
