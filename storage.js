function getLS(k){return JSON.parse(localStorage.getItem(k)||'null');}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}
function idGen(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}

function initializeData(){
  // Clear any existing prestored products and start fresh
  setLS('products',[]);
  if(!getLS('users')){
    setLS('users',[
      {id:'admin',name:'Admin',email:'admin@mangomart.com',password:'admin123',role:'admin'},
      {id:'cust',name:'Customer',email:'customer@example.com',password:'customer123',role:'customer'},
      {id:'delv',name:'Delivery Agent',email:'delivery@mangomart.com',password:'delivery123',role:'delivery'}
    ]);
  }
  if(!getLS('orders'))setLS('orders',[]);
  if(!getLS('deliveryAgents'))setLS('deliveryAgents',[{id:'delv',name:'Delivery Agent',email:'delivery@mangomart.com',status:'active'}]);
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
function saveHomepageCards(v){setLS('homepageCards',v);} 
