function getProducts(){return getLS('products')||[]}
function saveProducts(v){
  setLS('products',v); 
  try{ 
    __sb && __sb.sbUpsertMany('products', v.map(p=>({ 
      id:p.id, 
      name:p.name, 
      description:p.description, 
      price:p.price, 
      original_price:p.originalPrice||null, 
      stock:p.stock, 
      stock_status:p.stockStatus, 
      category:p.category, 
      image:p.image, 
      homepage_card_id:p.homepageCardId 
    })) ); 
  }catch(_){}
  // Invalidate app cache if available
  if (window.app && window.app.updateProductCache) { 
    window.app.updateProductCache(); 
  }
}
function getOrders(){return getLS('orders')||[]}function saveOrders(v){
  // Deduplicate by id (keep latest version of each order)
  const orderMap = new Map();
  v.forEach(o => orderMap.set(o.id, o));
  const dedup = Array.from(orderMap.values());
  setLS('orders',dedup);
  
  // Don't sync immediately in saveOrders - let syncOrdersToSupabase handle it
  console.log('Orders saved locally, will sync via syncOrdersToSupabase()');
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
function assignOrderToAgent(orderId,agentId){
  const o=getOrders();
  const i=o.findIndex(x=>x.id===orderId);
  if(i==-1)return; 
  o[i].deliveryAgentId=agentId; 
  o[i].status=o[i].status||'pending'; 
  saveOrders(o);
  // Force immediate sync to Supabase for agent assignment
  syncOrdersToSupabase();
} 
function updateOrderStatus(orderId,status){
  const o=getOrders();
  const i=o.findIndex(x=>x.id===orderId);
  if(i==-1)return; 
  o[i].status=status; 
  o[i].history=(o[i].history||[]); 
  o[i].history.push({status:status,ts:Date.now()}); 
  saveOrders(o);
  // Force immediate sync to Supabase for status updates
  syncOrdersToSupabase();
}

// Function to sync users first
async function syncUsersToSupabase(){
  try{
    if (!window.__sb) {
      console.warn('Supabase client not available for user sync');
      return;
    }
    const users = getUsers();
    if (users.length === 0) {
      console.log('No users to sync');
      return;
    }
    
    console.log(`Syncing ${users.length} users to Supabase...`);
    console.log('Local users data:', users);
    
    // Filter out users with invalid IDs
    const validUsers = users.filter(user => {
      if (!user.id || user.id === null || user.id === undefined || user.id === '') {
        console.warn('Skipping user with invalid ID:', user);
        return false;
      }
      if (!user.name || !user.email) {
        console.warn('Skipping user with missing name or email:', user);
        return false;
      }
      return true;
    });
    
    console.log(`Valid users to sync: ${validUsers.length} out of ${users.length}`);
    
    if (validUsers.length === 0) {
      console.log('No valid users to sync');
      return;
    }
    
    // Map users to correct Supabase schema
    const mappedUsers = validUsers.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      password: user.password || '', // Use 'password' not 'pass'
      role: user.role || 'customer'
    }));
    
    console.log('Mapped users for Supabase:', mappedUsers);
    
    // Sync users first
    await __sb.sbUpsertMany('users', mappedUsers);
    console.log('Users synced successfully');
    
    // Also sync delivery agents
    const agents = getDeliveryAgents();
    if (agents.length > 0) {
      console.log('Syncing delivery agents:', agents);
      await __sb.sbUpsertMany('delivery_agents', agents);
      console.log('Delivery agents synced successfully');
    }
    
  }catch(e){ 
    console.error('Failed to sync users to Supabase:', e); 
  }
}

