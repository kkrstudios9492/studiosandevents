// Supabase-powered data service functions
async function getProducts(){
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.getProducts();
      if (result !== null) return result;
    } catch (error) {
      console.warn('Supabase getProducts failed, falling back to localStorage:', error);
    }
  }
  return getLS('products')||[];
}

async function saveProducts(v){
  if (window.supabaseService) {
    // For bulk operations, we'll handle this differently
    console.log('Bulk product save not implemented in Supabase service - using localStorage');
    setLS('products',v);
    return;
  }
  setLS('products',v);
}

async function getOrders(){
  const user = getCurrentUser();
  
  if (window.supabaseService) {
    try {
      // For customers, get only their orders
      if (user && user.role === 'customer') {
        const result = await window.supabaseService.getCustomerOrders(user.id);
        if (result !== null) return result;
      } else {
        // For admins and delivery agents, get all orders
        const result = await window.supabaseService.getOrders();
        if (result !== null) return result;
      }
    } catch (error) {
      console.warn('Supabase getOrders failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage with user filtering
  const allOrders = getLS('orders') || [];
  if (user && user.role === 'customer') {
    return allOrders.filter(order => order.customer_id === user.id);
  }
  return allOrders;
}

async function saveOrders(v){
  if (window.supabaseService) {
    // For bulk operations, we'll handle this differently
    console.log('Bulk order save not implemented in Supabase service');
    return;
  }
  setLS('orders',v);
}

async function getUsers(){
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.getUsers();
      if (result !== null) return result;
    } catch (error) {
      console.warn('Supabase getUsers failed, falling back to localStorage:', error);
    }
  }
  return getLS('users')||[];
}

async function saveUsers(v){
  if (window.supabaseService) {
    // For bulk operations, we'll handle this differently
    console.log('Bulk user save not implemented in Supabase service');
    return;
  }
  setLS('users',v);
}

async function getDeliveryAgents(){
  if (window.supabaseService) {
    return await window.supabaseService.getDeliveryAgents();
  }
  return getLS('deliveryAgents')||[];
}

async function saveDeliveryAgents(v){
  if (window.supabaseService) {
    // For bulk operations, we'll handle this differently
    console.log('Bulk delivery agent save not implemented in Supabase service');
    return;
  }
  setLS('deliveryAgents',v);
}

async function getCart(){
  const user = getCurrentUser();
  if (!user) return getLS('cart') || [];
  
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.getCart(user.id);
      if (result !== null) return result;
    } catch (error) {
      console.warn('Supabase getCart failed, falling back to localStorage:', error);
    }
  }
  return getLS('cart') || [];
}

async function saveCart(cart){
  const user = getCurrentUser();
  if (!user) {
    setLS('cart', cart);
    return;
  }
  
  if (window.supabaseService) {
    try {
      // For cart updates, we need to handle each item individually
      // This is a simplified approach - in production you'd want to batch operations
      console.log('Cart save not fully implemented in Supabase - using localStorage fallback');
      setLS('cart', cart);
      return;
    } catch (error) {
      console.warn('Supabase saveCart failed, falling back to localStorage:', error);
    }
  }
  setLS('cart', cart);
}

async function clearCart(){
  const user = getCurrentUser();
  if (!user) {
    localStorage.removeItem('cart');
    console.log('Cart cleared from localStorage (no user)');
    return;
  }
  
  console.log('Clearing cart for user:', user.id);
  
  // Clear from Supabase first
  if (window.supabaseService) {
    try {
      await window.supabaseService.clearCart(user.id);
      console.log('Cart cleared from Supabase');
    } catch (error) {
      console.warn('Supabase clearCart failed, falling back to localStorage:', error);
    }
  }
  
  // Always clear localStorage as well for consistency
  localStorage.removeItem('cart');
  console.log('Cart cleared from localStorage');
  
  // Verify cart is cleared
  const remainingCart = getLS('cart') || [];
  if (remainingCart.length > 0) {
    console.warn('Cart still has items after clearing:', remainingCart.length);
    // Force clear again
    localStorage.removeItem('cart');
    console.log('Cart force cleared from localStorage');
  } else {
    console.log('Cart successfully cleared');
  }
  
  // Also try to clear from Supabase again if it failed
  if (window.supabaseService && remainingCart.length > 0) {
    try {
      await window.supabaseService.clearCart(user.id);
      console.log('Cart cleared from Supabase (retry)');
    } catch (error) {
      console.error('Error clearing cart from Supabase (retry):', error);
    }
  }
}

