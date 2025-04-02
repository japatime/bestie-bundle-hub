
import { createClient } from "@supabase/supabase-js";

// Default to empty strings to prevent runtime errors, but log warnings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Provide clear error messages if credentials are missing
if (!supabaseUrl) {
  console.error("Missing Supabase URL. Please set VITE_SUPABASE_URL in your environment variables.");
}

if (!supabaseKey) {
  console.error("Missing Supabase Anon Key. Please set VITE_SUPABASE_ANON_KEY in your environment variables.");
}

// Create client with fallbacks to prevent runtime crashes
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

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