// Function to sync all orders to Supabase
async function syncOrdersToSupabase(){
  try{
    if (!window.__sb) {
      console.warn('Supabase client not available for order sync');
      return;
    }
    
    // First sync users to ensure foreign key constraints are satisfied
    await syncUsersToSupabase();
    
    const orders = getOrders();
    if (orders.length === 0) {
      console.log('No orders to sync');
      return;
    }
    
    console.log(`Syncing ${orders.length} orders to Supabase...`);
    
    // Get all customer IDs from orders
    const customerIds = [...new Set(orders.map(o => o.customerId).filter(Boolean))];
    console.log('Customer IDs in orders:', customerIds);
    
    // Check if all customers exist in Supabase
    const existingUsers = await __sb.sbGetAll('users');
    const existingUserIds = new Set(existingUsers.map(u => u.id));
    const missingCustomers = customerIds.filter(id => !existingUserIds.has(id));
    
    if (missingCustomers.length > 0) {
      console.warn('Missing customers in Supabase:', missingCustomers);
      // Try to find these customers in local users
      const localUsers = getUsers();
      const missingUsers = localUsers.filter(u => missingCustomers.includes(u.id));
      if (missingUsers.length > 0) {
        console.log('Syncing missing users:', missingUsers);
        await __sb.sbUpsertMany('users', missingUsers);
      }
    }
    
    // Save orders first - one by one to handle conflicts better
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
    
    console.log('Order rows to sync:', orderRows);
    
    // Sync orders one by one to handle conflicts
    for (const orderRow of orderRows) {
      try {
        // Validate data before sync
        const validationErrors = validateOrderData(orderRow);
        if (validationErrors.length > 0) {
          console.error(`Validation failed for order ${orderRow.id}:`, validationErrors);
          continue;
        }
        
        // Check if customer exists before syncing order
        if (!existingUserIds.has(orderRow.customer_id)) {
          console.warn(`Customer ${orderRow.customer_id} not found, skipping order ${orderRow.id}`);
          continue;
        }
        
        await __sb.sbUpsertMany('orders', [orderRow]);
        console.log(`Order ${orderRow.id} synced successfully`);
      } catch (e) {
        console.error(`Failed to sync order ${orderRow.id}:`, e);
        // Continue with other orders even if one fails
      }
    }
    
    console.log('Orders table sync completed');
    
    // Save order items only for successfully synced orders
    for (const order of orders){
      try{
        // First check if the order exists in Supabase
        const existingOrders = await __sb.sbGetAll('orders');
        const orderExists = existingOrders.some(o => o.id === order.id);
        
        if (!orderExists) {
          console.warn(`Order ${order.id} not found in Supabase, skipping order items`);
          continue;
        }
        
        await __sb.sbDeleteWhere('order_items', { order_id: order.id });
        const itemRows = (order.items||[]).map(it=>({ 
          order_id:order.id, 
          product_id: it.productId, 
          product_name: it.productName, 
          price: it.price, 
          quantity: it.quantity 
        }));
        if (itemRows.length) {
          await __sb.sbUpsertMany('order_items', itemRows, 'order_id,product_id');
          console.log(`Order items synced for order ${order.id}`);
        }
      }catch(e){ 
        console.error(`Failed to sync order items for order ${order.id}:`, e); 
      }
    }
    
    console.log('All orders and items synced to Supabase successfully');
  }catch(e){ 
    console.error('Failed to sync orders to Supabase:', e); 
  }
}

// Sync just one order (status and items) by ID
async function syncSingleOrder(orderId){
  try{
    if (!window.__sb) {
      console.warn('Supabase client not available for single order sync');
      return;
    }
    // Ensure users are in place first
    await syncUsersToSupabase();

    const all = getOrders();
    const order = all.find(o=>o.id===orderId);
    if (!order) { console.warn('syncSingleOrder: order not found locally', orderId); return; }

    const orderRow = {
      id: order.id,
      customer_id: order.customerId,
      total: Number(order.total)||0,
      status: order.status,
      date: order.date,
      dropoff: order.dropoff||null,
      contact: order.contact||null,
      payment: order.payment||null,
      delivery_agent_id: order.deliveryAgentId||null
    };

    // Validate order row
    const validationErrors = validateOrderData(orderRow);
    if (validationErrors.length) { console.error('syncSingleOrder validation failed', validationErrors); return; }

    // Upsert order first
    await window.__sb.sbUpsertMany('orders', [orderRow]);

    // Upsert items for this order
    const itemRows = (order.items||[]).map(it=>({
      order_id: order.id,
      product_id: it.productId,
      product_name: it.productName,
      price: it.price,
      quantity: it.quantity
    }));

    // Optional: clear then insert to avoid stale lines
    await window.__sb.sbDeleteWhere('order_items', { order_id: order.id });
    if (itemRows.length){
      await window.__sb.sbUpsertMany('order_items', itemRows, 'order_id,product_id');
    }

    console.log('syncSingleOrder complete for', orderId);
  }catch(e){
    console.error('syncSingleOrder failed:', e);
  }
}

// expose for app.js
window.syncSingleOrder = syncSingleOrder;

// Manual sync function for testing - call from browser console
window.manualSyncOrders = async function() {
  console.log('Manual sync triggered...');
  await syncOrdersToSupabase();
};

