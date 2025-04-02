
import { supabase } from "@/lib/supabase";

export type TransactionType = "airtime_purchase" | "data_purchase" | "wallet_funding";

export interface Transaction {
  id: string; // Changed from optional to required to match expected type in components
  type: TransactionType;
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  user_id?: string;
  created_at?: string;
}
