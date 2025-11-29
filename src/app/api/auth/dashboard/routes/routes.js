// Centralized route map for dashboard/auth APIs.
// If you intended a Next.js API handler, use `src/app/api/auth/dashboard/route.js` instead.

/**
 * Canonical routes used by dashboard auth flows.
 * Keep paths relative to `/api` for server calls,
 * and absolute for client navigation when needed.
 */
export const routes = {
  api: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    dashboard: '/api/auth/dashboard',
  },
  pages: {
    dashboard: '/dashboard',
    login: '/login',
  },
};

/**
 * Helper to build query strings safely.
 * @param {string} base - Base path or URL.
 * @param {Record<string, string | number | boolean | undefined | null>} [query]
 * @returns {string}
 */
export function withQuery(base, query) {
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Example: get dashboard API with filters.
 * @param {object} [opts]
 */
export function dashboardApi(opts) {
  return withQuery(routes.api.dashboard, opts);
}

export default routes;
