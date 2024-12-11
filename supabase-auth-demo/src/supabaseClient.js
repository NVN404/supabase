// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project details
const supabaseUrl = 'https://siaqvvbfumgngfctkdpi.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYXF2dmJmdW1nbmdmY3RrZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4ODYyMTYsImV4cCI6MjA0OTQ2MjIxNn0.M13z8b5vHeeXxHcjWhT02G7qGfLj-N-FEg386rBMvMc';  // Replace with your Supabase Anon Key
export const supabase = createClient(supabaseUrl, supabaseKey);
