/**
 * Shared guards for ads / analytics — keep junk hosts and private routes
 * from loading third-party tags.
 */

const PROD_HOSTS = new Set(["www.mpscs.in", "mpscs.in"]);

export function isProductionHost(hostname?: string): boolean {
  if (typeof window === "undefined" && !hostname) return false;
  const host = (hostname || window.location.hostname || "").toLowerCase();
  return PROD_HOSTS.has(host);
}

export function isAdminPath(pathname?: string): boolean {
  if (typeof window === "undefined" && !pathname) return false;
  const path = pathname || window.location.pathname || "";
  return path === "/admin" || path.startsWith("/admin/");
}

/** True when ads + GA should load for this page. */
export function allowPublicTracking(pathname?: string, hostname?: string): boolean {
  return isProductionHost(hostname) && !isAdminPath(pathname);
}
