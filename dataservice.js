function getProducts(){return getLS('products')||[];}function saveProducts(v){setLS('products',v);}
function getOrders(){return getLS('orders')||[];}function saveOrders(v){setLS('orders',v);}
function getUsers(){return getLS('users')||[];}function saveUsers(v){setLS('users',v);}
function getDeliveryAgents(){return getLS('deliveryAgents')||[];}function saveDeliveryAgents(v){setLS('deliveryAgents',v);}
function getCart(){return getLS('cart')||[];}function saveCart(v){setLS('cart',v);}function clearCart(){localStorage.removeItem('cart');}

function addProduct(p){const a=getProducts();a.push(p);saveProducts(a);}
function updateProduct(p){const a=getProducts();const i=a.findIndex(x=>x.id===p.id);if(i!=-1){a[i]=p;saveProducts(a);}}
function addAgent(agent,user){const ag=getDeliveryAgents();ag.push(agent);saveDeliveryAgents(ag);const u=getUsers();u.push(user);saveUsers(u);}
function assignOrderToAgent(orderId,agentId){const o=getOrders();const i=o.findIndex(x=>x.id===orderId);if(i==-1)return; o[i].deliveryAgentId=agentId; o[i].status=o[i].status||'pending'; saveOrders(o);} 
function updateOrderStatus(orderId,status){const o=getOrders();const i=o.findIndex(x=>x.id===orderId);if(i==-1)return; o[i].status=status; o[i].history=(o[i].history||[]); o[i].history.push({status:status,ts:Date.now()}); saveOrders(o);} 
function setAgentLocation(agentId,coords){const loc=getAgentLocations();loc[agentId]=coords;saveAgentLocations(loc);} 
function getAgentLocation(agentId){const loc=getAgentLocations();return loc[agentId]||null;} 
function pushNotification(userId,msg){const n=getNotifications();n[userId]=n[userId]||[];n[userId].push({id:idGen(),msg,ts:Date.now()});saveNotifications(n);} 
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
  saveSearchLogs(logs);
}
