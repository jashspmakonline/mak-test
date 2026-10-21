import { useEffect, useState } from "react";
import { api } from "./api.js";

const money = (n) => Number(n).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Finance() {
  const [summary, setSummary] = useState(null);
  const [orderRef, setOrderRef] = useState("");
  const [kind, setKind] = useState("sale");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setSummary(await api.financeSummary());
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.addLedger({ order_ref: orderRef, kind, amount: Number(amount) });
      setOrderRef("");
      setAmount("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const totals = summary ? Object.entries(summary.totals) : [];

  return (
    <section>
      <h1>Finance</h1>
      <p className="muted">Sales, refunds and net totals.</p>

      <form onSubmit={add} className="inline-form">
        <label>
          Order reference
          <input value={orderRef} onChange={(e) => setOrderRef(e.target.value)} />
        </label>
        <label>
          Type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="sale">Sale</option>
            <option value="refund">Refund</option>
          </select>
        </label>
        <label>
          Amount
          <input required type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button type="submit">Add entry</button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {summary === null && !error && <p className="muted">Loading totals…</p>}
      {summary && totals.length === 0 && <p className="empty">No entries yet. Add a sale or refund above.</p>}
      {summary && totals.length > 0 && (
        <dl className="figures">
          {totals.map(([k, v]) => (
            <div key={k}>
              <dt>Total {k}s</dt>
              <dd>{money(v)}</dd>
            </div>
          ))}
          <div className="net">
            <dt>Net sales</dt>
            <dd>{money(summary.net_sales)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
