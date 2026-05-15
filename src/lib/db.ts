// Since we are mocking DB, let's just make a simple in-memory store for now to pass data between page routes.
// In production, this should be Redis, Postgres, or Supabase.
// Note: Next.js API routes may be stateless across rebuilds, so this is purely for the current iteration/demo.
export const mockDb = new Map<string, any>();
