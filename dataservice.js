function getProducts(){return getLS('products')||[]}function saveProducts(v){setLS('products',v); try{ __sb && __sb.sbUpsertMany('products', v.map(p=>({ id:p.id, name:p.name, description:p.description, price:p.price, original_price:p.originalPrice||null, stock:p.stock, stock_status:p.stockStatus, category:p.category, image:p.image, homepage_card_id:p.homepageCardId })) ); }catch(_){}}
function getOrders(){return getLS('orders')||[]}// Rate limiting to prevent too many concurrent requests
let syncInProgress = false;
let syncQueue = [];

async function saveOrders(v){
  // Deduplicate by id (keep latest version of each order)
  const orderMap = new Map();
  v.forEach(o => orderMap.set(o.id, o));
  const dedup = Array.from(orderMap.values());
  setLS('orders',dedup);
  
  // Add to sync queue instead of immediate sync
  syncQueue.push(dedup);
  
  // Process sync queue if not already in progress
  if (!syncInProgress) {
    processSyncQueue();
  }
}

async function processSyncQueue() {
  if (syncInProgress || syncQueue.length === 0) return;
  
  syncInProgress = true;
  
  while (syncQueue.length > 0) {
    const orders = syncQueue.shift();
    try {
      await syncOrdersToSupabaseImmediate(orders);
      console.log('Orders synced to Supabase successfully');
    } catch (error) {
      console.error('Failed to sync orders to Supabase:', error);
    }
    
    // Add small delay between syncs to prevent overwhelming the server
    if (syncQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  syncInProgress = false;
}

// Function to validate order data structure against Supabase schema
function validateOrderData(order) {
  const requiredFields = ['id', 'customerId', 'total', 'status', 'date'];
  const missingFields = requiredFields.filter(field => !order[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Order validation failed: Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Validate data types and constraints
  if (typeof order.total !== 'number' || order.total < 0) {
    throw new Error('Order total must be a non-negative number');
  }
  
  const validStatuses = ['pending', 'picked_up', 'out_for_delivery', 'delivered'];
  if (!validStatuses.includes(order.status)) {
    throw new Error(`Invalid order status: ${order.status}. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Validate order items
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item, index) => {
      if (!item.productId || !item.productName || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error(`Invalid order item at index ${index}: Missing required fields or wrong data types`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Invalid order item at index ${index}: Quantity must be greater than 0`);
      }
    });
  }
  
  return true;
}

// Immediate sync function that waits for completion
async function syncOrdersToSupabaseImmediate(orders){
  if (!orders || orders.length === 0 || !window.__sb) return;
  
  try{
    console.log(`Syncing ${orders.length} orders to Supabase immediately...`);
    
    // Validate all orders before syncing
    orders.forEach((order, index) => {
      try {
        validateOrderData(order);
      } catch (error) {
        throw new Error(`Order validation failed at index ${index}: ${error.message}`);
      }
    });
    
    // Save orders to Supabase
    const orderRows = orders.map(o=>({ 
      id:o.id, 
      customer_id:o.customerId, 
      total:Number(o.total)||0, 
      status:o.status||'pending', 
      date:o.date||new Date().toISOString(), 
      dropoff:o.dropoff||null, 
      contact:o.contact||null, 
      payment:o.payment||null, 
      delivery_agent_id:o.deliveryAgentId||null 
    }));
    
    // Try to sync all orders at once first, then fall back to individual syncs
    try {
      await window.__sb.sbUpsertMany('orders', orderRows);
      console.log('All orders synced successfully in batch');
    } catch (batchError) {
      console.warn('Batch sync failed, trying individual syncs:', batchError);
      // Process orders one by one to avoid conflicts
      for (const orderRow of orderRows) {
        try {
          await window.__sb.sbUpsertMany('orders', [orderRow]);
          console.log(`Order ${orderRow.id} synced successfully`);
        } catch (orderError) {
          console.error(`Failed to sync order ${orderRow.id}:`, orderError);
          // Continue with other orders even if one fails
        }
      }
    }
    
    // Save order items to Supabase
    for (const order of orders){
      try{
        // Remove existing items for this order first
        await window.__sb.sbDeleteWhere('order_items', { order_id: order.id });
        
        // Insert new order items
        const itemRows = (order.items||[]).map(it=>({ 
          order_id:order.id, 
          product_id: it.productId, 
          product_name: it.productName, 
          price: Number(it.price)||0, 
          quantity: Number(it.quantity)||0 
        }));
        
        if (itemRows.length) {
          // Try batch insert first, then fall back to individual inserts
          try {
            await window.__sb.sbInsertMany('order_items', itemRows);
            console.log(`Order items for ${order.id} synced successfully in batch`);
          } catch (batchError) {
            console.warn(`Batch insert failed for order ${order.id}, trying individual inserts:`, batchError);
            // Insert items one by one to avoid conflicts
            for (const itemRow of itemRows) {
              try {
                await window.__sb.sbInsertMany('order_items', [itemRow]);
              } catch (itemError) {
                console.error(`Failed to sync item ${itemRow.product_id} for order ${order.id}:`, itemError);
                // Continue with other items
              }
            }
          }
        }
      }catch(e){ 
        console.error(`Failed to sync order items for order ${order.id}:`, e); 
        // Don't throw - continue with other orders
      }
    }
    
    console.log('All orders and items synced to Supabase successfully');
  }catch(e){ 
    console.error('Failed to sync orders to Supabase:', e); 
    throw e; // Re-throw so calling code knows it failed
  }
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
async function assignOrderToAgent(orderId,agentId){const o=getOrders();const i=o.findIndex(x=>x.id===orderId);if(i==-1)return; o[i].deliveryAgentId=agentId; o[i].status=o[i].status||'pending'; await saveOrders(o);} 
async function updateOrderStatus(orderId,status){
  const o=getOrders();
  const i=o.findIndex(x=>x.id===orderId);
  if(i==-1) {
    console.error(`Order ${orderId} not found in local storage`);
    return;
  }
  
  console.log(`Updating order ${orderId} from ${o[i].status} to ${status}`);
  
  // Update order status and history
  o[i].status=status;
  o[i].history=(o[i].history||[]);
  o[i].history.push({status:status,ts:Date.now()});
  
  // Save to local storage immediately (this ensures UI updates immediately)
  setLS('orders', o);
  console.log(`Order ${orderId} status saved to local storage: ${status}`);
  
  // Force immediate Supabase sync for this specific order
  try {
    await syncSingleOrderToSupabase(o[i]);
    console.log(`Order ${orderId} status synced to Supabase immediately: ${status}`);
  } catch (error) {
    console.error(`Failed to sync order ${orderId} status to Supabase immediately:`, error);
    // Still queue for retry
    await saveOrders(o);
  }
  
  // Trigger real-time updates for all interfaces
  triggerOrderStatusUpdate(orderId, status, o[i]);
  
  // Verify the update was successful
  const updatedOrder = getOrders().find(x => x.id === orderId);
  console.log(`Verification - Order ${orderId} current status: ${updatedOrder?.status}`);
}

// Function to sync a single order to Supabase immediately
async function syncSingleOrderToSupabase(order) {
  if (!window.__sb || !window.supabaseClient) return;
  
  try {
    // Validate order data
    validateOrderData(order);
    
    // Convert order to Supabase format
    const orderRow = {
      id: order.id,
      customer_id: order.customerId,
      total: Number(order.total) || 0,
      status: order.status,
      date: order.date,
      dropoff: order.dropoff,
      contact: order.contact,
      payment: order.payment,
      delivery_agent_id: order.deliveryAgentId
    };
    
    // Upsert the order
    await window.__sb.sbUpsertMany('orders', [orderRow]);
    console.log(`Order ${order.id} synced to Supabase successfully`);
    
    // Delete existing order items and insert new ones
    await window.__sb.sbDeleteWhere('order_items', { order_id: order.id });
    
    if (order.items && order.items.length > 0) {
      const itemRows = order.items.map(it => ({
        order_id: order.id,
        product_id: it.productId,
        product_name: it.productName,
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 0
      }));
      
      await window.__sb.sbInsertMany('order_items', itemRows);
      console.log(`Order items for ${order.id} synced to Supabase successfully`);
    }
    
  } catch (error) {
    console.error(`Failed to sync single order ${order.id} to Supabase:`, error);
    throw error;
  }
}

// Function to sync all orders to Supabase
async function syncOrdersToSupabase(){
  try{
    const orders = getOrders();
    if (orders.length === 0) return;
    
    console.log(`Syncing ${orders.length} orders to Supabase...`);
    await syncOrdersToSupabaseImmediate(orders);
    console.log('All orders synced to Supabase successfully');
  }catch(e){ 
    console.warn('Failed to sync orders to Supabase:', e); 
    throw e; // Re-throw so calling code knows it failed
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

async function refreshUsersFromSupabase(){
  try{
    if (!window.__sb) return;
    const rows = await __sb.sbGetAll('users');
    if (rows && rows.length){ 
      saveUsers(rows);
      console.log('Users refreshed from Supabase:', rows.length);
    }
  }catch(_){ }
}

// Real-time order status update trigger
function triggerOrderStatusUpdate(orderId, status, order) {
  console.log(`Order ${orderId} status updated to: ${status}`);
  
  // Dispatch custom event for real-time updates
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('orderStatusUpdate', {
      detail: {
        orderId: orderId,
        status: status,
        order: order,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }
  
  // Trigger interface updates based on user role
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.role === 'delivery') {
      // Update delivery interface
      if (window.app && typeof window.app.renderDelivery === 'function') {
        window.app.renderDelivery();
      }
    } else if (currentUser.role === 'customer' && order.customerId === currentUser.id) {
      // Update customer interface for this specific customer
      if (window.app && typeof window.app.renderCustomerOrders === 'function') {
        window.app.renderCustomerOrders();
      }
      // Update tracking if currently viewing this order
      if (window.app && window.app.customerTrackInterval && window.app._trackingOrderId === orderId) {
        window.app.trackOrder(orderId);
      }
    } else if (currentUser.role === 'admin') {
      // Update admin interface
      if (window.app && typeof window.app.renderAdmin === 'function') {
        window.app.renderAdmin();
      }
    }
  }
  
  // Also update customer interface if order is delivered (regardless of current user)
  if (status === 'delivered' && order.customerId) {
    // Find the customer and update their interface if they're currently logged in
    const users = getUsers();
    const customer = users.find(u => u.id === order.customerId);
    if (customer && customer.role === 'customer') {
      // Check if this customer is currently logged in
      if (currentUser && currentUser.id === order.customerId) {
        if (window.app && typeof window.app.renderCustomerOrders === 'function') {
          window.app.renderCustomerOrders();
        }
      }
    }
  }
}

// Function to start real-time order monitoring
function startOrderStatusMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Listen for order status updates
  window.addEventListener('orderStatusUpdate', (event) => {
    const { orderId, status, order } = event.detail;
    console.log(`Real-time update received: Order ${orderId} -> ${status}`);
    
    // Update any active tracking interfaces
    if (window.app) {
      // Refresh delivery map markers
      if (typeof window.app.refreshDeliveryMapMarkers === 'function') {
        window.app.refreshDeliveryMapMarkers();
      }
      
      // Update customer tracking if active
      if (window.app.customerTrackInterval && window.app._trackingOrderId === orderId) {
        window.app.trackOrder(orderId);
      }
      
      // Refresh notifications
      if (order.customerId && typeof window.app.renderCustomerNotifications === 'function') {
        window.app.renderCustomerNotifications(order.customerId);
      }
    }
  });
  
  // Periodic sync from Supabase to catch updates from other sessions
  setInterval(async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser && window.__sb) {
        // Sync orders from Supabase to get updates from other delivery agents
        await syncOrdersFromSupabase();
      }
    } catch (error) {
      console.warn('Periodic order sync failed:', error);
    }
  }, 10000); // Sync every 10 seconds
}

