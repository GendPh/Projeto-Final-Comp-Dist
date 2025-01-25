// Import the Supabase client
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../Js/envConfig.js';

// Create a Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.apiKey);

// Export the Supabase client
export { supabase };