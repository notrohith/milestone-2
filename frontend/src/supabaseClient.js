
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sxdkedopdneocnbomjbi.supabase.co";
const supabaseAnonKey = "sb_publishable_qMxp5XrC-62ivklh41OQ8Q_JuJ1ryuN";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