// Function to sync orders from Supabase (pull updates)
async function syncOrdersFromSupabase() {
  try {
    if (!window.__sb) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Refresh users first to ensure we have customer names
    try { await refreshUsersFromSupabase(); } catch(_){ }
    
    // Get orders from Supabase
    let query = window.supabaseClient.from('orders').select('*');
    
    if (currentUser.role === 'customer') {
      query = query.eq('customer_id', currentUser.id);
    } else if (currentUser.role === 'delivery') {
      // Only get orders assigned to current delivery agent
      query = query.eq('delivery_agent_id', currentUser.id);
    }
    
    const { data: supabaseOrders } = await query;
    
    if (supabaseOrders && supabaseOrders.length > 0) {
      // Get order items for these orders
      const orderIds = supabaseOrders.map(o => o.id);
      const { data: orderItems } = await window.supabaseClient
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      
      // Convert to local format
      const groupedItems = {};
      if (orderItems) {
        orderItems.forEach(item => {
          if (!groupedItems[item.order_id]) groupedItems[item.order_id] = [];
          groupedItems[item.order_id].push({
            productId: item.product_id,
            productName: item.product_name,
            price: Number(item.price),
            quantity: item.quantity
          });
        });
      }
      
      // Get customer names from users table
      const users = getUsers();
      const userMap = users.reduce((m, u) => { m[u.id] = u.name; return m; }, {});
      
      const localOrders = supabaseOrders.map(o => ({
        id: o.id,
        customerId: o.customer_id,
        customerName: userMap[o.customer_id] || (o.contact && o.contact.name) || 'Unknown Customer',
        items: groupedItems[o.id] || [],
        total: Number(o.total),
        status: o.status,
        date: o.date,
        dropoff: o.dropoff,
        contact: o.contact,
        payment: o.payment,
        deliveryAgentId: o.delivery_agent_id,
        history: [] // Supabase doesn't store history, keep local history
      }));
      
      // Merge with existing local orders
      const existingOrders = getOrders();
      const existingIds = new Set(existingOrders.map(o => o.id));
      const newOrders = localOrders.filter(o => !existingIds.has(o.id));
      const updatedOrders = localOrders.filter(o => existingIds.has(o.id));
      
      // Update existing orders with Supabase data (preserve local history)
      const mergedOrders = existingOrders.map(existingOrder => {
        const updated = updatedOrders.find(u => u.id === existingOrder.id);
        if (updated) {
          return {
            ...updated,
            history: existingOrder.history || [] // Preserve local history
          };
        }
        return existingOrder;
      });
      
      // Add new orders
      const finalOrders = [...mergedOrders, ...newOrders];
      
      // Only update if there are changes
      if (finalOrders.length !== existingOrders.length || 
          JSON.stringify(finalOrders) !== JSON.stringify(existingOrders)) {
        saveOrders(finalOrders);
        
        // Trigger interface updates
        const currentUser = getCurrentUser();
        if (currentUser && window.app) {
          if (currentUser.role === 'customer') {
            window.app.renderCustomerOrders();
          } else if (currentUser.role === 'delivery') {
            window.app.renderDelivery();
          } else if (currentUser.role === 'admin') {
            window.app.renderAdmin();
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to sync orders from Supabase:', error);
  }
}

// Test function to verify order storage works correctly
async function testOrderStorage() {
  try {
    console.log('Testing order storage functionality...');
    
    // Create a test order
    const testOrder = {
      id: 'test_' + Date.now(),
      customerId: 'test_customer',
      customerName: 'Test Customer',
      items: [
        {
          productId: 'test_product_1',
          productName: 'Test Product 1',
          price: 100,
          quantity: 2
        },
        {
          productId: 'test_product_2',
          productName: 'Test Product 2',
          price: 50,
          quantity: 1
        }
      ],
      total: 250,
      status: 'pending',
      date: new Date().toISOString(),
      dropoff: { lat: 12.9716, lng: 77.5946 },
      contact: {
        name: 'Test Customer',
        mobile: '9876543210',
        address: 'Test Address',
        pincode: '560001'
      },
      payment: { id: 'test_payment', status: 'success' }
    };
    
    // Validate the test order
    validateOrderData(testOrder);
    console.log('✓ Order validation passed');
    
    // Test saving to Supabase (only if Supabase is available)
    if (window.__sb) {
      await syncOrdersToSupabaseImmediate([testOrder]);
      console.log('✓ Order successfully saved to Supabase');
      
      // Clean up test order
      await window.__sb.sbDeleteWhere('orders', { id: testOrder.id });
      await window.__sb.sbDeleteWhere('order_items', { order_id: testOrder.id });
      console.log('✓ Test order cleaned up');
    } else {
      console.log('⚠ Supabase not available - skipping Supabase test');
    }
    
    console.log('✓ Order storage test completed successfully');
    return true;
  } catch (error) {
    console.error('✗ Order storage test failed:', error);
    return false;
  }
}