// Updated functions to use Supabase
async function addProduct(p){
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.addProduct(p);
      if (result !== null) {
        console.log('Product added to Supabase successfully');
        return result;
      }
    } catch (error) {
      console.warn('Supabase addProduct failed, falling back to localStorage:', error);
    }
  }
  // Fallback to localStorage
  const a = await getProducts();
  a.push(p);
  await saveProducts(a);
  console.log('Product added to localStorage');
}

async function updateProduct(p){
  if (window.supabaseService) {
    try {
      console.log('Attempting to update product in Supabase:', p);
      const result = await window.supabaseService.updateProduct(p);
      console.log('Supabase updateProduct result:', result);
      if (result !== null) {
        console.log('Product updated in Supabase successfully');
        return result;
      } else {
        console.warn('Supabase updateProduct returned null, falling back to localStorage');
      }
    } catch (error) {
      console.warn('Supabase updateProduct failed, falling back to localStorage:', error);
    }
  }
  // Fallback to localStorage
  console.log('Using localStorage fallback for updateProduct');
  const a = await getProducts();
  const i = a.findIndex(x=>x.id===p.id);
  if(i!=-1){
    console.log('Updating product in localStorage array, preserving homepage_card_id:', p.homepage_card_id);
    a[i]=p; // This preserves all fields including homepage_card_id
    await saveProducts(a);
    console.log('Product updated in localStorage with homepage_card_id:', a[i].homepage_card_id);
  }
}

async function addAgent(agent,user){
  if (window.supabaseService) {
    await window.supabaseService.addUser(user);
    return await window.supabaseService.addDeliveryAgent(agent);
  }
  const ag = await getDeliveryAgents();
  ag.push(agent);
  await saveDeliveryAgents(ag);
  const u = await getUsers();
  u.push(user);
  await saveUsers(u);
}

async function assignOrderToAgent(orderId,agentId){
  console.log('Assigning order to agent:', { orderId, agentId });
  
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.assignOrderToAgent(orderId, agentId);
      console.log('Order assigned to agent in Supabase:', result);
      return result;
    } catch (error) {
      console.warn('Supabase assignOrderToAgent failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const o = await getOrders();
    const i = o.findIndex(x=>x.id===orderId);
    if(i==-1) {
      console.error('Order not found in localStorage:', orderId);
      return;
    }
    
    o[i].delivery_agent_id = agentId; 
    o[i].status = o[i].status || 'pending'; 
    o[i].updated_at = new Date().toISOString();
    
    await saveOrders(o);
    console.log('Order assigned to agent in localStorage');
  } catch (error) {
    console.error('Error assigning order to agent in localStorage:', error);
  }
} 

async function updateOrderStatus(orderId,status){
  console.log('Updating order status:', { orderId, status });
  
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.updateOrderStatus(orderId, status);
      console.log('Order status updated in Supabase:', result);
      return result;
    } catch (error) {
      console.warn('Supabase updateOrderStatus failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const o = await getOrders();
    const i = o.findIndex(x=>x.id===orderId);
    if(i==-1) {
      console.error('Order not found in localStorage:', orderId);
      return;
    }
    
    o[i].status=status; 
    o[i].history=(o[i].history||[]); 
    o[i].history.push({status:status,ts:Date.now()}); 
    o[i].updated_at = new Date().toISOString();
    
    await saveOrders(o);
    console.log('Order status updated in localStorage');
  } catch (error) {
    console.error('Error updating order status in localStorage:', error);
  }
} 

