// Minimal Supabase client and sync helpers
// Tables expected: kv_store (key text primary key, value jsonb), users (id text pk, name text, email text unique, password text, role text),
// products, orders, delivery_agents, agent_locations, notifications, search_logs, homepage_cards

// Initialize client
window.supabaseClient = (function(){
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return null;
  try { return supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY); } catch(_){ return null; }
})();

async function sbUpsert(table, rows){
  if (!window.supabaseClient) return;
  try { await window.supabaseClient.from(table).upsert(rows, { onConflict: 'id' }); } catch(e){ console.warn('supabase upsert error', table, e); }
}

async function sbGetAll(table){
  if (!window.supabaseClient) return [];
  try { const { data, error } = await window.supabaseClient.from(table).select('*'); if (error) throw error; return data||[]; } catch(e){ console.warn('supabase select error', table, e); return []; }
}

// KV fallback for quick sync of arrays (disabled)
async function sbPutKV(key, value){ /* no-op to avoid 406 */ }
async function sbGetKV(key){ return null; }

// Normalized-table mirror helpers
async function sbUpsertMany(table, rows, conflict){ 
  if (!rows || !rows.length || !window.supabaseClient) return; 
  try{ 
    await window.supabaseClient.from(table).upsert(rows, { 
      onConflict: conflict || 'id',
      ignoreDuplicates: false 
    }); 
  } catch(e){ 
    console.warn('sbUpsertMany', table, e);
    // If upsert fails, try individual inserts/updates
    for (const row of rows) {
      try {
        await window.supabaseClient.from(table).upsert([row], { 
          onConflict: conflict || 'id',
          ignoreDuplicates: false 
        });
      } catch (individualError) {
        console.warn(`Failed to upsert individual row in ${table}:`, individualError);
      }
    }
  }
}
async function sbInsertMany(table, rows){ 
  if (!rows || !rows.length || !window.supabaseClient) return; 
  try{ 
    await window.supabaseClient.from(table).insert(rows); 
  } catch(e){ 
    console.warn('sbInsertMany', table, e);
    // If bulk insert fails, try individual inserts
    for (const row of rows) {
      try {
        await window.supabaseClient.from(table).insert([row]);
      } catch (individualError) {
        console.warn(`Failed to insert individual row in ${table}:`, individualError);
        // Try upsert as fallback
        try {
          await window.supabaseClient.from(table).upsert([row], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        } catch (upsertError) {
          console.warn(`Failed to upsert individual row in ${table}:`, upsertError);
        }
      }
    }
  }
}
async function sbDeleteWhere(table, match){ if (!window.supabaseClient) return; try{ await window.supabaseClient.from(table).delete().match(match); }catch(e){ console.warn('sbDeleteWhere', table, e);} }

window.__sb = { sbUpsert, sbGetAll, sbPutKV, sbGetKV, sbUpsertMany, sbInsertMany, sbDeleteWhere };


