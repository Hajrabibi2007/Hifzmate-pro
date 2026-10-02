import { createClient } from '@supabase/supabase-js';

// Apne Supabase project credentials yahan replace karein
const supabaseUrl = 'https://rcvayltbfnueylmxrvkd.supabase.co';
const supabaseAnonKey = 'sb_publishable_mAeAawNIxiTFuMN7YhIOew_pmGjrnxU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);