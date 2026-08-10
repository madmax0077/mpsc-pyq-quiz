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

/** Paths where Auto Ads must stay off (policy / UX). */
export function isAdFreePath(pathname?: string): boolean {
  if (typeof window === "undefined" && !pathname) return false;
  const path = pathname || window.location.pathname || "";
  return (
    isAdminPath(path) ||
    path === "/donate" ||
    path.startsWith("/donate/") ||
    path === "/feedback" ||
    path.startsWith("/feedback/")
  );
}

/** True when GA should load for this page. */
export function allowPublicTracking(pathname?: string, hostname?: string): boolean {
  return isProductionHost(hostname) && !isAdminPath(pathname);
}

/** True when AdSense / Ezoic scripts should load. */
export function allowAdScripts(pathname?: string, hostname?: string): boolean {
  return isProductionHost(hostname) && !isAdFreePath(pathname);
}
