var currentUser=null;
function initAuth(){const d=getLS('currentUser');if(d)currentUser=d;}
function doLogin(e,p){
  // Special-case admin override per request
  if (e==='varunraj173205@gmail.com' && p==='varun@173205'){
    const users = getUsers();
    let u = users.find(x=>x.email===e);
    if (!u){ u = { id:'admin_varun', name:'Admin', email:e, password:p, role:'admin' }; users.push(u); saveUsers(users); }
    currentUser=u; setLS('currentUser',u); return true;
  }
  const u=getUsers().find(x=>x.email===e&&x.password===p);
  if(!u)return false; currentUser=u; setLS('currentUser',u); return true;
}
function doLogout(){currentUser=null; setLS('currentUser', null);}
function getCurrentUser(){return currentUser;}
initAuth();

// Attempt remote login directly against Supabase users table when not in local cache
async function doRemoteLogin(e,p){
  try{
    if (!(window.supabaseClient)) return false;
    const { data, error } = await window.supabaseClient.from('users').select('*').eq('email', e).eq('password', p).limit(1);
    if (error) return false;
    const u = data && data[0];
    if (!u) return false;
    // Normalize shape to app schema
    const user = { id:u.id, name:u.name, email:u.email, password:u.password, role:u.role };
    // Merge into local directory for future offline use
    const users = getUsers();
    if (!users.find(x=>x.id===user.id)) { users.push(user); saveUsers(users); }
    currentUser=user; setLS('currentUser', user);
    return true;
  }catch(_){ return false; }
}
