
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define role types
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Helper to check user role
export const getUserRole = async (userId: string): Promise<UserRole> => {
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
};
