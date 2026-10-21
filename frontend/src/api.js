// API helper. Calls go to the same address the page is served from, so there
// is no URL to type. In local dev, vite.config.js forwards them to AWS.
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const read = (k, d = "") => {
  try {
    return sessionStorage.getItem(k) ?? d;
  } catch {
    return d;
  }
};
const write = (k, v) => {
  try {
    if (v) sessionStorage.setItem(k, v);
    else sessionStorage.removeItem(k);
  } catch {
    /* storage unavailable */
  }
};

export const session = {
  get key() {
    return read("mak_key");
  },
  get tenant() {
    return read("mak_tenant", "mak");
  },
  set(tenant, key) {
    write("mak_tenant", tenant);
    write("mak_key", key);
  },
  clear() {
    write("mak_key", "");
  },
};

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": session.key,
        "X-Tenant": session.tenant,
        ...(options.headers || {}),
      },
    });
  } catch {
    const err = new Error("Can't reach the server. Check your connection and try again.");
    err.network = true;
    throw err;
  }
  if (res.status === 401) {
    window.dispatchEvent(new Event("mak-unauthorized"));
    const err = new Error("Wrong access key.");
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* response was not JSON */
    }
    const err = new Error(`Request failed (${res.status}): ${detail}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  health: () => request("/health"),
  listCustomers: () => request("/crm/customers"),
  addCustomer: (body) => request("/crm/customers", { method: "POST", body: JSON.stringify(body) }),
  financeSummary: () => request("/finance/summary"),
  addLedger: (body) => request("/finance/ledger", { method: "POST", body: JSON.stringify(body) }),
};

// The backend has no login endpoint yet, so signing in checks the key against
// a protected endpoint. Replace with a real login call when Cognito is added.
export async function login(tenant, key) {
  session.set(tenant, key);
  try {
    await api.financeSummary();
  } catch (err) {
    session.clear();
    throw err;
  }
}