// Test Supabase connection
window.testSupabaseConnection = async function() {
  if (!window.__sb) {
    console.error('Supabase client not available');
    return;
  }
  try {
    const orders = await window.__sb.sbGetAll('orders');
    console.log('Supabase connection test successful. Orders count:', orders.length);
    return orders;
  } catch (e) {
    console.error('Supabase connection test failed:', e);
  }
};

// Clear problematic data and resync
window.clearAndResyncOrders = async function() {
  if (!window.__sb) {
    console.error('Supabase client not available');
    return;
  }
  try {
    console.log('Clearing order_items table...');
    await window.__sb.sbDeleteWhere('order_items', {});
    console.log('Clearing orders table...');
    await window.__sb.sbDeleteWhere('orders', {});
    console.log('Tables cleared, now resyncing...');
    await syncOrdersToSupabase();
  } catch (e) {
    console.error('Clear and resync failed:', e);
  }
};

// Validate order data before sync
function validateOrderData(order) {
  const errors = [];
  
  if (!order.id || typeof order.id !== 'string') {
    errors.push('Invalid or missing order ID');
  }
  
  if (!order.customer_id || typeof order.customer_id !== 'string') {
    errors.push('Invalid or missing customer_id');
  }
  
  if (typeof order.total !== 'number' || order.total < 0) {
    errors.push('Invalid total amount');
  }
  
  if (!order.status || !['pending', 'picked_up', 'out_for_delivery', 'delivered'].includes(order.status)) {
    errors.push('Invalid order status');
  }
  
  if (!order.date || isNaN(new Date(order.date).getTime())) {
    errors.push('Invalid date format');
  }
  
  if (order.dropoff && (!order.dropoff.lat || !order.dropoff.lng)) {
    errors.push('Invalid dropoff coordinates');
  }
  
  return errors;
}

// Test individual order sync
window.testOrderSync = async function(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }
  
  console.log('Testing sync for order:', order);
  
  // Validate data
  const orderRow = { 
    id: order.id, 
    customer_id: order.customerId, 
    total: Number(order.total) || 0, 
    status: order.status, 
    date: order.date, 
    dropoff: order.dropoff || null, 
    contact: order.contact || null, 
    payment: order.payment || null, 
    delivery_agent_id: order.deliveryAgentId || null 
  };
  
  const validationErrors = validateOrderData(orderRow);
  if (validationErrors.length > 0) {
    console.error('Validation errors:', validationErrors);
    return;
  }
  
  console.log('Validated order row:', orderRow);
  
  try {
    await window.__sb.sbUpsertMany('orders', [orderRow]);
    console.log('Order sync test successful');
  } catch (e) {
    console.error('Order sync test failed:', e);
  }
};

// Check existing orders in Supabase
window.checkSupabaseOrders = async function() {
  if (!window.__sb) {
    console.error('Supabase client not available');
    return;
  }
  try {
    const orders = await window.__sb.sbGetAll('orders');
    console.log('Orders in Supabase:', orders);
    return orders;
  } catch (e) {
    console.error('Failed to get orders from Supabase:', e);
  }
};

// Compare local vs Supabase orders
window.compareOrders = async function() {
  const localOrders = getOrders();
  const supabaseOrders = await window.checkSupabaseOrders();
  
  console.log('Local orders count:', localOrders.length);
  console.log('Supabase orders count:', supabaseOrders?.length || 0);
  
  const localIds = new Set(localOrders.map(o => o.id));
  const supabaseIds = new Set(supabaseOrders?.map(o => o.id) || []);
  
  const onlyLocal = localOrders.filter(o => !supabaseIds.has(o.id));
  const onlySupabase = supabaseOrders?.filter(o => !localIds.has(o.id)) || [];
  
  console.log('Orders only in local:', onlyLocal);
  console.log('Orders only in Supabase:', onlySupabase);
  
  return { localOrders, supabaseOrders, onlyLocal, onlySupabase };
};

// Try using INSERT instead of UPSERT
window.tryInsertOrder = async function(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }
  
  const orderRow = { 
    id: order.id, 
    customer_id: order.customerId, 
    total: Number(order.total) || 0, 
    status: order.status, 
    date: order.date, 
    dropoff: order.dropoff || null, 
    contact: order.contact || null, 
    payment: order.payment || null, 
    delivery_agent_id: order.deliveryAgentId || null 
  };
  
  console.log('Trying INSERT for order:', orderRow);
  
  try {
    await window.__sb.sbInsertMany('orders', [orderRow]);
    console.log('Order INSERT successful');
  } catch (e) {
    console.error('Order INSERT failed:', e);
  }
};

