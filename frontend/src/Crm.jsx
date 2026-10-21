import { useEffect, useState } from "react";
import { api } from "./api.js";

export default function Crm() {
  const [rows, setRows] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setRows(await api.listCustomers());
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
      await api.addCustomer({ name, phone });
      setName("");
      setPhone("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1>CRM</h1>
      <p className="muted">Customers and their contact details.</p>

      <form onSubmit={add} className="inline-form">
        <label>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </label>
        <button type="submit">Add customer</button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {rows === null && !error && <p className="muted">Loading customers…</p>}
      {rows && rows.length === 0 && <p className="empty">No customers yet. Add the first one above.</p>}
      {rows && rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
