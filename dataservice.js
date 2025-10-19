function getProducts(){return getLS('products')||[]}function saveProducts(v){setLS('products',v); try{ __sb && __sb.sbUpsertMany('products', v.map(p=>({ id:p.id, name:p.name, description:p.description, price:p.price, original_price:p.originalPrice||null, stock:p.stock, stock_status:p.stockStatus, category:p.category, image:p.image, homepage_card_id:p.homepageCardId })) ); }catch(_){}}
function getOrders(){return getLS('orders')||[]}function saveOrders(v){
  // Deduplicate by id (keep latest version of each order)
  const orderMap = new Map();
  v.forEach(o => orderMap.set(o.id, o));
  const dedup = Array.from(orderMap.values());
  setLS('orders',dedup);
  try{
    if (__sb){
      const mapped = dedup.map(o=>({ id:o.id, customer_id:o.customerId, total:o.total, status:o.status, date:o.date, dropoff:o.dropoff||null, contact:o.contact||null, payment:o.payment||null, delivery_agent_id:o.deliveryAgentId||null }));
      __sb.sbUpsertMany('orders', mapped);
      // Save order items to Supabase
      (async()=>{
        for (const o of dedup){
          try{
            // Remove existing items for this order, then upsert fresh snapshot (idempotent with unique constraint)
            await __sb.sbDeleteWhere('order_items', { order_id: o.id });
            const rows = (o.items||[]).map(it=>({ order_id:o.id, product_id: it.productId, product_name: it.productName, price: it.price, quantity: it.quantity }));
            if (rows.length) await __sb.sbUpsertMany('order_items', rows, 'order_id,product_id');
            console.log(`Order ${o.id} and items saved to Supabase successfully`);
          }catch(e){ console.warn('persist order_items failed for order', o.id, e); }
        }
      })();
    }
  }catch(e){ console.warn('saveOrders to Supabase failed', e); }
}
function getUsers(){return getLS('users')||[]}function saveUsers(v){setLS('users',v); try{ __sb && __sb.sbUpsertMany('users', v);}catch(_){}}
function getDeliveryAgents(){return getLS('deliveryAgents')||[]}function saveDeliveryAgents(v){setLS('deliveryAgents',v); try{ __sb && __sb.sbUpsertMany('delivery_agents', v);}catch(_){}}
function getCart(){return getLS('cart')||[]}function saveCart(v){setLS('cart',v); try{ mirrorCartToSupabase(); }catch(_){}}function clearCart(){setLS('cart',[]); try{ mirrorCartToSupabase(); }catch(_){}}

async function mirrorCartToSupabase(){
  if (!window.__sb) return;
  const u = getCurrentUser(); if (!u) return;
  const cartItems = getCart();
  const cartId = `cart_${u.id}`;
  try{
    await __sb.sbUpsertMany('carts', [{ id: cartId, user_id: u.id, updated_at: new Date().toISOString() }]);
    await __sb.sbDeleteWhere('cart_items', { cart_id: cartId });
    const rows = cartItems.map(it=>({ cart_id: cartId, product_id: it.productId, product_name: it.productName, price: it.price, quantity: it.quantity }));
    if (rows.length) await __sb.sbInsertMany('cart_items', rows);
  }catch(e){ console.warn('mirrorCartToSupabase error', e); }
}

function addProduct(p){const a=getProducts();a.push(p);saveProducts(a);} 
function updateProduct(p){const a=getProducts();const i=a.findIndex(x=>x.id===p.id);if(i!=-1){a[i]=p;saveProducts(a);}}
function addAgent(agent,user){const ag=getDeliveryAgents();ag.push(agent);saveDeliveryAgents(ag);const u=getUsers();u.push(user);saveUsers(u);} 
function assignOrderToAgent(orderId,agentId){const o=getOrders();const i=o.findIndex(x=>x.id===orderId);if(i==-1)return; o[i].deliveryAgentId=agentId; o[i].status=o[i].status||'pending'; saveOrders(o);} 
function updateOrderStatus(orderId,status){const o=getOrders();const i=o.findIndex(x=>x.id===orderId);if(i==-1)return; o[i].status=status; o[i].history=(o[i].history||[]); o[i].history.push({status:status,ts:Date.now()}); saveOrders(o);}

