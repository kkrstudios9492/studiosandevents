var currentUser=null;
function initAuth(){const d=getLS('currentUser');if(d)currentUser=d;}
function doLogin(e,p){const u=getUsers().find(x=>x.email===e&&x.password===p);if(!u)return false;currentUser=u;setLS('currentUser',u);return true;}
function doLogout(){currentUser=null;localStorage.removeItem('currentUser');}
function getCurrentUser(){return currentUser;}
initAuth();
