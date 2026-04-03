import { createClient } from "@supabase/supabase-js";


 const VITE_SUPABASE_URL="https://bloaojlzuelkxcufixlq.supabase.co"
const VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_VKhQ6dnYyRMoOt5QbZmMaQ_gSakmf8g"
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ezqcipkszcsccmjbnhdw.supabase.co";
//const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "sb_publishable_Ia7uLWZTpaVWtYLLN4oW8A_c5rQtrUk";

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

