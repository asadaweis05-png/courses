// Admin configuration — single source of truth for admin access
export const ADMIN_EMAIL = "asadaweids05@gmail.com";

export function isAdmin(email: string | undefined | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
