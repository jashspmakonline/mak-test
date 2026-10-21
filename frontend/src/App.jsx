import { useState } from "react";
import { api, settings } from "./api.js";

function Settings({ onChange }) {
  const [url, setUrl] = useState(settings.baseUrl);
  const [key, setKey] = useState(settings.apiKey);
  const [tenant, setTenant] = useState(settings.tenant);
  const [status, setStatus] = useState("");

  const save = async () => {
    settings.baseUrl = url;
    settings.apiKey = key;
    settings.tenant = tenant;
    onChange();
    try {
      const r = await api.health();
      setStatus(r.ok ? "Connected ✔" : "Unexpected response");
    } catch (e) {
      setStatus(`Cannot reach API: ${e.message}`);
    }
  };

  return (
    <section className="card">
      <h2>Connection</h2>
      <label>
        API URL
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="http://your-ecs-url" />
      </label>
      <label>
        API key
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} />
      </label>
      <label>
        Tenant
        <input value={tenant} onChange={(e) => setTenant(e.target.value)} />
      </label>
      <button onClick={save}>Save &amp; test</button>
      {status && <p className="note">{status}</p>}
    </section>
  );
}

function Customers() {
  const [rows, setRows] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setRows(await api.listCustomers());
    } catch (e) {
      setError(e.message);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.addCustomer({ name, phone });
      setName("");
      setPhone("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="card">
      <h2>Customers</h2>
      <form onSubmit={add} className="row">
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <button className="secondary" onClick={load}>
        Load customers
      </button>
      {error && <p className="error">{error}</p>}
      {rows && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="3">No customers yet</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function Finance() {
  const [summary, setSummary] = useState(null);
  const [orderRef, setOrderRef] = useState("");
  const [kind, setKind] = useState("sale");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setSummary(await api.financeSummary());
    } catch (e) {
      setError(e.message);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.addLedger({ order_ref: orderRef, kind, amount: Number(amount) });
      setOrderRef("");
      setAmount("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="card">
      <h2>Finance</h2>
      <form onSubmit={add} className="row">
        <input placeholder="Order ref" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} />
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="sale">sale</option>
          <option value="refund">refund</option>
        </select>
        <input
          required
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add entry</button>
      </form>
      <button className="secondary" onClick={load}>
        Load summary
      </button>
      {error && <p className="error">{error}</p>}
      {summary && (
        <div className="summary">
          {Object.entries(summary.totals).map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <strong>{v.toFixed(2)}</strong>
            </div>
          ))}
          <div>
            <span>net sales</span>
            <strong>{Number(summary.net_sales).toFixed(2)}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [, force] = useState(0);
  return (
    <main>
      <h1>mak-admin</h1>
      <Settings onChange={() => force((n) => n + 1)} />
      <Customers />
      <Finance />
    </main>
  );
}
