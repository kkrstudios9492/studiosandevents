// In-memory cache backed by Supabase KV; no localStorage writes
window.__cache = window.__cache || {};
function getLS(k){
  try{
    var raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }catch(_){
    return (window.__cache.hasOwnProperty(k) ? window.__cache[k] : null);
  }
}
function setLS(k,v){
  try{
    if (v===null || typeof v === 'undefined') { localStorage.removeItem(k); }
    else { localStorage.setItem(k, JSON.stringify(v)); }
  }catch(_){
    window.__cache[k]=v;
  }
}
function idGen(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);} 

// MangoMart-prefixed ID generator
function mmId(kind){
  try{
    var map = { order:'ORD', user:'USR', product:'PRD', agent:'AGT', card:'CARD', cart:'CART', generic:'ID' };
    var code = (map[kind]||map.generic).toUpperCase();
    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()+1).toString().padStart(2,'0');
    var dd = d.getDate().toString().padStart(2,'0');
    var date = yyyy+mm+dd;
    var rnd = Math.random().toString(36).slice(2,6).toUpperCase();
    var ms = d.getTime().toString(36).slice(-3).toUpperCase();
    return 'MM-'+code+'-'+date+'-'+rnd+ms;
  }catch(_){
    return 'MM-ID-'+Math.random().toString(36).slice(2,10).toUpperCase();
  }
}

async function initializeData(){
  const sb = window.__sb;
  if (sb){
    try{ const users = await sb.sbGetAll('users'); if (users && users.length){ window.__cache['users']=users; } }catch(_){ }
    try{ const prods = await sb.sbGetAll('products'); if (prods && prods.length){ window.__cache['products']=prods.map(p=>({ id:p.id, name:p.name, description:p.description, price:Number(p.price)||0, originalPrice:p.original_price!=null?Number(p.original_price):undefined, stock:p.stock, stockStatus:p.stock_status, category:p.category, image:p.image, homepageCardId:p.homepage_card_id })); } }catch(_){ }
    try{ const agents = await sb.sbGetAll('delivery_agents'); if (agents && agents.length){ window.__cache['deliveryAgents']=agents; } }catch(_){ }
    try{ const cards = await sb.sbGetAll('homepage_cards'); if (cards && cards.length){ window.__cache['homepageCards']=cards.map(c=>({ id:c.id, title:c.title, description:c.description, category:c.category, image:c.image })); } }catch(_){ }
  }
  if(!getLS('users')){
    setLS('users',[]);
  }
  if(!getLS('products')) setLS('products',[
    {id:'prod_test1',name:'Test Apples',description:'Fresh test apples',price:199,originalPrice:249,stock:50,stockStatus:'in',category:'Fruits',image:'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200',homepageCardId:'hc1'},
    {id:'prod_test2',name:'Test Bananas',description:'Sweet test bananas',price:99,originalPrice:120,stock:100,stockStatus:'in',category:'Fruits',image:'https://images.unsplash.com/photo-1571772805064-207c8435df79?w=1200',homepageCardId:'hc1'},
    {id:'prod_test3',name:'Test Milk',description:'Fresh test milk',price:75,originalPrice:90,stock:30,stockStatus:'in',category:'Dairy',image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200',homepageCardId:'hc2'},
    {id:'prod_test4',name:'Test Bread',description:'Soft test bread',price:55,originalPrice:65,stock:25,stockStatus:'in',category:'Bakery',image:'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200',homepageCardId:'hc2'}
  ]);
  if(!getLS('orders'))setLS('orders',[]);
  if(!getLS('deliveryAgents'))setLS('deliveryAgents',[]);
  if(!getLS('agentLocations'))setLS('agentLocations',{});
  if(!getLS('notifications'))setLS('notifications',{});
  if(!getLS('searchLogs'))setLS('searchLogs',[]);
  if(!getLS('homepageCards'))setLS('homepageCards',[
    {id:'hc1',title:'Fruits & Vegetables',description:'Farm-fresh picks daily',category:'Fruits',image:'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop'},
    {id:'hc2',title:'Groceries',description:'Foods, snacks, and beverages',category:'Beverages',image:'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1600&auto=format&fit=crop'},
    {id:'hc3',title:'Stationery & Cleaning',description:'Home and office essentials',category:'Others',image:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1600&auto=format&fit=crop'}
  ]);
}
initializeData();

function getAgentLocations(){return getLS('agentLocations')||{};}
function saveAgentLocations(v){setLS('agentLocations',v);} 
function getNotifications(){return getLS('notifications')||{};}
function saveNotifications(v){setLS('notifications',v);} 
 
function getSearchLogs(){return getLS('searchLogs')||[];}
function saveSearchLogs(v){setLS('searchLogs',v);} 
function getHomepageCards(){return getLS('homepageCards')||[];}
function saveHomepageCards(v){setLS('homepageCards',v); try{ window.__sb && window.__sb.sbUpsertMany && window.__sb.sbUpsertMany('homepage_cards', v.map(c=>({ id:c.id, title:c.title, description:c.description, category:c.category, image:c.image })) ); }catch(_){}} 
