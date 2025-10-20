// Minimal Supabase client and sync helpers
// Tables expected: kv_store (key text primary key, value jsonb), users (id text pk, name text, email text unique, password text, role text),
// products, orders, delivery_agents, agent_locations, notifications, search_logs, homepage_cards

// Initialize client
window.supabaseClient = (function(){
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not found');
    return null;
  }
  try { 
    const client = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully');
    return client;
  } catch(e){ 
    console.error('Failed to initialize Supabase client:', e);
    return null; 
  }
})();

async function sbUpsert(table, rows){
  if (!window.supabaseClient) {
    console.error('Supabase client not available for upsert');
    return;
  }
  try { 
    console.log(`Upserting to ${table}:`, rows);
    const { data, error } = await window.supabaseClient.from(table).upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    console.log(`Successfully upserted to ${table}`);
  } catch(e){ 
    console.error(`Supabase upsert error for ${table}:`, e); 
  }
}

async function sbGetAll(table){
  if (!window.supabaseClient) {
    console.error('Supabase client not available for select');
    return [];
  }
  try { 
    const { data, error } = await window.supabaseClient.from(table).select('*'); 
    if (error) throw error; 
    return data||[]; 
  } catch(e){ 
    console.error(`Supabase select error for ${table}:`, e); 
    return []; 
  }
}

// KV fallback for quick sync of arrays (disabled)
async function sbPutKV(key, value){ /* no-op to avoid 406 */ }
async function sbGetKV(key){ return null; }

// Normalized-table mirror helpers
async function sbUpsertMany(table, rows, conflict){ 
  if (!rows || !rows.length) {
    console.log(`No rows to upsert for ${table}`);
    return;
  }
  if (!window.supabaseClient) {
    console.error('Supabase client not available for sbUpsertMany');
    return;
  }
  try{ 
    console.log(`Upserting ${rows.length} rows to ${table}:`, rows);
    const { data, error } = await window.supabaseClient.from(table).upsert(rows, { onConflict: conflict||'id' });
    if (error) {
      console.error(`Supabase error details for ${table}:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Full error object:', error);
      throw error;
    }
    console.log(`Successfully upserted ${rows.length} rows to ${table}`);
  }catch(e){ 
    console.error(`sbUpsertMany error for ${table}:`, e);
    // Try individual inserts as fallback
    if (table === 'orders' && rows.length > 1) {
      console.log('Trying individual order inserts as fallback...');
      for (const row of rows) {
        try {
          const { data, error } = await window.supabaseClient.from(table).upsert([row], { onConflict: conflict||'id' });
          if (error) {
            console.error(`Individual upsert failed for order ${row.id}:`, error);
          } else {
            console.log(`Individual upsert successful for order ${row.id}`);
          }
        } catch (individualError) {
          console.error(`Individual upsert error for order ${row.id}:`, individualError);
        }
      }
    }
  } 
}

async function sbInsertMany(table, rows){ 
  if (!rows || !rows.length) {
    console.log(`No rows to insert for ${table}`);
    return;
  }
  if (!window.supabaseClient) {
    console.error('Supabase client not available for sbInsertMany');
    return;
  }
  try{ 
    console.log(`Inserting ${rows.length} rows to ${table}:`, rows);
    const { data, error } = await window.supabaseClient.from(table).insert(rows);
    if (error) throw error;
    console.log(`Successfully inserted ${rows.length} rows to ${table}`);
  }catch(e){ 
    console.error(`sbInsertMany error for ${table}:`, e);
  } 
}

async function sbDeleteWhere(table, match){ 
  if (!window.supabaseClient) {
    console.error('Supabase client not available for sbDeleteWhere');
    return;
  }
  try{ 
    console.log(`Deleting from ${table} where:`, match);
    const { data, error } = await window.supabaseClient.from(table).delete().match(match);
    if (error) throw error;
    console.log(`Successfully deleted from ${table}`);
  }catch(e){ 
    console.error(`sbDeleteWhere error for ${table}:`, e);
  } 
}

window.__sb = { sbUpsert, sbGetAll, sbPutKV, sbGetKV, sbUpsertMany, sbInsertMany, sbDeleteWhere };


