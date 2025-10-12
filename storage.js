function getLS(k){return JSON.parse(localStorage.getItem(k)||'null');}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}
function idGen(){
  // Generate a proper UUID v4 format
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function initializeData(){
  try {
    // Clear existing data to ensure UUID format is used
    localStorage.clear();
    
    // Clear any existing prestored products and start fresh
    setLS('products',[]);
    if(!getLS('users')){
      setLS('users',[
        {id:'550e8400-e29b-41d4-a716-446655440000',name:'Admin',email:'admin@mangomart.com',password:'admin123',role:'admin'},
        {id:'550e8400-e29b-41d4-a716-446655440001',name:'Customer',email:'customer@example.com',password:'customer123',role:'customer'},
        {id:'550e8400-e29b-41d4-a716-446655440002',name:'Delivery Agent',email:'delivery@mangomart.com',password:'delivery123',role:'delivery'}
      ]);
    }
    if(!getLS('orders'))setLS('orders',[]);
    if(!getLS('deliveryAgents'))setLS('deliveryAgents',[{id:'550e8400-e29b-41d4-a716-446655440002',name:'Delivery Agent',email:'delivery@mangomart.com',status:'active'}]);
    if(!getLS('agentLocations'))setLS('agentLocations',{});
    if(!getLS('notifications'))setLS('notifications',{});
    
    if(!getLS('searchLogs'))setLS('searchLogs',[]);
    if(!getLS('homepageCards'))setLS('homepageCards',[
      {id:'550e8400-e29b-41d4-a716-446655440010',title:'Fruits & Vegetables',description:'Farm-fresh picks daily',category:'Fruits',image:'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop'},
      {id:'550e8400-e29b-41d4-a716-446655440011',title:'Groceries',description:'Foods, snacks, and beverages',category:'Beverages',image:'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1600&auto=format&fit=crop'},
      {id:'550e8400-e29b-41d4-a716-446655440012',title:'Stationery & Cleaning',description:'Home and office essentials',category:'Others',image:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1600&auto=format&fit=crop'}
    ]);
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

function getAgentLocations(){return getLS('agentLocations')||{};}
function saveAgentLocations(v){setLS('agentLocations',v);} 
function getNotifications(){return getLS('notifications')||{};}
function saveNotifications(v){setLS('notifications',v);} 
 
function getSearchLogs(){return getLS('searchLogs')||[];}
function saveSearchLogs(v){setLS('searchLogs',v);} 
function getHomepageCards(){return getLS('homepageCards')||[];}
function saveHomepageCards(v){setLS('homepageCards',v);} 
