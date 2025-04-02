// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables."
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          }),
        }),
        insert: () => ({
          select: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
      }),
    };

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export const getUserRole = async (userId: string): Promise<UserRole> => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing, defaulting to USER role");
    return UserRole.USER;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return (data?.role as UserRole) || UserRole.USER;
};
