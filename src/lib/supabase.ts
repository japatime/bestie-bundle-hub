
import { createClient } from "@supabase/supabase-js";

// Get environment variables with clear error messages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide clear error messages if credentials are missing
if (!supabaseUrl) {
  console.error("Missing Supabase URL. Please set VITE_SUPABASE_URL in your environment variables.");
}

if (!supabaseKey) {
  console.error("Missing Supabase Anon Key. Please set VITE_SUPABASE_ANON_KEY in your environment variables.");
}

// Create a dummy client when credentials are missing (for development only)
// This prevents runtime crashes while providing a clear indication something is wrong
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Creating mock Supabase client due to missing credentials");
    
    // Return a mock client that logs operations instead of failing
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") })
          })
        })
      })
    };
  }
  
  // Create the real client when credentials are available
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
};

export const supabase = createSupabaseClient();

// Define role types
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Helper to check user role
export const getUserRole = async (userId: string): Promise<UserRole> => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing, defaulting to USER role");
    return UserRole.USER;
  }
  
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user role:", error);
      return UserRole.USER; // Default to basic user role
    }
    
    return data.role as UserRole;
  } catch (e) {
    console.error("Exception when fetching user role:", e);
    return UserRole.USER;
  }
};
