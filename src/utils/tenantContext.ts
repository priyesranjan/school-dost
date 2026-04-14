/**
 * Resolves the current tenant slug from the execution context.
 *
 * Priority:
 *  1. Subdomain (production)       — dps.yourerp.com → "dps"
 *  2. VITE_TENANT_SLUG env var     — set in .env.local for local dev
 *  3. localStorage dev_tenant_slug — set at runtime via DevTools / dev panel
 *  4. Empty string                 — superadmin / unauthenticated context
 */
export function getCurrentTenantSlug(): string {
  const parts = window.location.hostname.split('.')
  // If hostname has at least 3 segments (sub.domain.tld), use first as slug
  if (parts.length >= 3 && parts[0] !== 'www') return parts[0]
  return (import.meta.env.VITE_TENANT_SLUG as string | undefined) || localStorage.getItem('dev_tenant_slug') || ''
}

/**
 * Convenience for dev: set the tenant slug without reloading.
 * Usage in browser console: setDevTenantSlug('dps-delhi')
 */
export function setDevTenantSlug(slug: string): void {
  localStorage.setItem('dev_tenant_slug', slug)
  console.log(`[tenant] dev slug set to "${slug}" — refresh the page`)
}