// Try using UPDATE instead of UPSERT
window.tryUpdateOrder = async function(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }
  
  const orderRow = { 
    id: order.id, 
    customer_id: order.customerId, 
    total: Number(order.total) || 0, 
    status: order.status, 
    date: order.date, 
    dropoff: order.dropoff || null, 
    contact: order.contact || null, 
    payment: order.payment || null, 
    delivery_agent_id: order.deliveryAgentId || null 
  };
  
  console.log('Trying UPDATE for order:', orderRow);
  
  try {
    if (!window.supabaseClient) {
      console.error('Supabase client not available');
      return;
    }
    
    const { data, error } = await window.supabaseClient
      .from('orders')
      .update(orderRow)
      .eq('id', orderId);
      
    if (error) {
      console.error('UPDATE error:', error);
    } else {
      console.log('Order UPDATE successful:', data);
    }
  } catch (e) {
    console.error('Order UPDATE failed:', e);
  }
};

// Check and fix missing users
window.checkAndFixUsers = async function() {
  if (!window.__sb) {
    console.error('Supabase client not available');
    return;
  }
  
  try {
    const localUsers = getUsers();
    const supabaseUsers = await window.__sb.sbGetAll('users');
    
    console.log('Local users:', localUsers);
    console.log('Supabase users:', supabaseUsers);
    
    const localUserIds = new Set(localUsers.map(u => u.id));
    const supabaseUserIds = new Set(supabaseUsers.map(u => u.id));
    
    const missingInSupabase = localUsers.filter(u => !supabaseUserIds.has(u.id));
    const missingLocally = supabaseUsers.filter(u => !localUserIds.has(u.id));
    
    console.log('Users missing in Supabase:', missingInSupabase);
    console.log('Users missing locally:', missingLocally);
    
    if (missingInSupabase.length > 0) {
      console.log('Syncing missing users to Supabase...');
      
      // Filter out users with invalid IDs
      const validMissingUsers = missingInSupabase.filter(user => {
        if (!user.id || user.id === null || user.id === undefined || user.id === '') {
          console.warn('Skipping missing user with invalid ID:', user);
          return false;
        }
        if (!user.name || !user.email) {
          console.warn('Skipping missing user with missing name or email:', user);
          return false;
        }
        return true;
      });
      
      if (validMissingUsers.length === 0) {
        console.log('No valid missing users to sync');
        return { localUsers, supabaseUsers, missingInSupabase, missingLocally };
      }
      
      // Map users to correct Supabase schema
      const mappedMissingUsers = validMissingUsers.map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        password: user.password || '', // Use 'password' not 'pass'
        role: user.role || 'customer'
      }));
      
      await window.__sb.sbUpsertMany('users', mappedMissingUsers);
      console.log('Missing users synced successfully');
    }
    
    return { localUsers, supabaseUsers, missingInSupabase, missingLocally };
  } catch (e) {
    console.error('Failed to check and fix users:', e);
  }
};

// Check Supabase users table schema
window.checkSupabaseUserSchema = async function() {
  if (!window.__sb) {
    console.error('Supabase client not available');
    return;
  }
  
  try {
    // Try to get one user to see the schema
    const { data, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error getting user schema:', error);
    } else {
      console.log('Supabase users table schema (sample):', data);
      if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
      }
    }
  } catch (e) {
    console.error('Failed to check user schema:', e);
  }
};

// Clean up invalid users from local storage
window.cleanupInvalidUsers = function() {
  const users = getUsers();
  console.log('Original users count:', users.length);
  
  const validUsers = users.filter(user => {
    if (!user.id || user.id === null || user.id === undefined || user.id === '') {
      console.warn('Removing user with invalid ID:', user);
      return false;
    }
    if (!user.name || !user.email) {
      console.warn('Removing user with missing name or email:', user);
      return false;
    }
    return true;
  });
  
  console.log('Valid users count:', validUsers.length);
  console.log('Removed invalid users:', users.length - validUsers.length);
  
  if (validUsers.length !== users.length) {
    saveUsers(validUsers);
    console.log('Invalid users cleaned up from local storage');
  }
  
  return validUsers;
}; 
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
      // Cache is automatically updated by saveProducts
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
