import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubfpqhutoqyjudvssslj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZnBxaHV0b3F5anVkdnNzc2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODg3NjIsImV4cCI6MjA5Njk2NDc2Mn0.6xUbSJZGa9ii5jbMkPj2AucC7NquMOe4oWHMCvX9Zpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('matches')
    .select('*, stadiums(name)')
    .limit(1);
    
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
