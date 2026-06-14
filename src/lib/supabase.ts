import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqgrtarvvzkiqmnbqppg.supabase.co';
const supabaseKey = 'sb_publishable_s-cbJAj914TwVRb_AcPT7Q_oUmICLfs';

export const supabase = createClient(supabaseUrl, supabaseKey);
