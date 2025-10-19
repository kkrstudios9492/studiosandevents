class MangoMartApp {
  constructor() {
      window.app = this;
      const init = initializeData();
      if (init && typeof init.then==='function') {
        init.then(()=>{ 
          initAuth(); 
          this.start(); 
        });
      } else {
        initAuth(); 
        this.start();
      }
    }
  
    start() {
      document.getElementById("loading").style.display = "none";
      this.bindEvents();
      this.initMobileGestures();
      this.route();
      const fy = document.getElementById('footer-year'); if (fy) fy.textContent = new Date().getFullYear();
    }
  
    bindEvents() {
      document.getElementById("login-form")?.addEventListener("submit", (e) => this.login(e));
      document.getElementById("register-form")?.addEventListener("submit", (e) => this.register(e));
      const showReg = document.getElementById('show-register');
      const showLog = document.getElementById('show-login');
      if (showReg && !showReg._bound){ showReg._bound=true; showReg.addEventListener('click',(e)=>{ e.preventDefault(); this.toggleAuthMode('register'); }); }
      if (showLog && !showLog._bound){ showLog._bound=true; showLog.addEventListener('click',(e)=>{ e.preventDefault(); this.toggleAuthMode('login'); }); }
      ["logout-btn", "admin-logout-btn", "delivery-logout-btn"].forEach((id) =>
        document.getElementById(id)?.addEventListener("click", () => this.logout())
      );
      document.getElementById("hamburger-btn")?.addEventListener("click", () => this.toggleHamburgerMenu());
      document.addEventListener("click", (e) => {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        if (hamburgerMenu && !hamburgerMenu.contains(e.target)) {
          this.closeHamburgerMenu();
        }
      });
      document.getElementById("add-product-btn")?.addEventListener("click", () => this.openProductModal());
      document.getElementById("add-agent-btn")?.addEventListener("click", () => this.openAgentModal());
      document.getElementById("cart-icon")?.addEventListener("click", () => this.switchTab("cart"));
      document.getElementById("checkout-btn")?.addEventListener("click", () => this.checkout());
      
      // Delivery dashboard filter buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.filterDeliveryOrders(e.target.dataset.filter));
      });
      
      // Map control buttons
      document.getElementById('center-map-btn')?.addEventListener('click', () => this.centerDeliveryMap());
      document.getElementById('refresh-location-btn')?.addEventListener('click', () => this.refreshDeliveryLocation());
      document.querySelectorAll(".tab-button").forEach((b) =>
        b.addEventListener("click", () => this.switchTab(b.dataset.tab))
      );
      document.getElementById('search-btn')?.addEventListener('click',()=>this.renderProducts());
      document.getElementById('search-input')?.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); this.renderProducts(); }});
      document.getElementById('global-search-input')?.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); const v=document.getElementById('global-search-input')?.value||''; this.switchTab('products'); this.renderProducts(); logSearchTerm(v); const as=document.getElementById('autosuggest-list'); if(as) as.style.display='none'; }});
      document.getElementById('global-search-input')?.addEventListener('input',()=>{ this.switchTab('products'); this.renderProducts(); });
      const gsi = document.getElementById('global-search-input');
      if (gsi) {
        gsi.addEventListener('input', ()=> { this.updateAutosuggest(); });
        gsi.addEventListener('focus', ()=> { this.updateAutosuggest(); });
      }
      // search clear button removed
      // banner CTA removed per request
      // shop now buttons
      document.getElementById('products-tab')?.addEventListener('click',(e)=>{
        const t = e.target;
        if (t && t.matches && t.matches("button[data-action='shop-now']")) {
          const cat = t.getAttribute('data-category')||'';
          const cardId = t.getAttribute('data-card-id')||'';
          if (cardId) this.openHomepageCard(cardId); else this.openCategory(cat);
        }
      });
      // admin edit homepage cards
      document.getElementById('admin-products-tab')?.addEventListener('click',(e)=>{
        const t = e.target;
        if (t && t.matches && t.matches("button[data-action='edit-homepage']")) {
          this.openHomepageEditor();
        }
      });
      // previous orders filters
      document.getElementById('prev-filter-range')?.addEventListener('change', ()=> this.renderCustomerOrders());
      document.getElementById('prev-filter-rating')?.addEventListener('change', ()=> this.renderCustomerOrders());
      // back buttons
      document.getElementById('back-from-orders')?.addEventListener('click', () => this.switchTab('products'));
      document.getElementById('back-from-cart')?.addEventListener('click', () => this.switchTab('products'));
      // logo home button
      document.getElementById('logo-home')?.addEventListener('click', () => this.goToHome());
    }
  
    route() {
      const u = getCurrentUser();
      if (!u) return this.show("login-page");
      const page =
        u.role === "admin"
          ? "admin-dashboard"
          : u.role === "delivery"
          ? "delivery-dashboard"
          : "customer-dashboard";
      this.show(page);
      this.loadDashboard(u.role);
    }
  
    show(id) {
      document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
      document.getElementById(id).style.display = "block";
    }
  
    login(e) {
      e.preventDefault();
      const emailVal = email.value.trim();
      const passVal = password.value.trim();
      const fail = ()=>{ const el=document.getElementById("login-error"); if(el) el.style.display = "block"; };
      try{
        let ok = false;
        if (typeof doLogin==='function') ok = doLogin(emailVal, passVal);
        const tryRemote = async ()=>{ if (typeof doRemoteLogin==='function') { try{ return await doRemoteLogin(emailVal, passVal); }catch(_){ return false; } } return false; };
        const proceed = async ()=>{
          if (!ok) ok = await tryRemote();
          if (!ok) return fail();
          this.route();
          this.loadCartFromSupabase();
          this.loadOrdersFromSupabase();
        };
        Promise.resolve(proceed());
      }catch(_){ fail(); }
    }

    async loadCartFromSupabase(){
      try{
        if (!window.__sb || !window.supabaseClient) return;
        const u = getCurrentUser(); if (!u) return;
        const cartId = `cart_${u.id}`;
        const { data: carts } = await window.supabaseClient.from('carts').select('id').eq('user_id', u.id).limit(1);
        const cid = (carts && carts[0] && carts[0].id) || cartId;
        const { data: items } = await window.supabaseClient.from('cart_items').select('*').eq('cart_id', cid);
        const mapped = (items||[]).map(it=>({ productId: it.product_id, productName: it.product_name, price: Number(it.price)||0, quantity: it.quantity }));
        saveCart(mapped);
        this.updateCartCount();
      }catch(_){ }
    }

    async loadOrdersFromSupabase(){
      try{
        if (!window.__sb || !window.supabaseClient) return;
        const u = getCurrentUser(); if (!u) return;
        let q = window.supabaseClient.from('orders').select('*');
        if (u.role==='customer') q = q.eq('customer_id', u.id);
        if (u.role==='delivery') q = q.or(`delivery_agent_id.eq.${u.id},status.eq.pending`);
        const { data: ord } = await q;
        const ids = (ord||[]).map(o=>o.id);
        let items = [];
        if (ids.length){ const { data } = await window.supabaseClient.from('order_items').select('*').in('order_id', ids); items = data||[]; }
        const grouped = items.reduce((m,it)=>{ (m[it.order_id]=m[it.order_id]||[]).push(it); return m; },{});
        const mapped = (ord||[]).map(o=>({
          id: o.id,
          customerId: o.customer_id,
          customerName: '',
          items: (grouped[o.id]||[]).map(it=>({ productId: it.product_id, productName: it.product_name, price: Number(it.price)||0, quantity: it.quantity })),
          total: Number(o.total)||0,
          status: o.status,
          date: o.date,
          dropoff: o.dropoff||null,
          contact: o.contact||null,
          payment: o.payment||null,
          deliveryAgentId: o.delivery_agent_id||null
        }));
        
        // Merge with existing orders instead of overwriting
        const existingOrders = getOrders();
        const existingIds = new Set(existingOrders.map(o => o.id));
        const newOrders = mapped.filter(o => !existingIds.has(o.id));
        const mergedOrders = [...existingOrders, ...newOrders];
        saveOrders(mergedOrders);
        
        if (u.role==='customer') { this.renderCustomerOrders(); }
        if (u.role==='delivery') { this.renderDelivery(); }
        if (u.role==='admin') { this.renderAdmin(); }
      }catch(_){ }
    }

    register(e){
      e.preventDefault();
      const name = (document.getElementById('reg_name')?.value||'').trim();
      const emailVal = (document.getElementById('reg_email')?.value||'').trim();
      const passVal = (document.getElementById('reg_password')?.value||'').trim();
      const err = document.getElementById('register-error');
      if (!name || !emailVal || !passVal){ if(err){ err.textContent='Fill all fields'; err.style.display='block'; } return; }
      // Email uniqueness check
      const users = getUsers();
      if (users.some(u=>u.email===emailVal)) { if(err){ err.textContent='Email already registered'; err.style.display='block'; } return; }
      // Default role is customer; delivery users are added by admin in Admin panel
      const newUser = { id: idGen(), name, email: emailVal, password: passVal, role: 'customer' };
      users.push(newUser); saveUsers(users);
      // Explicitly upsert to Supabase normalized table to ensure persistence
      try { if (window.__sb && window.__sb.sbUpsertMany) { window.__sb.sbUpsertMany('users', [newUser]); } } catch(_) {}
      // Auto-login after registration
      doLogin(emailVal, passVal);
      this.route();
    }

    toggleAuthMode(mode){
      const lf = document.getElementById('login-form');
      const rf = document.getElementById('register-form');
      const tt = document.getElementById('auth-title');
      const lt = document.getElementById('login-text');
      if (mode==='register'){
        if (lf) lf.style.display='none';
        if (rf) rf.style.display='block';
        if (tt) tt.textContent='Create your account';
      } else {
        if (lf) lf.style.display='block';
        if (rf) rf.style.display='none';
        if (tt) tt.textContent='Sign in to continue';
        if (lt) lt.textContent='Login';
      }
      const le = document.getElementById('login-error'); if (le) le.style.display='none';
      const re = document.getElementById('register-error'); if (re) re.style.display='none';
    }
  
    logout() {
      doLogout();
      clearCart();
      this.show("login-page");
    }

    toggleHamburgerMenu() {
      const hamburgerBtn = document.getElementById("hamburger-btn");
      const hamburgerDropdown = document.getElementById("hamburger-dropdown");
      
      if (hamburgerBtn && hamburgerDropdown) {
        hamburgerBtn.classList.toggle("active");
        hamburgerDropdown.classList.toggle("show");
      }
    }

    closeHamburgerMenu() {
      const hamburgerBtn = document.getElementById("hamburger-btn");
      const hamburgerDropdown = document.getElementById("hamburger-dropdown");
      
      if (hamburgerBtn && hamburgerDropdown) {
        hamburgerBtn.classList.remove("active");
        hamburgerDropdown.classList.remove("show");
      }
    }

    initMobileGestures() {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let isDragging = false;

      // Touch start
      document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
      }, { passive: true });

      // Touch move
      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        // Check if it's a horizontal swipe (more horizontal than vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          // Swipe right to close menu
          if (deltaX > 0) {
            this.closeHamburgerMenu();
            isDragging = false;
          }
        }
      }, { passive: true });

      // Touch end
      document.addEventListener('touchend', () => {
        isDragging = false;
      }, { passive: true });

      // Add tap outside to close on mobile
      document.addEventListener('touchstart', (e) => {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        const hamburgerDropdown = document.getElementById("hamburger-dropdown");
        
        if (hamburgerDropdown && hamburgerDropdown.classList.contains("show")) {
          if (hamburgerMenu && !hamburgerMenu.contains(e.target)) {
            this.closeHamburgerMenu();
          }
        }
      }, { passive: true });
    }
  
    loadDashboard(role) {
      if (role === "customer") {
        // Pull latest data from Supabase before rendering
        Promise.resolve((async()=>{
          try{ await refreshHomepageCardsFromSupabase(); }catch(_){ }
          try{ await refreshProductsFromSupabase(); }catch(_){ }
          try{ await this.loadOrdersFromSupabase(); }catch(_){ }
          try{ await syncOrdersToSupabase(); }catch(_){ }
        })()).finally(()=>{
          this.renderHomepageCards();
          this.updateCustomerProductsVisibility(false);
          this.updateCartCount();
        });
      } else if (role === "admin") {
        Promise.resolve((async()=>{
          try{ await refreshProductsFromSupabase(); }catch(_){ }
          try{ await refreshHomepageCardsFromSupabase(); }catch(_){ }
          try{ await refreshAgentsFromSupabase(); }catch(_){ }
          try{ await this.loadOrdersFromSupabase(); }catch(_){ }
          try{ await syncOrdersToSupabase(); }catch(_){ }
        })()).finally(()=>{
          this.updateAdminStats();
          this.renderAdmin();
        });
      } else if (role === "delivery") {
        Promise.resolve((async()=>{
          try{ await refreshAgentsFromSupabase(); }catch(_){ }
          try{ await this.loadOrdersFromSupabase(); }catch(_){ }
          try{ await syncOrdersToSupabase(); }catch(_){ }
        })()).finally(()=>{
          this.renderDelivery();
        });
        this.initDeliveryMap();
        this.startAgentGeolocation();
      }
    }
  
    // 🛍 CUSTOMER SIDE
    renderProducts() {
      const grid = document.getElementById("products-grid");
      if (!grid) return;
      const cart = getCart();
      const productsAll = getProducts();
      console.log('Products loaded:', productsAll.length, productsAll.map(p => ({name: p.name, price: p.price, originalPrice: p.originalPrice})));
      const qRaw = (document.getElementById('search-input')?.value||document.getElementById('global-search-input')?.value)||'';
      const q = qRaw.toLowerCase();
      const cat = (this.activeCategory || '');
      const activeCardId = this.activeHomepageCardId || '';
      // When searching, show results inside the card-view interface
      if (q && q.trim()) {
        this.updateCustomerProductsVisibility(true);
        const titleEl = document.querySelector('#card-view-header .card-view-title');
        if (titleEl) titleEl.textContent = `Search results: ${qRaw.trim()}`;
        // clear-search header button removed
      } else if (!cat && !activeCardId) {
        // No search and no active card/category -> show category cards
        this.updateCustomerProductsVisibility(false);
        // clear-search header button removed
      }
      const products = productsAll.filter(p=>{
        const byQ = !q || p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
        if (q) return byQ; // when searching, ignore category/card constraints
        const byCat = !cat || p.category===cat;
        const byCard = !activeCardId || p.homepageCardId===activeCardId;
        return byCat && byCard && byQ;
      });
      // hide autosuggest on explicit render
      const as = document.getElementById('autosuggest-list'); if (as) as.style.display='none';
  
      // Only show "No products found" message if there's an active search or category
      const shouldShowNoProductsMessage = (q && q.trim()) || cat || activeCardId;
      
      grid.innerHTML = products.length
        ? products
            .map((p) => {
              const item = cart.find((c) => c.productId === p.id);
              const qty = item ? item.quantity : 0;

              if (p.stockStatus === "out") {
                return `
                <div class="product-card">
                  <img src="${p.image}" class="product-image" alt="${p.name}">
                  <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="product-price">${p.originalPrice?`<div class="product-price-container"><div class="product-price-current">₹${p.price}</div><div class="product-price-original">₹${p.originalPrice}</div></div>`:`<div class="product-price-current">₹${p.price}</div>`}</div>
                    <div class="out-of-stock">Out of Stock</div>
                  </div>
                </div>`;
              }

              const controls =
                qty > 0
                  ? `<div class=\"qty-controls\">
                      <button aria-label=\"Decrease\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty - 1})\">-</button>
                      <div class=\"qty\">${qty}</div>
                      <button aria-label=\"Increase\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty + 1})\">+</button>
                    </div>`
                  : `<button class=\"btn btn-primary\" onclick=\"event.stopPropagation(); app.addToCart('${p.id}')\">Add to Cart</button>`;

              return `
                <div class=\"product-card\" onclick=\"app.openProductDetail('${p.id}')\">
                  <img src=\"${p.image}\" class=\"product-image\" alt=\"${p.name}\">
                  <div class=\"product-info\">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="product-price">${p.originalPrice?`<div class="product-price-container"><div class="product-price-current">₹${p.price}</div><div class="product-price-original">₹${p.originalPrice}</div></div>`:`<div class="product-price-current">₹${p.price}</div>`}</div>
                    ${controls}
                  </div>
                </div>`;
            })
            .join("")
        : shouldShowNoProductsMessage 
          ? `<div class=\"cart-item\" style=\"display:block\"><div><strong>No products found</strong>${qRaw?` for "${qRaw.trim()}"`:''}</div><div class=\"muted\" style=\"margin-top:.25rem\">Try a different keyword.</div></div>`
          : '';
      
    }

    renderHomepageCards(){
      const cont = document.querySelector('.category-cards');
      if (!cont) return;
      const cards = getHomepageCards();
      cont.innerHTML = cards.map(c=>`
          <div class="category-card" data-category="${c.category}">
            <div class="category-media" style="background-image:url('${c.image}')"></div>
            <div class="category-info">
              <h3>${c.title}</h3>
              <p>${c.description||''}</p>
              <button class="btn btn-primary" data-action="shop-now" data-category="${c.category}" data-card-id="${c.id}">Shop Now</button>
            </div>
          </div>
      `).join('');
    }

    openCategory(cat){
      this.activeCategory = cat;
      this.activeHomepageCardId = '';
      this.switchTab('products');
      this.updateCustomerProductsVisibility(true);
      this.renderProducts();
      // optionally scroll to grid
      const grid = document.getElementById('products-grid');
      if (grid && grid.scrollIntoView) grid.scrollIntoView({behavior:'smooth'});
    }

    openHomepageCard(cardId){
      this.activeHomepageCardId = cardId;
      // do not constrain by category; show all products assigned to this card
      const card = (getHomepageCards()||[]).find(c=>c.id===cardId);
      this.activeCategory = '';
      this.switchTab('products');
      const titleEl = document.querySelector('#card-view-header .card-view-title');
      if (titleEl) titleEl.textContent = card ? card.title : '';
      this.updateCustomerProductsVisibility(true);
      this.renderProducts();
      const grid = document.getElementById('products-grid');
      if (grid && grid.scrollIntoView) grid.scrollIntoView({behavior:'smooth'});
    }

    updateCustomerProductsVisibility(show){
      const hdr = document.getElementById('card-view-header');
      const controls = document.getElementById('products-controls');
      const grid = document.getElementById('products-grid');
      const detail = document.getElementById('product-detail');
      const cats = document.querySelector('.category-cards');
      const tabs = document.querySelector('.tabs');
      const logoutBtn = document.getElementById('logout-btn');
      if (show){
        if (hdr) hdr.style.display='flex';
        if (controls) controls.style.display='none';
        if (grid) grid.style.display='grid';
        if (detail) detail.style.display='none';
        if (cats) cats.style.display='none';
        if (tabs) tabs.style.display='none';
        if (logoutBtn) logoutBtn.style.display='none';
      } else {
        if (hdr) hdr.style.display='none';
        if (controls) controls.style.display='none';
        if (grid) grid.style.display='none';
        if (detail) detail.style.display='none';
        if (cats) cats.style.display='grid';
        if (tabs) tabs.style.display='flex';
        if (logoutBtn) logoutBtn.style.display='';
      }
      const back = document.getElementById('back-to-cards');
      if (back && !back._bound){ back._bound=true; back.addEventListener('click', ()=>{ this.activeHomepageCardId=''; this.activeCategory=''; const si=document.getElementById('search-input'); if(si) si.value=''; const gsi=document.getElementById('global-search-input'); if(gsi) gsi.value=''; this.updateCustomerProductsVisibility(false); this.renderProducts(); }); }
      const clr = document.getElementById('clear-search-btn');
      if (clr && !clr._bound){ clr._bound=true; clr.addEventListener('click', ()=>{ const si=document.getElementById('search-input'); if(si) si.value=''; const gsi=document.getElementById('global-search-input'); if(gsi) gsi.value=''; this.activeHomepageCardId=''; this.activeCategory=''; this.updateCustomerProductsVisibility(false); this.renderProducts(); }); }
    }

    openProductDetail(productId){
      const p = getProducts().find(x=>x.id===productId); if(!p) return;
      const grid = document.getElementById('products-grid'); if (grid) grid.style.display='none';
      const detail = document.getElementById('product-detail'); if (!detail) return;
      const cartNow = (getCart()||[]);
      const item = cartNow.find(c=>c.productId===p.id);
      const qty = item ? item.quantity : 0;
      // related products: same homepage card excluding current, top 4
      // fallback to same category if no products with same homepage card
      let related = getProducts().filter(x=> x.id!==p.id && x.homepageCardId===p.homepageCardId).slice(0,4);
      if (related.length === 0) {
        related = getProducts().filter(x=> x.id!==p.id && x.category===p.category).slice(0,4);
      }
      const controls = qty>0
        ? `<div class=\"qty-controls\"><button aria-label=\"Decrease\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty - 1}); app.refreshDetailIfOpen('${p.id}')\">-</button><div class=\"qty\">${qty}</div><button aria-label=\"Increase\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty + 1}); app.refreshDetailIfOpen('${p.id}')\">+</button></div>`
        : `<button class=\"btn btn-primary\" onclick=\"event.stopPropagation(); app.addToCart('${p.id}'); app.refreshDetailIfOpen('${p.id}')\">Add to Cart</button>`;
      const titleEl = document.querySelector('#card-view-header .card-view-title'); if (titleEl) titleEl.textContent = p.name;
      this.updateCustomerProductsVisibility(true);
      detail.innerHTML = `
        <div class="product-detail-header">
          <button class="back-button" onclick="app.closeProductDetail()"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
        <div class="product-detail-layout">
          <div class="product-gallery">
            <img src="${p.image}" alt="${p.name}" class="product-hero" />
          </div>
          <div class="product-summary">
            <h2 class="product-title">${p.name}</h2>
            <div class="product-meta-row">
              <div class="product-price-lg">${p.originalPrice?`<div class="product-price-container"><div class="product-price-current">₹${p.price}</div><div class="product-price-original">₹${p.originalPrice}</div></div>`:`<div class="product-price-current">₹${p.price}</div>`}</div>
              <span class="badge ${p.stockStatus!=='out'?'in-stock':'out-stock'}">${p.stockStatus!=='out'?'In Stock':'Out of Stock'}</span>
            </div>
            <div class="product-desc">${p.description}</div>
            <div class="product-cta">${controls}</div>
          </div>
        </div>
        ${related.length?`<div class="related"><h4>Related products</h4><div class="related-grid">${related.map(r=>{
          const relItem = cartNow.find(c=>c.productId===r.id);
          const relQty = relItem ? relItem.quantity : 0;
          const relControls = relQty>0
            ? `<div class=\"qty-controls\"><button aria-label=\"Decrease\" onclick=\"event.stopPropagation(); app.changeQty('${r.id}', ${relQty - 1}); app.refreshDetailIfOpen('${r.id}')\">-</button><div class=\"qty\">${relQty}</div><button aria-label=\"Increase\" onclick=\"event.stopPropagation(); app.changeQty('${r.id}', ${relQty + 1}); app.refreshDetailIfOpen('${r.id}')\">+</button></div>`
            : `<button class=\"btn btn-primary\" onclick=\"event.stopPropagation(); app.addToCart('${r.id}'); app.refreshDetailIfOpen('${r.id}')\">Add to Cart</button>`;
          return `<div class=\"related-card\" onclick=\"app.openProductDetail('${r.id}')\"><img src='${r.image}' alt='${r.name}'/><div class=\"info\"><div style=\"font-weight:600\">${r.name}</div><div class=\"price\">₹${r.price}</div><div style=\"margin-top:.25rem\">${relControls}</div></div></div>`;
        }).join('')}</div></div>`:''}
      `;
      detail.style.display='block';
    }
    closeProductDetail(){
      const detail = document.getElementById('product-detail'); if (detail) detail.style.display='none';
      const grid = document.getElementById('products-grid'); if (grid) grid.style.display='grid';
    }
    refreshDetailIfOpen(id){
      const detail = document.getElementById('product-detail');
      if (detail && detail.style.display!== 'none'){
        // re-open the same product to refresh qty controls
        const titleEl = document.querySelector('#card-view-header .card-view-title');
        const name = titleEl && titleEl.textContent ? titleEl.textContent : '';
        const p = getProducts().find(x=>x.id===id);
        if (p){ this.openProductDetail(id); }
      }
      this.updateCartCount();
    }

    updateAutosuggest(){
      const box = document.getElementById('autosuggest-list');
      const input = document.getElementById('global-search-input');
      if (!box || !input) return;
      const q = input.value.trim().toLowerCase();
      if (!q) { box.style.display='none'; box.innerHTML=''; return; }
      const products = getProducts().filter(p=> p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)).slice(0,8);
      if (!products.length) { box.style.display='none'; box.innerHTML=''; return; }
      box.innerHTML = products.map(p=>`<div class="autosuggest-item" onclick="app.selectAutosuggest('${p.id}')">${p.image?`<img src='${p.image}' alt='${p.name}'>`:''}<div>${p.name}</div></div>`).join('');
      box.style.display='block';
    }
    selectAutosuggest(productId){
      const p = getProducts().find(x=>x.id===productId); if(!p) return;
      const inEl=document.getElementById('search-input'); if(inEl){ inEl.value=p.name; }
      const gin=document.getElementById('global-search-input'); if(gin){ gin.value=p.name; }
      this.switchTab('products');
      this.renderProducts();
      const as = document.getElementById('autosuggest-list'); if (as) as.style.display='none';
    }
  
    addToCart(id) {
      const p = getProducts().find((x) => x.id === id);
      if (!p || p.stockStatus === "out") return alert("This product is out of stock!");
      const c = getCart();
      const i = c.find((x) => x.productId === id);
      if (i) i.quantity++;
      else c.push({ productId: id, productName: p.name, price: p.price, quantity: 1 });
      saveCart(c);
      this.renderProducts();
      this.updateCartCount();
      this.showCartNotification();
    }
  
    changeQty(id, q) {
      let c = getCart();
      const i = c.findIndex((x) => x.productId === id);
      if (q <= 0) {
        if (i != -1) c.splice(i, 1);
      } else if (i != -1) c[i].quantity = q;
      saveCart(c);
      this.renderProducts();
      this.updateCart();
      this.updateCartCount();
    }
  
    updateCartCount() {
      const n = getCart().reduce((s, i) => s + i.quantity, 0);
      const el = document.getElementById("cart-count");
      if (el) el.textContent = n;
    }
  
    updateCart() {
      const it = document.getElementById("cart-items"),
        t = document.getElementById("cart-total"),
        c = getCart();
      if (!c.length) {
        it.innerHTML = "<p>Cart is empty</p>";
        t.innerHTML = "";
        return;
      }
      const productMap = getProducts().reduce((m,p)=>{m[p.id]=p;return m;},{});
      it.innerHTML = c
        .map((i) => {
          const p = productMap[i.productId];
          const img = p && p.image ? `<img class="thumb" src="${p.image}" alt="${p.name}">` : '';
          return `<div class="cart-item">
              <div style="display:flex;align-items:center;gap:.5rem">${img}<div>${i.productName}</div></div>
              <div class="cart-item-quantity">
                <button aria-label="Decrease" onclick="app.changeQty('${i.productId}', ${i.quantity - 1})">-</button>
                <div class="qty">${i.quantity}</div>
                <button aria-label="Increase" onclick="app.changeQty('${i.productId}', ${i.quantity + 1})">+</button>
              </div>
            </div>`;
        })
        .join("");
      const tot = c.reduce((s, i) => s + i.price * i.quantity, 0);
      t.innerHTML = `<h3>Total ₹${tot}</h3>`;
    }
  
    checkout() {
      const c = getCart();
      if (!c.length) return alert("Cart empty!");
      this.openCheckoutModal();
    }

    openCheckoutModal() {
      const o = document.getElementById("modal-overlay"),
        c = document.getElementById("modal-content");
      c.innerHTML = `
        <div class="modal-header"><h3>Enter Delivery Details</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Name</label><input id="co_name"></div>
          <div class="form-group"><label>Mobile Number</label><input id="co_mobile" type="tel" placeholder="10-digit"></div>
          <div class="form-group"><label>Alternate Mobile Number</label><input id="co_alt_mobile" type="tel" placeholder="Optional"></div>
          <div class="form-group"><label>Landmark</label><input id="co_landmark"></div>
          <div class="form-group"><label>Pincode</label><input id="co_pincode" type="text" maxlength="6"></div>
          <div class="form-group"><label>Address</label><input id="co_address" placeholder="House, Street, Area"></div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.startPayment()">Pay & Place Order</button></div>
      `;
      o.style.display = "flex";
    }

    async startPayment() {
      const name = co_name.value.trim();
      const mobile = co_mobile.value.trim();
      const altMobile = co_alt_mobile.value.trim();
      const landmark = co_landmark.value.trim();
      const pincode = co_pincode.value.trim();
      const address = co_address.value.trim();
      if (!name || !mobile || !pincode) return alert("Please fill name, mobile and pincode");
      if (!/^\d{10}$/.test(mobile)) return alert("Enter valid 10-digit mobile number");
      if (altMobile && !/^\d{10}$/.test(altMobile)) return alert("Alternate mobile must be 10 digits");
      if (!/^\d{6}$/.test(pincode)) return alert("Enter valid 6-digit pincode");

      const details = { name, mobile, altMobile, landmark, pincode, address };
      const u = getCurrentUser();
      const cartItems = getCart();
      const orders = getOrders();
      const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

      if (!window.Razorpay || !window.RAZORPAY_KEY) {
        console.warn('Razorpay not configured; proceeding without payment');
        return await this.finalizeOrder(details);
      }

      const options = {
        key: window.RAZORPAY_KEY,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Mango Mart',
        description: 'Order Payment',
        handler: async (resp)=>{
          this._lastPayment = resp;
          await this.finalizeOrder(details);
        },
        prefill: { name, contact: mobile },
        theme: { color: '#f97316' }
      };
      const rz = new Razorpay(options);
      rz.open();
    }

    async finalizeOrder(details){
      const u = getCurrentUser();
      const cartItems = getCart();

      const dropPromise = new Promise((res)=>{
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((p)=>{
            res({lat:p.coords.latitude,lng:p.coords.longitude});
          },()=>res(null),{maximumAge:60000,timeout:5000});
        } else { res(null); }
      });

      dropPromise.then(async (drop)=>{
        const order = {
        id: idGen(),
        customerId: u.id,
          customerName: details.name || u.name,
          items: cartItems,
          total: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
        status: "pending",
        date: new Date().toISOString(),
          dropoff: drop || null,
          contact: details,
          payment: this._lastPayment || null,
        };
        // Add to existing orders without duplicating
        const existingOrders = getOrders();
        const updatedOrders = [...existingOrders, order];
        saveOrders(updatedOrders);
        
        // Sync to Supabase
        try { await syncOrdersToSupabase(); } catch(e) { console.warn('Failed to sync new order to Supabase:', e); }
        
      clearCart();
      this.renderProducts();
      this.updateCartCount();
      this.updateCart();
        const c = document.getElementById("modal-content");
        c.innerHTML = `
          <div class="modal-header"><h3>Order Placed</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
          <div class="modal-body"><p>Thanks for shopping! Your order <strong>#${order.id}</strong> has been placed.</p></div>
          <div class="modal-footer"><button class="btn btn-primary" onclick="app.closeModal(); app.switchTab('orders'); app.renderCustomerOrders();">View Orders</button></div>
        `;
      });
    }
  
    renderCustomerOrders(){
      const u = getCurrentUser();
      const all = getOrders().filter(o=>o.customerId===u.id && o.items && o.items.length > 0).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const current = all.filter(o=>o.status!=='delivered');
      let previous = all.filter(o=>o.status==='delivered');
      
      // Debug: Log order counts
      console.log('Total orders for user:', all.length);
      console.log('Current orders:', current.length);
      console.log('Previous orders:', previous.length);
      // apply filters
      const range = document.getElementById('prev-filter-range')?.value || 'all';
      const rating = document.getElementById('prev-filter-rating')?.value || 'any';
      const now = new Date();
      previous = previous.filter(o=>{
        let inRange = true;
        if (range==='7d') inRange = (now - new Date(o.date)) <= 7*24*60*60*1000;
        else if (range==='30d') inRange = (now - new Date(o.date)) <= 30*24*60*60*1000;
        else if (range==='year') inRange = (new Date(o.date).getFullYear() === now.getFullYear());
        let byRating = true;
        if (rating==='rated') byRating = !!o.rating;
        else if (rating==='unrated') byRating = !o.rating;
        return inRange && byRating;
      });
      const curEl = document.getElementById('orders-current');
      const prevEl = document.getElementById('orders-previous');
      const render = (o)=>{
        const s = o.status||'pending';
        const stepIdx = s==='pending'?0:s==='picked_up'?1:s==='out_for_delivery'?2:3;
        const step = (label, idx, cls)=>`<div class="step ${cls}"><div class="dot"></div><div>${label}</div></div>`;
        const sep = '<div class="step-sep"></div>';
        const stepper = `<div class="stepper">${
          step('Pending',0, stepIdx>0?'done':stepIdx===0?'active':'')+sep+
          step('Picked Up',1, stepIdx>1?'done':stepIdx===1?'active':'')+sep+
          step('Out for Delivery',2, stepIdx>2?'done':stepIdx===2?'active':'')+sep+
          step('Delivered',3, stepIdx===3?'done':'')
        }</div>`;
        const hist = (o.history||[]).slice().sort((a,b)=>a.ts-b.ts).map(h=>`<div class="pill">${new Date(h.ts).toLocaleString()} – ${h.status.replaceAll('_',' ')}</div>`).join('');
        const actions = [
          (o.status!=='delivered') ? `<button class="btn btn-outline" onclick="app.openTracking('${o.id}')">Track</button>` : '',
          (o.status==='delivered' && !o.rating) ? `<button class="btn btn-primary" onclick="app.openRating('${o.id}')">Rate</button>` : ''
        ].filter(Boolean).join('');
        const timeline = o.status==='delivered' ? `<div class="order-timeline" style="margin-top:.5rem;display:flex;flex-direction:column;gap:.25rem">${hist}</div>` : '';
        
        // Deduplicate items by productId (sum quantities) for clean display
        const dedupMap = {};
        (o.items||[]).forEach(it=>{
          const key = it.productId;
          if (!dedupMap[key]) {
            // Keep the price captured at order time for consistent history
            dedupMap[key] = { productId: it.productId, productName: it.productName, price: Number(it.price)||0, quantity: Number(it.quantity)||0 };
          } else {
            dedupMap[key].quantity += Number(it.quantity)||0;
          }
        });
        const dedupedItems = Object.values(dedupMap);

        // Render ordered products - only if order has items
        const products = dedupedItems.length ? dedupedItems.map(item => {
          const product = getProducts().find(p => p.id === item.productId);
          if (!product) return '';
          return `<div class="order-product-item">
            <img src="${product.image}" alt="${product.name}" class="order-product-image">
            <div class="order-product-details">
              <div class="order-product-name">${product.name}</div>
              <div class="order-product-price">₹${item.price} × ${item.quantity}</div>
              <div class="order-product-total">Total: ₹${item.price * item.quantity}</div>
            </div>
          </div>`;
        }).join('') : '';

        const displayTotal = dedupedItems.reduce((sum, it)=> sum + (Number(it.price)||0) * (Number(it.quantity)||0), 0);
        
        const orderProducts = products ? `<div class="order-products">
          <h4 style="margin:0 0 0.75rem 0;color:#374151;font-size:1rem">Ordered Products:</h4>
          <div class="order-products-list">${products}</div>
        </div>` : '';
        
        return `<div class="order-card">
          <div class="order-meta">
            <div><strong>Order #${o.id}</strong> – ₹${displayTotal || o.total}</div>
            ${orderProducts}
            ${stepper}
            ${timeline}
          </div>
          <div class="order-actions">${actions}</div>
        </div>`;
      };
      curEl.innerHTML = current.length ? current.map(render).join('') : `<div class="empty-orders-state">
        <i class="fas fa-shopping-bag"></i>
        <h3>No Current Orders</h3>
        <p>You don't have any active orders at the moment.</p>
        <button class="btn btn-primary" onclick="app.switchTab('products')">Start Shopping</button>
      </div>`;
      prevEl.innerHTML = previous.length ? previous.map(render).join('') : `<div class="empty-orders-state">
        <i class="fas fa-history"></i>
        <h3>No Order History</h3>
        <p>You haven't placed any orders yet.</p>
        <button class="btn btn-primary" onclick="app.switchTab('products')">Start Shopping</button>
      </div>`;
      // ratings panel removed from orders view per request
      this.renderCustomerNotifications(u.id);
    }

    openTracking(orderId){
      const box = document.getElementById('customer-tracking');
      if (box) box.style.display='block';
      this.trackOrder(orderId);
      const btn = document.getElementById('close-tracking');
      if (btn && !btn._bound){ btn._bound=true; btn.addEventListener('click', ()=>{ 
        const el=document.getElementById('customer-tracking'); if(el) el.style.display='none'; 
        // restore orders grids and headers
        const cur=document.getElementById('orders-current'); const prev=document.getElementById('orders-previous');
        if(cur) cur.style.display=''; if(prev) prev.style.display='';
        document.querySelectorAll('#orders-tab > .section-header').forEach(h=>{ if (h && h.parentElement && h.parentElement.id!== 'customer-tracking') h.style.display=''; });
      }); }
      // hide everything except map + close in tracking view
      const cur = document.getElementById('orders-current');
      const prev = document.getElementById('orders-previous');
      if (cur) cur.style.display='none';
      if (prev) prev.style.display='none';
      // hide headers (except tracking header)
      document.querySelectorAll('#orders-tab > .section-header').forEach(h=>{ if (h && h.parentElement && h.parentElement.id!== 'customer-tracking') h.style.display='none'; });
      // hide non-map elements within tracking pane
      const metrics = document.querySelector('#customer-tracking .tracking-metrics'); if (metrics) metrics.style.display='none';
      const notes = document.getElementById('customer-notifications'); if (notes) notes.style.display='none';
      // auto-hide delivered after 5 minutes
      if (this._trackingHideInterval) clearInterval(this._trackingHideInterval);
      this._trackingHideInterval = setInterval(()=>{
        const o = getOrders().find(x=>x.id===orderId);
        if (o && o.status==='delivered'){
          if (!this._deliveredAt) this._deliveredAt = Date.now();
          if (Date.now()-this._deliveredAt > 5*60*1000){
            const el=document.getElementById('customer-tracking'); if(el) el.style.display='none'; clearInterval(this._trackingHideInterval);
            if(cur) cur.style.display=''; if(prev) prev.style.display='';
            document.querySelectorAll('#orders-tab > .section-header').forEach(h=>{ if (h && h.parentElement && h.parentElement.id!== 'customer-tracking') h.style.display=''; });
          }
        }
      }, 10000);
    }
  
    trackOrder(orderId){
      if (!(window.google && google.maps)) return;
      const mapEl = document.getElementById('customer-map');
      if (!mapEl) return;
      // initialize or reuse
      this.customerMap = new google.maps.Map(mapEl, { center: { lat: 12.9716, lng: 77.5946 }, zoom: 14, mapTypeControl:false, streetViewControl:false, fullscreenControl:false });
      const o = getOrders().find(x=>x.id===orderId);
      const agentId = o && o.deliveryAgentId;
      const agentLoc = agentId ? getAgentLocation(agentId) : null;
      if (agentLoc) { this.upsertCustomerMarker('agent', agentLoc, '#1d4ed8', true); this.customerMap.setCenter({ lat: agentLoc.lat, lng: agentLoc.lng }); }
      if (o && o.dropoff) {
        this.upsertCustomerMarker('drop', o.dropoff, '#f97316');
      }
      // show only nearby: fit bounds tightly
      if (agentLoc && o && o.dropoff){
        const b = new google.maps.LatLngBounds();
        b.extend(new google.maps.LatLng(agentLoc.lat, agentLoc.lng));
        b.extend(new google.maps.LatLng(o.dropoff.lat, o.dropoff.lng));
        this.customerMap.fitBounds(b, { top:40, right:40, bottom:40, left:40 });
      }
      if (this.customerTrackInterval) clearInterval(this.customerTrackInterval);
      this.customerTrackInterval = setInterval(()=>{
        const order = getOrders().find(x=>x.id===orderId);
        if (!order) return;
        const agLoc = order.deliveryAgentId ? getAgentLocation(order.deliveryAgentId) : null;
        if (agLoc) this.upsertCustomerMarker('agent', agLoc, '#1d4ed8', true);
        if (order.status==='delivered') { clearInterval(this.customerTrackInterval); }
      }, 5000);
    }
  
    upsertCustomerMarker(id, coords, color, isRider=false){
      if (!this.customerMap || !(window.google && google.maps)) return;
      this._custMarkers = this._custMarkers || {};
      const bikeIcon = { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%231d4ed8"><path d="M5 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm14 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-2a1 1 0 1 1 .001-2.001A1 1 0 0 1 19 14ZM10 7h3l2 4h-2l-1-2h-1l-1 5H8l1.2-6A2 2 0 0 1 11 6h2V5h2v2h-2l1 2h2.5"/></svg>', scaledSize: new google.maps.Size(28,28), anchor: new google.maps.Point(14,14) };
      const homeIcon = { url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23f97316"><path d="M12 3 3 10h2v8h6v-5h2v5h6v-8h2z"/></svg>', scaledSize: new google.maps.Size(28,28), anchor: new google.maps.Point(14,14) };
      const icon = isRider ? bikeIcon : homeIcon;
      if (this._custMarkers[id]) { this._custMarkers[id].setPosition({ lat: coords.lat, lng: coords.lng }); this._custMarkers[id].setIcon(icon); return; }
      const marker = new google.maps.Marker({ position: { lat: coords.lat, lng: coords.lng }, map: this.customerMap, icon });
      this._custMarkers[id] = marker;
    }

    renderCustomerNotifications(userId){
      const box = document.getElementById('customer-notifications');
      if (!box) return;
      const n = getNotifications()[userId] || [];
      box.innerHTML = n.slice(-5).reverse().map(m=>`<div class="cart-item">${new Date(m.ts).toLocaleTimeString()} – ${m.msg}</div>`).join('') || '';
    }

    openRating(orderId){
      const o = document.getElementById("modal-overlay"), c = document.getElementById("modal-content");
      c.innerHTML = `
        <div class="modal-header"><h3>Rate your Order</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Rating (1-5)</label><input id="rt_stars" type="number" min="1" max="5" value="5"></div>
          <div class="form-group"><label>Feedback</label><input id="rt_feedback" placeholder="Share your experience"></div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.submitRating('${orderId}')">Submit</button></div>
      `; o.style.display='flex';
    }
    submitRating(orderId){
      const u = getCurrentUser();
      const stars = Math.max(1, Math.min(5, parseInt(rt_stars.value||'5')));
      const feedback = (rt_feedback.value||'').trim();
      saveRating(orderId, u.id, stars, feedback);
      this.closeModal();
      this.renderCustomerOrders();
    }
    
  
    // 👨‍💼 ADMIN SIDE
    updateAdminStats() {
      document.getElementById("total-products").textContent = getProducts().length;
      document.getElementById("total-orders").textContent = getOrders().length;
      document.getElementById("total-agents").textContent = getDeliveryAgents().length;
    }
  
    renderAdmin() {
      const grid = document.getElementById("admin-products-grid");
      const products = getProducts();
      grid.innerHTML = products.length
        ? products
            .map(
              (p) =>
                `<div class="cart-item"><div><strong>${p.name}</strong> ₹${p.price} — ${
                  p.stockStatus === "out" ? "❌ Out of Stock" : "✅ In Stock"
                }</div><button class="btn btn-outline" onclick="app.openProductModal('${p.id}')">Edit</button></div>`
            )
            .join("")
        : "<p>No products added yet</p>";

      // add homepage editor entry point + add/remove support
      const hpBtnId = 'edit-homepage-cards-btn';
      if (!document.getElementById(hpBtnId)){
        const sec = document.getElementById('overview-tab') || document.getElementById('admin-dashboard');
        // no safe place found; attach a small panel above products grid
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.id = hpBtnId;
        btn.setAttribute('data-action','edit-homepage');
        btn.textContent = 'Edit Homepage Cards';
        grid.parentElement.insertBefore(btn, grid);
        btn.addEventListener('click',()=>this.openHomepageEditor());
      }
  
      const agentList = document.getElementById("admin-agents-list");
      agentList.innerHTML = getDeliveryAgents()
        .map((a) => `<div class="cart-item">${a.name} – ${a.email}</div>`)
        .join("");

      

      // recent orders
      const ro = document.getElementById('admin-recent-orders');
      if (ro) {
        const orders = getOrders().slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10);
        ro.innerHTML = orders.map(o=>`<div class="cart-item"><div><strong>#${o.id}</strong> – ${o.customerName||o.customerId} – ₹${o.total}</div><div>${o.status}</div></div>`).join('') || '<p>No orders</p>';
      }

      // top-selling products (by quantity)
      const tp = document.getElementById('admin-top-products');
      if (tp) {
        const tally = {};
        getOrders().forEach(o=> (o.items||[]).forEach(it=>{ tally[it.productId]=(tally[it.productId]||0)+it.quantity; }));
        const list = Object.entries(tally).sort((a,b)=>b[1]-a[1]).slice(0,10);
        const pMap = products.reduce((m,p)=>{m[p.id]=p;return m;},{});
        tp.innerHTML = list.map(([pid,q])=>{
          const p = pMap[pid];
          const img = p && p.image ? `<img class=\"thumb\" src=\"${p.image}\" alt=\"${p.name}\">` : '';
          return `<div class=\"cart-item\"><div style=\"display:flex;align-items:center;gap:.5rem\">${img}<strong>${p?p.name:pid}</strong></div><div>Sold: ${q}</div></div>`;
        }).join('') || '<p>No sales data</p>';
      }

      // customer search insights
      const sl = document.getElementById('admin-search-logs');
      if (sl) {
        const logs = getSearchLogs().slice().sort((a,b)=>b.count-a.count).slice(0,15);
        sl.innerHTML = logs.map(l=>`<div class=\"cart-item\"><div><strong>${l.term}</strong></div><div>Searched: ${l.count}×</div></div>`).join('') || '<p>No search data</p>';
      }

      // charts
      if (window.Chart) {
        const orders = getOrders();
        const range = document.getElementById('chart-sales-range')?.value || 'weekly';
        let labels = [], sales = [], revenue = [];
        if (range==='weekly'){
          const days = [...Array(7)].map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); d.setHours(0,0,0,0); return d; });
          labels = days.map(d=> `${d.getMonth()+1}/${d.getDate()}`);
          sales = days.map(d=> orders.filter(o=> new Date(o.date)>=d && new Date(o.date)<new Date(d.getTime()+86400000)).length);
          revenue = days.map(d=> orders.filter(o=> new Date(o.date)>=d && new Date(o.date)<new Date(d.getTime()+86400000)).reduce((s,o)=>s+(o.total||0),0));
        } else if (range==='monthly'){
          const now = new Date(); const y = now.getFullYear(); const m = now.getMonth();
          const daysInMonth = new Date(y, m+1, 0).getDate();
          labels = [...Array(daysInMonth)].map((_,i)=> `${m+1}/${i+1}`);
          sales = labels.map((_,i)=>{ const start=new Date(y,m,i+1); start.setHours(0,0,0,0); const end=new Date(start.getTime()+86400000); return orders.filter(o=> new Date(o.date)>=start && new Date(o.date)<end).length; });
          revenue = labels.map((_,i)=>{ const start=new Date(y,m,i+1); start.setHours(0,0,0,0); const end=new Date(start.getTime()+86400000); return orders.filter(o=> new Date(o.date)>=start && new Date(o.date)<end).reduce((s,o)=>s+(o.total||0),0); });
        } else if (range==='yearly'){
          const now = new Date(); const y = now.getFullYear();
          labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          sales = labels.map((_,i)=>{ const start=new Date(y,i,1); const end=new Date(y,i+1,1); return orders.filter(o=> new Date(o.date)>=start && new Date(o.date)<end).length; });
          revenue = labels.map((_,i)=>{ const start=new Date(y,i,1); const end=new Date(y,i+1,1); return orders.filter(o=> new Date(o.date)>=start && new Date(o.date)<end).reduce((s,o)=>s+(o.total||0),0); });
        }

        const ctx1 = document.getElementById('chart-sales');
        if (ctx1 && !ctx1._chart) {
          ctx1._chart = new Chart(ctx1, { type:'line', data:{ labels, datasets:[{ label:'Orders', data:sales, borderColor:'#f97316', backgroundColor:'rgba(249,115,22,.15)', tension:.3, fill:true }]}, options:{ plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }});
        } else if (ctx1 && ctx1._chart) { ctx1._chart.data.labels=labels; ctx1._chart.data.datasets[0].data=sales; ctx1._chart.update(); }

        const ctx2 = document.getElementById('chart-revenue');
        if (ctx2 && !ctx2._chart) {
          ctx2._chart = new Chart(ctx2, { type:'bar', data:{ labels, datasets:[{ label:'Revenue', data:revenue, backgroundColor:'#10b981' }]}, options:{ plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }});
        } else if (ctx2 && ctx2._chart) { ctx2._chart.data.labels=labels; ctx2._chart.data.datasets[0].data=revenue; ctx2._chart.update(); }

        const sel = document.getElementById('chart-sales-range');
        if (sel && !sel._bound){ sel._bound=true; sel.addEventListener('change',()=>this.renderAdmin()); }
      }
    }

    openHomepageEditor(){
      const o = document.getElementById("modal-overlay"), c = document.getElementById("modal-content");
      const cards = getHomepageCards();
      const cats = [];
      const cardRows = cards.map((card, idx)=>{
        const catOpts = '';
        return `
          <div class="cart-item" style="display:block">
            <div style="display:flex;gap:1rem;align-items:flex-start">
              <img src="${card.image}" alt="preview" style="width:160px;height:90px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb">
              <div style="flex:1">
                <div class="form-group"><label>Title</label><input id="hc_title_${idx}" value="${card.title||''}"></div>
                <div class="form-group"><label>Description</label><input id="hc_desc_${idx}" value="${card.description||''}"></div>
                
                <div class="form-group"><label>Image</label><input type="file" accept="image/*" id="hc_file_${idx}" data-idx="${idx}"></div>
                <div><button class="btn btn-outline" data-action="remove-card" data-idx="${idx}">Remove Card</button></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      c.innerHTML = `
        <div class="modal-header"><h3>Edit Homepage Cards</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">${cardRows}
          <div class="cart-item" style="display:block">
            <button id="add-homepage-card" class="btn btn-primary">Add New Card</button>
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.saveHomepageCards()">Save</button></div>
      `;
      o.style.display = 'flex';
      // bind file inputs
      const cardsLen = cards.length;
      for (let i=0;i<cardsLen;i++){
        const inp = document.getElementById('hc_file_'+i);
        if (inp && !inp._bound){ inp._bound=true; inp.addEventListener('change', (e)=> this.readHomepageImage(e, i)); }
      }
      this._homepageDraft = JSON.parse(JSON.stringify(cards));
      const addBtn = document.getElementById('add-homepage-card');
      if (addBtn && !addBtn._bound){ addBtn._bound=true; addBtn.addEventListener('click', ()=> this.addHomepageCardRow()); }
      c.querySelectorAll('[data-action="remove-card"]').forEach(btn=>{
        if (!btn._bound){ btn._bound=true; btn.addEventListener('click', (e)=>{
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
          this.removeHomepageCard(idx);
        }); }
      });
    }

    readHomepageImage(e, idx){
      const file = e.target.files && e.target.files[0]; if(!file) return;
      const r = new FileReader();
      r.onload = (ev)=>{
        if(!this._homepageDraft) this._homepageDraft = getHomepageCards();
        this._homepageDraft[idx].image = ev.target.result;
      };
      r.readAsDataURL(file);
    }

    saveHomepageCards(){
      const cards = this._homepageDraft || getHomepageCards();
      for (let i=0;i<cards.length;i++){
        const t = document.getElementById('hc_title_'+i)?.value||cards[i].title;
        const d = document.getElementById('hc_desc_'+i)?.value||cards[i].description;
        cards[i] = { ...cards[i], title:t, description:d };
      }
      saveHomepageCards(cards);
      this.closeModal();
      this.renderHomepageCards();
      alert('Homepage cards updated');
    }

    addHomepageCardRow(){
      if (!this._homepageDraft) this._homepageDraft = getHomepageCards();
      this._homepageDraft.push({ id: idGen(), title:'New Card', description:'', image:'' });
      // persist draft to storage and re-open editor to refresh UI
      saveHomepageCards(this._homepageDraft);
      this.openHomepageEditor();
    }

    removeHomepageCard(idx){
      if (!this._homepageDraft) this._homepageDraft = getHomepageCards();
      this._homepageDraft.splice(idx,1);
      // persist draft to storage and re-open editor to refresh UI
      saveHomepageCards(this._homepageDraft);
      this.openHomepageEditor();
    }

    
  
    openProductModal(id) {
      const o = document.getElementById("modal-overlay"),
        c = document.getElementById("modal-content");
      const p = id ? getProducts().find((x) => x.id === id) : null;
      const homepageCards = getHomepageCards();
      const cardOptions = homepageCards.map(h=>`<option value="${h.id}" ${p && p.homepageCardId===h.id?'selected':''}>${h.title}</option>`).join('');
  
      c.innerHTML = `
        <div class="modal-header"><h3>${p ? "Edit" : "Add"} Product</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Name</label><input id="p_name" value="${p ? p.name : ""}"></div>
          <div class="form-group"><label>Description</label><input id="p_desc" value="${p ? p.description : ""}"></div>
          <div class="form-group"><label>Price (₹)</label><input id="p_price" type="number" value="${p ? p.price : ""}"></div>
          <div class="form-group"><label>Original Price (₹) — optional</label><input id="p_orig_price" type="number" value="${p && p.originalPrice!=null ? p.originalPrice : ""}" placeholder="e.g., 249"></div>
          <div class="form-group"><label>Stock</label><input id="p_stock" type="number" value="${p ? p.stock : ""}"></div>
          <div class="form-group"><label>Status</label>
            <select id="p_status">
              <option value="in" ${p && p.stockStatus !== "out" ? "selected" : ""}>In Stock</option>
              <option value="out" ${p && p.stockStatus === "out" ? "selected" : ""}>Out of Stock</option>
            </select>
          </div>
          <div class="form-group"><label>Category</label>
            <select id="p_cat">
              <option>Fruits</option><option>Vegetables</option><option>Dairy</option>
              <option>Bakery</option><option>Beverages</option><option>Others</option>
            </select>
          </div>
          <div class="form-group"><label>Homepage Card</label>
            <select id="p_homepage_card"><option value="">— None —</option>${cardOptions}</select>
          </div>
          <div class="form-group"><label>Image</label>
            <input id="p_img_file" type="file" accept="image/*" onchange="app.previewImage(event)">
            <img id="p_preview" src="${p ? p.image : ""}" style="width:100%;max-height:150px;margin-top:10px;border-radius:8px;object-fit:cover">
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.saveProduct('${id || ""}')">Save</button></div>
      `;
      o.style.display = "flex";
    }
  
    previewImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("p_preview").src = e.target.result;
        document.getElementById("p_preview").dataset.base64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  
    closeModal() {
      document.getElementById("modal-overlay").style.display = "none";
    }
  
    saveProduct(id) {
      const n = p_name.value.trim(),
        d = p_desc.value.trim(),
        price = parseInt(p_price.value),
        originalPriceInput = document.getElementById('p_orig_price')?.value,
        originalPrice = originalPriceInput!=='' && originalPriceInput!=null ? parseInt(originalPriceInput) : undefined,
        stock = parseInt(p_stock.value),
        cat = p_cat.value,
        status = p_status.value,
        homepageCardId = (document.getElementById('p_homepage_card')?.value||'') || '',
        preview = document.getElementById("p_preview"),
        img = preview.dataset.base64 || preview.src;
  
      if (!n || !d || isNaN(price) || isNaN(stock)) return alert("Fill all fields");
  
      const prod = {
        id: id || idGen(),
        name: n,
        description: d,
        price,
        stock,
        stockStatus: status,
        category: cat,
        image: img,
        originalPrice: originalPrice,
        homepageCardId: homepageCardId || undefined,
      };
  
      id ? updateProduct(prod) : addProduct(prod);
      this.closeModal();
      this.updateAdminStats();
      this.renderAdmin();
      this.renderProducts();
      alert("Product saved successfully!");
    }
  
    openAgentModal() {
      const o = document.getElementById("modal-overlay"),
        c = document.getElementById("modal-content");
      c.innerHTML = `<div class="modal-header"><h3>Add Delivery Agent</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body"><div class="form-group"><label>Name</label><input id="ag_name"></div><div class="form-group"><label>Email</label><input id="ag_email" type="email"></div><div class="form-group"><label>Password</label><input id="ag_pass" type="password"></div></div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.saveAgent()">Save</button></div>`;
      o.style.display = "flex";
    }
  
    saveAgent() {
      const n = ag_name.value.trim(),
        e = ag_email.value.trim(),
        p = ag_pass.value.trim() || "delivery123";
      if (!n || !e) return alert("Fill all fields");
      const id = idGen();
      addAgent({ id, name: n, email: e, status: "active" }, { id, name: n, email: e, password: p, role: "delivery" });
      this.closeModal();
      this.updateAdminStats();
      this.renderAdmin();
      alert("Agent added!");
    }
  
    renderDelivery() {
      const u = getCurrentUser(),
        o = getOrders();
      
      // Update stats
      const activeOrders = o.filter((x) => x.status !== 'delivered' && (x.status === "pending" || x.deliveryAgentId === u.id));
      const completedOrders = o.filter((x) => x.status === 'delivered' && x.deliveryAgentId === u.id);
      const todayDeliveries = completedOrders.filter(x => {
        const today = new Date();
        const orderDate = new Date(x.date);
        return orderDate.toDateString() === today.toDateString();
      });
      
      document.getElementById('delivery-active-count').textContent = activeOrders.length;
      document.getElementById('delivery-completed-count').textContent = completedOrders.length;
      document.getElementById('delivery-today-count').textContent = todayDeliveries.length;
      
      // Assigned orders
      const list = activeOrders;
      const products = getProducts();
      const productMap = products.reduce((m,p)=>{m[p.id]=p;return m;},{});
      
      document.getElementById("assigned-orders").innerHTML = list.length > 0 ? list
        .map((x) => {
          const s = x.status || 'pending';
          const contact = x.contact || {};
          const addr = [contact.address, contact.landmark, contact.pincode].filter(Boolean).join(', ');
          const phone = contact.mobile || contact.altMobile || 'Not provided';
          
          // Generate product list with images
          const productList = (x.items || []).map(item => {
            const product = productMap[item.productId];
            if (!product) return '';
            return `
              <div class="delivery-product-item">
                <img src="${product.image}" alt="${product.name}" class="delivery-product-image">
                <div class="delivery-product-details">
                  <div class="delivery-product-name">${product.name}</div>
                  <div class="delivery-product-meta">₹${item.price} × ${item.quantity}</div>
                </div>
              </div>
            `;
          }).join('');
          
          return `<div class="delivery-order-card" data-status="${s}">
            <div class="delivery-order-header">
              <div class="delivery-order-id">Order #${x.id}</div>
              <div class="delivery-order-status ${s}">${s.replace('_', ' ')}</div>
            </div>
            <div class="delivery-order-details">
              <div class="delivery-detail-item">
                <i class="fas fa-user"></i>
                <span>${x.customerName || 'Customer'}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${x.total}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-box"></i>
                <span>${(x.items||[]).length} items</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-phone"></i>
                <span>${phone}</span>
              </div>
            </div>
            <div class="delivery-order-products">
              <strong>Ordered Products:</strong>
              <div class="delivery-products-list">
                ${productList}
              </div>
            </div>
            <div class="delivery-order-address">
              <strong>Delivery Address:</strong>
              ${addr || 'Address not provided'}
            </div>
            <div class="delivery-order-actions">
              ${s === 'pending' ? `<button class="delivery-action-btn primary" onclick="app.flowPickup('${x.id}')">
                <i class="fas fa-hand-holding"></i> Pick Up Order
              </button>` : ''}
              ${s === 'picked_up' ? `<button class="delivery-action-btn primary" onclick="app.flowOutForDelivery('${x.id}')">
                <i class="fas fa-truck"></i> Start Delivery
              </button>` : ''}
              ${s === 'out_for_delivery' ? `<button class="delivery-action-btn primary" onclick="app.flowDelivered('${x.id}')">
                <i class="fas fa-check-circle"></i> Mark Delivered
              </button>` : ''}
              <button class="delivery-action-btn secondary" onclick="app.viewOrderOnMap('${x.id}')">
                <i class="fas fa-map-marker-alt"></i> View on Map
              </button>
            </div>
          </div>`;
        }).join('') : `<div class="delivery-empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>No assigned orders</h3>
          <p>You don't have any orders assigned to you at the moment.</p>
        </div>`;

      // Delivered orders
      const delivered = completedOrders;
      document.getElementById("delivered-orders").innerHTML = delivered.length > 0 ? delivered
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .map((x) => {
          const contact = x.contact || {};
          const addr = [contact.address, contact.landmark, contact.pincode].filter(Boolean).join(', ');
          const rating = x.rating ? `${'★'.repeat(x.rating.stars)}${'☆'.repeat(5-x.rating.stars)}` : '';
          
          // Generate product list with images for delivered orders
          const productList = (x.items || []).map(item => {
            const product = productMap[item.productId];
            if (!product) return '';
            return `
              <div class="delivery-product-item">
                <img src="${product.image}" alt="${product.name}" class="delivery-product-image">
                <div class="delivery-product-details">
                  <div class="delivery-product-name">${product.name}</div>
                  <div class="delivery-product-meta">₹${item.price} × ${item.quantity}</div>
                </div>
              </div>
            `;
          }).join('');
          
          return `<div class="delivery-order-card">
            <div class="delivery-order-header">
              <div class="delivery-order-id">Order #${x.id}</div>
              <div class="delivery-order-status delivered">Delivered</div>
            </div>
            <div class="delivery-order-details">
              <div class="delivery-detail-item">
                <i class="fas fa-user"></i>
                <span>${x.customerName || 'Customer'}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${x.total}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-box"></i>
                <span>${(x.items||[]).length} items</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-clock"></i>
                <span>${new Date(x.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div class="delivery-order-products">
              <strong>Delivered Products:</strong>
              <div class="delivery-products-list">
                ${productList}
              </div>
            </div>
            <div class="delivery-order-address">
              <strong>Delivered to:</strong>
              ${addr || 'Address not provided'}
            </div>
            ${rating ? `<div class="delivery-rating" style="margin-top: 1rem; padding: 0.75rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong style="color: #92400e;">Customer Rating:</strong> 
              <span style="color: #f59e0b; font-size: 1.1rem;">${rating}</span>
            </div>` : ''}
          </div>`;
        }).join('') : `<div class="delivery-empty-state">
          <i class="fas fa-history"></i>
          <h3>No delivery history</h3>
          <p>You haven't completed any deliveries yet.</p>
        </div>`;
    }

    initDeliveryMap() {
      if (!(window.google && google.maps)) return;
      const el = document.getElementById("delivery-map");
      if (!el) return;
      this.deliveryMap = new google.maps.Map(el, { center: { lat: 12.9716, lng: 77.5946 }, zoom: 11, mapTypeControl:false, streetViewControl:false });
      this.deliveryMarkers = {};
      this.refreshDeliveryMapMarkers();
    }

    refreshDeliveryMapMarkers() {
      if (!this.deliveryMap || !(window.google && google.maps)) return;
      const u = getCurrentUser();
      const myLoc = getAgentLocation(u.id);
      if (myLoc) {
        this.upsertMarker("agent", myLoc, { color: "#1d4ed8", label: "You" });
        this.deliveryMap.setCenter({ lat: myLoc.lat, lng: myLoc.lng });
      }
      const orders = getOrders().filter(x=>x.status!=="delivered" && (x.deliveryAgentId===u.id || x.status==="pending"));
      orders.forEach(o=>{
        if (o.dropoff && o.dropoff.lng && o.dropoff.lat) {
          this.upsertMarker("order-"+o.id, o.dropoff, { color: "#f97316", label: "Order #"+o.id });
        }
      });
    }

    upsertMarker(id, coords, opts={}) {
      if (!this.deliveryMap || !(window.google && google.maps)) return;
      if (this.deliveryMarkers[id]) {
        this.deliveryMarkers[id].setPosition({ lat: coords.lat, lng: coords.lng });
        return;
      }
      const marker = new google.maps.Marker({ position: { lat: coords.lat, lng: coords.lng }, map: this.deliveryMap, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: (opts.color||'#000'), fillOpacity: 1, strokeWeight: 0 }, title: opts.label||'' });
      this.deliveryMarkers[id]=marker;
    }

    viewOrderOnMap(orderId){
      const o = getOrders().find(x=>x.id===orderId);
      if (!o || !o.dropoff || !this.deliveryMap) return;
      this.deliveryMap.setZoom(13);
      this.deliveryMap.setCenter({ lat: o.dropoff.lat, lng: o.dropoff.lng });
      this.refreshDeliveryMapMarkers();
      this.drawRouteTo(o.dropoff);
    }
    viewAddress(orderId){
      const o = getOrders().find(x=>x.id===orderId);
      if(!o) return;
      const c = o.contact||{};
      const parts = [c.name, c.mobile, c.altMobile, c.address, c.landmark, c.pincode].filter(Boolean);
      const html = `<div class="modal-header"><h3>Delivery Address</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">
          <div class="cart-item" style="display:block">
            ${parts.map(p=>`<div>${p}</div>`).join('')}
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Close</button></div>`;
      const ovr = document.getElementById('modal-overlay');
      const con = document.getElementById('modal-content');
      con.innerHTML = html; ovr.style.display='flex';
    }

    startAgentGeolocation() {
      const u = getCurrentUser();
      if (!navigator.geolocation) return;
      if (this.geoWatchId) { try { navigator.geolocation.clearWatch(this.geoWatchId); } catch(_) {} }
      this.geoWatchId = navigator.geolocation.watchPosition((pos)=>{
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, ts: Date.now() };
        setAgentLocation(u.id, coords);
        this.refreshDeliveryMapMarkers();
        if (this._activeDropoff) this.drawRouteTo(this._activeDropoff);
      }, (err)=>{
        console.warn('geolocation error', err);
      }, { enableHighAccuracy:true, maximumAge:5000, timeout:10000 });
    }

    flowPickup(orderId){
      const o=getOrders().find(x=>x.id===orderId); if(!o|| (o.status&&o.status!=='pending')) return;
      const u=getCurrentUser(); if (!o.deliveryAgentId) assignOrderToAgent(orderId, u.id);
      updateOrderStatus(orderId,'picked_up'); if(o) pushNotification(o.customerId,'Your order was picked up.'); this.renderDelivery(); this.refreshDeliveryMapMarkers();
    }
    flowOutForDelivery(orderId){
      const o=getOrders().find(x=>x.id===orderId); if(!o|| o.status!=='picked_up') return;
      updateOrderStatus(orderId,'out_for_delivery'); if(o) pushNotification(o.customerId,'Your order is out for delivery.'); this.renderDelivery(); this.refreshDeliveryMapMarkers();
    }
    flowDelivered(orderId){
      const o=getOrders().find(x=>x.id===orderId); if(!o|| o.status!=='out_for_delivery') return;
      updateOrderStatus(orderId,'delivered'); if(o) pushNotification(o.customerId,'Your order has been delivered.'); this.renderDelivery(); this.refreshDeliveryMapMarkers();
    }

    async drawRouteTo(target) {
      if (!this.deliveryMap || !(window.google && google.maps)) return;
      const u = getCurrentUser();
      const me = getAgentLocation(u.id);
      if (!me || !target) return;
      this._activeDropoff = target;
      try{
        // Render route using DirectionsService/Renderer
        this._dirService = this._dirService || new google.maps.DirectionsService();
        this._dirRenderer = this._dirRenderer || new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });
        this._dirRenderer.setMap(this.deliveryMap);
        const req = { origin: { lat: me.lat, lng: me.lng }, destination: { lat: target.lat, lng: target.lng }, travelMode: google.maps.TravelMode.TWO_WHEELER || google.maps.TravelMode.DRIVING };
        this._dirService.route(req, (result, status)=>{
          if (status === 'OK' && result) {
            this._dirRenderer.setDirections(result);
            const leg = result.routes[0].legs && result.routes[0].legs[0];
            if (leg){
              const eta = Math.ceil((leg.duration && leg.duration.value ? leg.duration.value : 0)/60);
              const dist = leg.distance && leg.distance.text ? leg.distance.text : '';
              const etaEl = document.getElementById('metric-eta'); if (etaEl) etaEl.textContent = `ETA ${eta?eta+' min':'—'}`;
              const dEl = document.getElementById('metric-distance'); if (dEl) dEl.textContent = `Distance ${dist||'—'}`;
            }
          }
        });
      }catch(e){ console.warn('directions error', e); }
    }
  
    switchTab(tab) {
      document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      const map = {
        products: "products-tab",
        cart: "cart-tab",
        orders: "orders-tab",
        overview: "overview-tab",
        "admin-products": "admin-products-tab",
        "delivery-agents": "delivery-agents-tab",
      };
      document.getElementById(map[tab])?.classList.add("active");
      document.querySelector(`.tab-button[data-tab='${tab}']`)?.classList.add("active");
      if (tab === "cart") this.updateCart();
      if (tab === "products" || tab === "admin-products") {
        this.renderProducts();
        this.renderAdmin();
      }
      if (tab === "orders") this.renderCustomerOrders();
    }

    goToHome() {
      // Reset any active states
      this.activeHomepageCardId = '';
      this.activeCategory = '';
      
      // Clear search inputs
      const si = document.getElementById('search-input');
      if (si) si.value = '';
      const gsi = document.getElementById('global-search-input');
      if (gsi) gsi.value = '';
      
      // Hide any open modals or overlays
      const modal = document.getElementById('modal-overlay');
      if (modal) modal.style.display = 'none';
      
      // Reset customer products visibility to show homepage
      this.updateCustomerProductsVisibility(false);
      
      // Switch to products tab (home)
      this.switchTab('products');
      
      // Close hamburger menu if open
      this.closeHamburgerMenu();
    }

    showCartNotification() {
      const notification = document.getElementById('cart-notification');
      if (!notification) return;
      
      // Show notification
      notification.classList.add('show');
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
    
    filterDeliveryOrders(filter) {
      // Update active filter button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
      
      // Filter and re-render orders
      const cards = document.querySelectorAll('.delivery-order-card[data-status]');
      cards.forEach(card => {
        const status = card.dataset.status;
        const shouldShow = filter === 'all' || status === filter;
        card.style.display = shouldShow ? 'block' : 'none';
      });
    }
    
    centerDeliveryMap() {
      if (this.deliveryMap) {
        const u = getCurrentUser();
        const myLoc = getAgentLocation(u.id);
        if (myLoc) {
          this.deliveryMap.setCenter({ lat: myLoc.lat, lng: myLoc.lng });
          this.deliveryMap.setZoom(15);
        }
      }
    }
    
    refreshDeliveryLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const u = getCurrentUser();
          saveAgentLocation(u.id, location);
          this.refreshDeliveryMapMarkers();
          
          // Update location display
          document.getElementById('current-location').textContent = 
            `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`;
        }, (error) => {
          console.error('Error getting location:', error);
          document.getElementById('current-location').textContent = 'Location unavailable';
        });
      }
    }
  }
  const app = new MangoMartApp();
  