async function setAgentLocation(agentId,coords){
  if (window.supabaseService) {
    return await window.supabaseService.setAgentLocation(agentId, coords);
  }
  const loc = getAgentLocations();
  loc[agentId]=coords;
  saveAgentLocations(loc);
} 

async function getAgentLocation(agentId){
  if (window.supabaseService) {
    return await window.supabaseService.getAgentLocation(agentId);
  }
  const loc = getAgentLocations();
  return loc[agentId]||null;
} 

async function pushNotification(userId,msg){
  if (window.supabaseService) {
    return await window.supabaseService.pushNotification(userId, msg);
  }
  const n = getNotifications();
  n[userId]=n[userId]||[];
  n[userId].push({id:idGen(),msg,ts:Date.now()});
  saveNotifications(n);
} 

async function addCategory(name){
  if (window.supabaseService) {
    return await window.supabaseService.addCategory(name);
  }
  const c = await getCategories();
  if(!c.includes(name)) {
    c.push(name);
    await saveCategories(c);
  }
}

async function saveRating(orderId, customerId, rating, feedback){
  if (window.supabaseService) {
    return await window.supabaseService.saveRating(orderId, customerId, rating, feedback);
  }
  const o = await getOrders(); 
  const i = o.findIndex(x=>x.id===orderId && x.customerId===customerId);
  if(i==-1) return; 
  o[i].rating = { stars: rating, feedback, ts: Date.now() }; 
  await saveOrders(o);
}

async function logSearchTerm(term){
  if (window.supabaseService) {
    return await window.supabaseService.logSearchTerm(term);
  }
  const t = (term||'').trim().toLowerCase(); 
  if(!t) return;
  const products = await getProducts();
  const exists = products.some(p=> p.name.toLowerCase()===t);
  if (exists) return; // don't log if exact product exists
  const logs = await getSearchLogs();
  const idx = logs.findIndex(x=>x.term===t);
  if (idx!=-1){ 
    logs[idx].count += 1; 
    logs[idx].lastTs = Date.now(); 
  }
  else { 
    logs.push({ id: idGen(), term: t, count: 1, lastTs: Date.now() }); 
  }
  await saveSearchLogs(logs);
}

// Additional functions needed for the app
async function getHomepageCards(){
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.getHomepageCards();
      if (result !== null) return result;
    } catch (error) {
      console.warn('Supabase getHomepageCards failed, falling back to localStorage:', error);
    }
  }
  return getLS('homepageCards')||[];
}

async function saveHomepageCards(cards){
  if (window.supabaseService) {
    return await window.supabaseService.saveHomepageCards(cards);
  }
  setLS('homepageCards', cards);
}

async function getSearchLogs(){
  if (window.supabaseService) {
    try {
      const result = await window.supabaseService.getSearchLogs();
      if (result !== null) return result;
    } catch (error) {
      console.warn('Supabase getSearchLogs failed, falling back to localStorage:', error);
    }
  }
  return getLS('searchLogs')||[];
}

async function saveSearchLogs(logs){
  if (window.supabaseService) {
    // Search logs are handled individually in Supabase
    return;
  }
  setLS('searchLogs', logs);
}

async function getCategories(){
  if (window.supabaseService) {
    return await window.supabaseService.getCategories();
  }
  return getLS('categories')||[];
}

async function saveCategories(categories){
  if (window.supabaseService) {
    // Categories are handled individually in Supabase
    return;
  }
  setLS('categories', categories);
}

function getAgentLocations(){
  return getLS('agentLocations')||{};
}

function saveAgentLocations(locations){
  setLS('agentLocations', locations);
}

function getNotifications(){
  return getLS('notifications')||{};
}

function saveNotifications(notifications){
  setLS('notifications', notifications);
}
