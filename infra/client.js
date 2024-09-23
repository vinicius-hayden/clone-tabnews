import { createClient } from '@supabase/supabase-js'

async function supabaseQuery(queryObject) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { data, error } = await supabase
     .from(queryObject.table)
     .select(queryObject.select);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("ERROR: Executing Supabase Query on client.js", error);
  }
}

export default {
  query: supabaseQuery
}