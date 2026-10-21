// Tiny API helper. Base URL comes from .env (VITE_API_URL) but can be
// overridden in the UI; the API key is entered in the UI and kept only for
// this browser tab (sessionStorage) so it is never baked into the build.

const store = {
  get: (k, d = "") => {
    try {
      return sessionStorage.getItem(k) ?? d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
};

export const settings = {
  get baseUrl() {
    return (store.get("mak_url", import.meta.env.VITE_API_URL || "") || "").replace(/\/+$/, "");
  },
  set baseUrl(v) {
    store.set("mak_url", v);
  },
  get apiKey() {
    return store.get("mak_key");
  },
  set apiKey(v) {
    store.set("mak_key", v);
  },
  get tenant() {
    return store.get("mak_tenant", "mak");
  },
  set tenant(v) {
    store.set("mak_tenant", v);
  },
};

async function request(path, options = {}) {
  const res = await fetch(`${settings.baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": settings.apiKey,
      "X-Tenant": settings.tenant,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* not JSON */
    }
    throw new Error(`${res.status}: ${detail}`);
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