// Function to sync all orders to Supabase
async function syncOrdersToSupabase(){
  try{
    if (!window.__sb) return;
    const orders = getOrders();
    if (orders.length === 0) return;
    
    console.log(`Syncing ${orders.length} orders to Supabase...`);
    
    // Save orders
    const orderRows = orders.map(o=>({ 
      id:o.id, 
      customer_id:o.customerId, 
      total:o.total, 
      status:o.status, 
      date:o.date, 
      dropoff:o.dropoff||null, 
      contact:o.contact||null, 
      payment:o.payment||null, 
      delivery_agent_id:o.deliveryAgentId||null 
    }));
    await __sb.sbUpsertMany('orders', orderRows);
    
    // Save order items
    for (const order of orders){
      try{
        await __sb.sbDeleteWhere('order_items', { order_id: order.id });
        const itemRows = (order.items||[]).map(it=>({ 
          order_id:order.id, 
          product_id: it.productId, 
          product_name: it.productName, 
          price: it.price, 
          quantity: it.quantity 
        }));
        if (itemRows.length) await __sb.sbUpsertMany('order_items', itemRows, 'order_id,product_id');
      }catch(e){ 
        console.warn(`Failed to sync order items for order ${order.id}:`, e); 
      }
    }
    
    console.log('Orders synced to Supabase successfully');
  }catch(e){ 
    console.warn('Failed to sync orders to Supabase:', e); 
  }
} 
function setAgentLocation(agentId,coords){const loc=getAgentLocations();loc[agentId]=coords;saveAgentLocations(loc); try{ __sb && __sb.sbUpsertMany('agent_locations', [{ agent_id: agentId, lat: coords.lat, lng: coords.lng, ts: new Date().toISOString() }], 'agent_id'); }catch(_){}} 
function getAgentLocation(agentId){const loc=getAgentLocations();return loc[agentId]||null;} 
function pushNotification(userId,msg){const n=getNotifications();n[userId]=n[userId]||[];const note={id:idGen(),msg,ts:Date.now()};n[userId].push(note);saveNotifications(n); try{ __sb && __sb.sbInsertMany('notifications', [{ id: note.id, user_id: userId, msg: note.msg, ts: new Date(note.ts).toISOString() }]); }catch(_){}} 
function addCategory(name){const c=getCategories();if(!c.includes(name)) {c.push(name);saveCategories(c);}}
function saveRating(orderId, customerId, rating, feedback){
  const o = getOrders(); const i = o.findIndex(x=>x.id===orderId && x.customerId===customerId);
  if(i==-1) return; o[i].rating = { stars: rating, feedback, ts: Date.now() }; saveOrders(o);
}
function logSearchTerm(term){
  const t = (term||'').trim().toLowerCase(); if(!t) return;
  const products = getProducts();
  const exists = products.some(p=> p.name.toLowerCase()===t);
  if (exists) return; // don't log if exact product exists
  const logs = getSearchLogs();
  const idx = logs.findIndex(x=>x.term===t);
  if (idx!=-1){ logs[idx].count += 1; logs[idx].lastTs = Date.now(); }
  else { logs.push({ id: idGen(), term: t, count: 1, lastTs: Date.now() }); }
  saveSearchLogs(logs); try{ __sb && __sb.sbUpsertMany('search_logs', logs);}catch(_){}
}

// Supabase refresh helpers to make Supabase the source of truth for UI
async function refreshProductsFromSupabase(){
  try{
    if (!window.__sb) return;
    const rows = await __sb.sbGetAll('products');
    if (rows && rows.length){
      const mapped = rows.map(p=>({ id:p.id, name:p.name, description:p.description, price:Number(p.price)||0, originalPrice: p.original_price!=null? Number(p.original_price): undefined, stock:p.stock, stockStatus:p.stock_status, category:p.category, image:p.image, homepageCardId:p.homepage_card_id }));
      saveProducts(mapped);
    }
  }catch(_){ }
}
async function refreshHomepageCardsFromSupabase(){
  try{
    if (!window.__sb) return;
    const rows = await __sb.sbGetAll('homepage_cards');
    if (rows && rows.length){
      const mapped = rows.map(c=>({ id:c.id, title:c.title, description:c.description, category:c.category, image:c.image }));
      saveHomepageCards(mapped);
    }
  }catch(_){ }
}
async function refreshAgentsFromSupabase(){
  try{
    if (!window.__sb) return;
    const rows = await __sb.sbGetAll('delivery_agents');
    if (rows && rows.length){ saveDeliveryAgents(rows); }
  }catch(_){ }
}
