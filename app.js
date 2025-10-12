class MangoMartApp {
    constructor() {
      // Set up fallback immediately
      this.hideLoadingFallback();
      
      // Initialize synchronously first
      this.initializeSync();
      
      // Then initialize async parts
      this.initializeAsync();
    }

    initializeSync() {
      try {
        // Initialize basic data synchronously
        initializeData();
        initAuth();
        window.app = this;
        this.start();
      } catch (error) {
        console.error('Error in sync initialization:', error);
        // Still start the app
        window.app = this;
        this.start();
      }
    }

    async initializeAsync() {
      try {
        // Test Supabase connection
        if (window.supabaseService) {
          console.log('Testing Supabase connection...');
          const products = await getProducts();
          console.log('Supabase connection test - Products loaded:', products.length);
        } else {
          console.log('Supabase service not available, using localStorage');
        }
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error in async initialization:', error);
      }
    }

    // Test function to verify Supabase product persistence
    async testProductPersistence() {
      console.log('=== Testing Product Persistence ===');
      
      // Test 1: Check Supabase connection
      console.log('1. Supabase service available:', !!window.supabaseService);
      
      // Test 2: Get current products
      const products = await getProducts();
      console.log('2. Current products count:', products.length);
      
      // Test 3: Add a test product
      const testProduct = {
        id: idGen(),
        name: 'Test Product ' + Date.now(),
        description: 'This is a test product',
        price: 99.99,
        stock: 10,
        stockStatus: 'in',
        category: 'Test',
        image: ''
      };
      
      console.log('3. Adding test product:', testProduct);
      await addProduct(testProduct);
      
      // Test 4: Verify product was added
      const updatedProducts = await getProducts();
      console.log('4. Products after adding:', updatedProducts.length);
      const foundProduct = updatedProducts.find(p => p.id === testProduct.id);
      console.log('5. Test product found:', !!foundProduct);
      
      console.log('=== Test Complete ===');
      console.log('Now refresh the page and check if the test product persists!');
      
      return testProduct;
    }

    // Function to check Supabase table directly
    async checkSupabaseTable() {
      console.log('=== Checking Supabase Table Directly ===');
      
      if (!window.supabaseService) {
        console.error('Supabase service not available!');
        return;
      }

      try {
        // Direct query to Supabase
        const { data, error } = await window.supabaseService.client
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error querying Supabase table:', error);
          return;
        }

        console.log('✅ Supabase table query successful!');
        console.log('📊 Products in Supabase table:', data.length);
        console.log('📋 Table data:', data);
        
        // Show instructions
        console.log('=== Next Steps ===');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Table Editor');
        console.log('3. Select the "products" table');
        console.log('4. You should see', data.length, 'products listed');
        
        return data;
      } catch (error) {
        console.error('Failed to query Supabase table:', error);
      }
    }

    // Function to add a product and immediately check Supabase table
    async addProductAndVerify() {
      console.log('=== Add Product and Verify in Supabase ===');
      
      const testProduct = {
        id: idGen(),
        name: 'Supabase Test Product ' + new Date().toLocaleTimeString(),
        description: 'This product should appear in Supabase table editor',
        price: 199.99,
        stock: 25,
        stockStatus: 'in',
        category: 'Test Category',
        image: ''
      };
      
      console.log('Adding product:', testProduct);
      
      // Add the product
      await addProduct(testProduct);
      
      // Wait a moment for the database to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check the Supabase table directly
      await this.checkSupabaseTable();
      
      console.log('=== Verification Complete ===');
      console.log('Check your Supabase table editor now!');
      
      return testProduct;
    }

    // Function to test homepage card associations
    async testHomepageCardAssociation() {
      console.log('=== Testing Homepage Card Association ===');
      
      // Get all products and homepage cards
      const products = await getProducts();
      const homepageCards = await getHomepageCards();
      
      console.log('Total products:', products.length);
      console.log('Total homepage cards:', homepageCards.length);
      
      // Check which products have homepage card associations
      const productsWithCards = products.filter(p => p.homepage_card_id);
      console.log('Products with homepage card associations:', productsWithCards.length);
      
      // Show detailed associations
      productsWithCards.forEach(product => {
        const card = homepageCards.find(c => c.id === product.homepage_card_id);
        console.log(`Product "${product.name}" -> Homepage Card "${card ? card.title : 'NOT FOUND'}"`);
      });
      
      // Test filtering
      if (productsWithCards.length > 0) {
        const testProduct = productsWithCards[0];
        console.log(`Testing filter for product "${testProduct.name}" with card ID: ${testProduct.homepage_card_id}`);
        
        // Simulate clicking the homepage card
        this.activeHomepageCardId = testProduct.homepage_card_id;
        const filteredProducts = products.filter(p => p.homepage_card_id === testProduct.homepage_card_id);
        console.log(`Filtered products for card ${testProduct.homepage_card_id}:`, filteredProducts.length);
      }
      
      console.log('=== Homepage Card Association Test Complete ===');
    }

    // Function to test Supabase update directly
    async testSupabaseUpdate() {
      console.log('=== Testing Supabase Update Directly ===');
      
      if (!window.supabaseService) {
        console.error('Supabase service not available!');
        return;
      }

      // Get a test product
      const products = await getProducts();
      if (products.length === 0) {
        console.error('No products found to test with!');
        return;
      }

      const testProduct = products[0];
      console.log('Testing with product:', testProduct);

      // Try to update it with a homepage card
      const updatedProduct = {
        ...testProduct,
        homepage_card_id: 'ca4e12e8-986f-451f-82b5-27f264367cdf'
      };

      console.log('Attempting direct Supabase update...');
      try {
        const result = await window.supabaseService.updateProduct(updatedProduct);
        console.log('Direct Supabase update result:', result);
      } catch (error) {
        console.error('Direct Supabase update error:', error);
      }

      console.log('=== Direct Supabase Update Test Complete ===');
    }

    // Fallback to hide loading spinner after 3 seconds
    hideLoadingFallback() {
      setTimeout(() => {
        const loadingEl = document.getElementById("loading");
        if (loadingEl && loadingEl.style.display !== "none") {
          console.warn('Loading spinner still visible after 3 seconds, hiding it');
          loadingEl.style.display = "none";
          // Force start the app if it hasn't started
          if (!window.app) {
            window.app = this;
            this.start();
          }
        }
      }, 3000);
    }
  
    start() {
      // Hide loading spinner
      const loadingEl = document.getElementById("loading");
      if (loadingEl) loadingEl.style.display = "none";
      
      this.bindEvents();
      this.initMobileGestures();
      this.route();
      const fy = document.getElementById('footer-year'); if (fy) fy.textContent = new Date().getFullYear();
    }
  
    bindEvents() {
      document.getElementById("login-form")?.addEventListener("submit", (e) => this.login(e));
      document.getElementById("register-form")?.addEventListener("submit", (e) => this.register(e));
      document.getElementById("switch-to-register")?.addEventListener("click", (e) => this.switchToRegister(e));
      document.getElementById("switch-to-login")?.addEventListener("click", (e) => this.switchToLogin(e));
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
          this.openCategory(cat);
        }
      });
      // Homepage cards are now static - no editing needed
      // previous orders filters
      document.getElementById('prev-filter-range')?.addEventListener('change', ()=> this.renderCustomerOrders());
      document.getElementById('prev-filter-rating')?.addEventListener('change', ()=> this.renderCustomerOrders());
      // back buttons
      document.getElementById('back-from-orders')?.addEventListener('click', () => this.switchTab('products'));
      document.getElementById('back-from-cart')?.addEventListener('click', () => this.switchTab('products'));
      // logo home button
      document.getElementById('logo-home')?.addEventListener('click', () => this.goToHome());
    }
  
    async route() {
      const u = getCurrentUser();
      if (!u) return this.show("login-page");
      
      // Special routing for specific admin credentials
      if (u.email === "mangomartonline123@gmail.com" && u.password === "varun@173205") {
        u.role = "admin";
        currentUser = u;
        setLS('currentUser', u);
      }
      
      const page =
        u.role === "admin"
          ? "admin-dashboard"
          : u.role === "delivery"
          ? "delivery-dashboard"
          : "customer-dashboard";
      this.show(page);
      await this.loadDashboard(u.role);
    }
  
    show(id) {
      document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
      document.getElementById(id).style.display = "block";
    }
  
    async login(e) {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      
      if (!email || !password) {
        this.showError("login-error", "Please fill in all fields");
        return;
      }
      
      const success = await doLogin(email, password);
      if (!success) {
        this.showError("login-error", "Invalid email or password");
        return;
      }
      
      await this.route();
    }

    async register(e) {
      e.preventDefault();
      const name = document.getElementById("reg_name").value.trim();
      const email = document.getElementById("reg_email").value.trim();
      const password = document.getElementById("reg_password").value;
      const confirmPassword = document.getElementById("reg_confirm_password").value;
      
      if (!name || !email || !password || !confirmPassword) {
        this.showError("register-error", "Please fill in all fields");
        return;
      }
      
      if (password.length < 6) {
        this.showError("register-error", "Password must be at least 6 characters");
        return;
      }
      
      if (password !== confirmPassword) {
        this.showError("register-error", "Passwords do not match");
        return;
      }
      
      const result = await doRegister(name, email, password);
      if (!result.success) {
        this.showError("register-error", result.error);
        return;
      }
      
      // Registration successful, route to appropriate dashboard
      await this.route();
    }

    switchToRegister(e) {
      e.preventDefault();
      document.getElementById("login-form").style.display = "none";
      document.getElementById("register-form").style.display = "block";
      document.getElementById("auth-subtitle").textContent = "Create your account";
      this.hideError("login-error");
      this.hideError("register-error");
    }

    switchToLogin(e) {
      e.preventDefault();
      document.getElementById("register-form").style.display = "none";
      document.getElementById("login-form").style.display = "block";
      document.getElementById("auth-subtitle").textContent = "Sign in to continue";
      this.hideError("login-error");
      this.hideError("register-error");
    }

    showError(elementId, message) {
      const errorEl = document.getElementById(elementId);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
      }
    }

    hideError(elementId) {
      const errorEl = document.getElementById(elementId);
      if (errorEl) {
        errorEl.style.display = "none";
      }
    }
  
    logout() {
      doLogout();
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
  
    async loadDashboard(role) {
      if (role === "customer") {
        await this.renderHomepageCards();
        this.updateCustomerProductsVisibility(false);
        await this.updateCartCount();
      } else if (role === "admin") {
        await this.updateAdminStats();
        await this.renderAdmin();
      } else if (role === "delivery") {
        await this.renderDelivery();
        // Map initialization removed
        this.startAgentGeolocation();
      }
    }
  
    // 🛍 CUSTOMER SIDE
    async renderProducts() {
      const grid = document.getElementById("products-grid");
      if (!grid) return;
      const cart = await getCart();
      const productsAll = await getProducts();
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
        const byCard = !activeCardId || p.homepage_card_id===activeCardId;
        
        // Debug logging for homepage card filtering
        if (activeCardId && !byCard) {
          console.log(`Product "${p.name}" filtered out:`, {
            productHomepageCardId: p.homepage_card_id,
            activeCardId: activeCardId,
            match: p.homepage_card_id === activeCardId
          });
        }
        
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
                    <div class="product-price">₹${p.price}</div>
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
                    <div class=\"product-price\">₹${p.price}</div>
                    ${controls}
                  </div>
                </div>`;
            })
            .join("")
        : shouldShowNoProductsMessage 
          ? `<div class=\"cart-item\" style=\"display:block\"><div><strong>No products found</strong>${qRaw?` for "${qRaw.trim()}"`:''}</div><div class=\"muted\" style=\"margin-top:.25rem\">Try a different keyword.</div></div>`
          : '';
      
    }

    async renderHomepageCards(){
      const cont = document.querySelector('.category-cards');
      if (!cont) return;
      
      // Define static category cards that match the product categories
      const categoryCards = [
        {
          title: 'Fruits and Vegetables',
          description: 'Fresh fruits and vegetables',
          category: 'Fruits and Vegetables',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop'
        },
        {
          title: 'Grocery',
          description: 'Food items and groceries',
          category: 'Grocery',
          image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1600&auto=format&fit=crop'
        },
        {
          title: 'Stationery',
          description: 'Office and school supplies',
          category: 'Stationery',
          image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1600&auto=format&fit=crop'
        }
      ];
      
      cont.innerHTML = categoryCards.map(c=>`
          <div class="category-card" data-category="${c.category}">
            <div class="category-media" style="background-image:url('${c.image}')"></div>
            <div class="category-info">
              <h3>${c.title}</h3>
              <p>${c.description}</p>
              <button class="btn btn-primary" data-action="shop-now" data-category="${c.category}">Shop Now</button>
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

    async openHomepageCard(cardId){
      console.log('Opening homepage card:', cardId);
      this.activeHomepageCardId = cardId;
      // do not constrain by category; show all products assigned to this card
      const cards = await getHomepageCards();
      const card = cards.find(c=>c.id===cardId);
      console.log('Found card:', card);
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

    async openProductDetail(productId){
      const products = await getProducts();
      const p = products.find(x=>x.id===productId); if(!p) return;
      const grid = document.getElementById('products-grid'); if (grid) grid.style.display='none';
      const detail = document.getElementById('product-detail'); if (!detail) return;
      const cartNow = await getCart();
      const item = cartNow.find(c=>c.productId===p.id);
      const qty = item ? item.quantity : 0;
      // related products: same homepage card excluding current, top 4
      // fallback to same category if no products with same homepage card
      let related = products.filter(x=> x.id!==p.id && x.homepage_card_id===p.homepage_card_id).slice(0,4);
      if (related.length === 0) {
        related = products.filter(x=> x.id!==p.id && x.category===p.category).slice(0,4);
      }
      const controls = qty>0
        ? `<div class=\"qty-controls\"><button aria-label=\"Decrease\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty - 1}); app.refreshDetailIfOpen('${p.id}')\">-</button><div class=\"qty\">${qty}</div><button aria-label=\"Increase\" onclick=\"event.stopPropagation(); app.changeQty('${p.id}', ${qty + 1}); app.refreshDetailIfOpen('${p.id}')\">+</button></div>`
        : `<button class=\"btn btn-primary\" onclick=\"event.stopPropagation(); app.addToCart('${p.id}'); app.refreshDetailIfOpen('${p.id}')\">Add to Cart</button>`;
      const titleEl = document.querySelector('#card-view-header .card-view-title'); if (titleEl) titleEl.textContent = p.name;
      this.updateCustomerProductsVisibility(true);
      detail.innerHTML = `<div style="display:flex;flex-direction:column;gap:1rem">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
            <button class="back-button" onclick="app.closeProductDetail()">
              <i class="fas fa-arrow-left"></i> Back
            </button>
          </div>
          <img src="${p.image}" alt="${p.name}" style="width:100%;max-height:50vh;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb" />
          <div style="text-align:center">
            <h2 style="margin:0 0 .5rem 0;color:#111827;font-size:1.5rem">${p.name}</h2>
            <div style="color:#f97316;font-weight:700;font-size:1.25rem;margin-bottom:.5rem">₹${p.price}</div>
            <div style="color:#6b7280;font-size:.9rem;margin-bottom:1rem">Stock: ${p.stockStatus!=='out'?'Available':'Out of Stock'}</div>
          </div>
          <div style="text-align:center;margin-bottom:1rem">
            <h4 style="margin:0 0 .5rem 0;color:#374151">Description</h4>
            <p style="margin:0;color:#6b7280;line-height:1.5">${p.description}</p>
          </div>
          <div style="display:flex;justify-content:center;margin-bottom:1rem">${controls}</div>
          ${related.length?`<div class="related"><h4>Related products</h4><div class="related-grid">${related.map(r=>{
            const relItem = cartNow.find(c=>c.productId===r.id);
            const relQty = relItem ? relItem.quantity : 0;
            const relControls = relQty>0
              ? `<div class=\"qty-controls\"><button aria-label=\"Decrease\" onclick=\"event.stopPropagation(); app.changeQty('${r.id}', ${relQty - 1}); app.refreshDetailIfOpen('${r.id}')\">-</button><div class=\"qty\">${relQty}</div><button aria-label=\"Increase\" onclick=\"event.stopPropagation(); app.changeQty('${r.id}', ${relQty + 1}); app.refreshDetailIfOpen('${r.id}')\">+</button></div>`
              : `<button class=\"btn btn-primary\" onclick=\"event.stopPropagation(); app.addToCart('${r.id}'); app.refreshDetailIfOpen('${r.id}')\">Add to Cart</button>`;
            return `<div class="related-card" onclick="app.openProductDetail('${r.id}')"><img src='${r.image}' alt='${r.name}'/><div class="info"><div style="font-weight:600">${r.name}</div><div class="price">₹${r.price}</div><div style="margin-top:.25rem">${relControls}</div></div></div>`;
          }).join('')}</div></div>`:''}
        </div>`;
      detail.style.display='block';
    }
    closeProductDetail(){
      const detail = document.getElementById('product-detail'); if (detail) detail.style.display='none';
      const grid = document.getElementById('products-grid'); if (grid) grid.style.display='grid';
    }
    async refreshDetailIfOpen(id){
      const detail = document.getElementById('product-detail');
      if (detail && detail.style.display!== 'none'){
        // re-open the same product to refresh qty controls
        const titleEl = document.querySelector('#card-view-header .card-view-title');
        const name = titleEl && titleEl.textContent ? titleEl.textContent : '';
        const products = await getProducts();
        const p = products.find(x=>x.id===id);
        if (p){ this.openProductDetail(id); }
      }
      this.updateCartCount();
    }

    async updateAutosuggest(){
      const box = document.getElementById('autosuggest-list');
      const input = document.getElementById('global-search-input');
      if (!box || !input) return;
      const q = input.value.trim().toLowerCase();
      if (!q) { box.style.display='none'; box.innerHTML=''; return; }
      const allProducts = await getProducts();
      const products = allProducts.filter(p=> p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)).slice(0,8);
      if (!products.length) { box.style.display='none'; box.innerHTML=''; return; }
      box.innerHTML = products.map(p=>`<div class="autosuggest-item" onclick="app.selectAutosuggest('${p.id}')">${p.image?`<img src='${p.image}' alt='${p.name}'>`:''}<div>${p.name}</div></div>`).join('');
      box.style.display='block';
    }
    async selectAutosuggest(productId){
      const products = await getProducts();
      const p = products.find(x=>x.id===productId); if(!p) return;
      const inEl=document.getElementById('search-input'); if(inEl){ inEl.value=p.name; }
      const gin=document.getElementById('global-search-input'); if(gin){ gin.value=p.name; }
      this.switchTab('products');
      this.renderProducts();
      const as = document.getElementById('autosuggest-list'); if (as) as.style.display='none';
    }
  
    async addToCart(id) {
      const products = await getProducts();
      const p = products.find((x) => x.id === id);
      if (!p || p.stockStatus === "out") return alert("This product is out of stock!");
      
      const user = getCurrentUser();
      if (!user) return alert("Please login to add items to cart");
      
      console.log(`Adding product ${id} to cart for user ${user.id}`);
      
      if (window.supabaseService) {
        try {
          await window.supabaseService.addToCart(user.id, id, 1);
          console.log('Product added to cart in database');
        } catch (error) {
          console.warn('Supabase addToCart failed, using localStorage fallback:', error);
          // Fallback to localStorage
          const c = await getCart();
          const i = c.find((x) => x.productId === id);
          if (i) i.quantity++;
          else c.push({ productId: id, productName: p.name, price: p.price, quantity: 1 });
          await saveCart(c);
        }
      } else {
        // Use localStorage
        const c = await getCart();
        const i = c.find((x) => x.productId === id);
        if (i) i.quantity++;
        else c.push({ productId: id, productName: p.name, price: p.price, quantity: 1 });
        await saveCart(c);
      }
      
      this.renderProducts();
      this.updateCartCount();
      this.showCartNotification();
    }
  
    async changeQty(id, q) {
      const user = getCurrentUser();
      if (!user) return;
      
      console.log(`Updating quantity for product ${id} to ${q} for user ${user.id}`);
      
      if (window.supabaseService) {
        try {
          if (q <= 0) {
            await window.supabaseService.removeFromCart(user.id, id);
            console.log('Product removed from cart in database');
          } else {
            await window.supabaseService.updateCartItem(user.id, id, q);
            console.log('Product quantity updated in database');
          }
        } catch (error) {
          console.warn('Supabase changeQty failed, using localStorage fallback:', error);
          // Fallback to localStorage
          let c = await getCart();
          const i = c.findIndex((x) => x.productId === id);
          if (q <= 0) {
            if (i != -1) c.splice(i, 1);
          } else if (i != -1) c[i].quantity = q;
          await saveCart(c);
        }
      } else {
        // Use localStorage
        let c = await getCart();
        const i = c.findIndex((x) => x.productId === id);
        if (q <= 0) {
          if (i != -1) c.splice(i, 1);
        } else if (i != -1) c[i].quantity = q;
        await saveCart(c);
      }
      
      this.renderProducts();
      this.updateCart();
      this.updateCartCount();
    }
  
    async updateCartCount() {
      const c = await getCart();
      const n = c.reduce((s, i) => s + i.quantity, 0);
      const el = document.getElementById("cart-count");
      if (el) el.textContent = n;
    }
  
    async updateCart() {
      const it = document.getElementById("cart-items"),
        t = document.getElementById("cart-total"),
        c = await getCart();
      if (!c.length) {
        it.innerHTML = "<p>Cart is empty</p>";
        t.innerHTML = "";
        return;
      }
      const products = await getProducts();
      const productMap = products.reduce((m,p)=>{m[p.id]=p;return m;},{});
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
  
    async checkout() {
      const c = await getCart();
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
      const cartItems = await getCart();
      const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

      console.log('Starting payment process...', { totalAmount, cartItems: cartItems.length });

      // Check if Razorpay is available
      if (!window.Razorpay || !window.RAZORPAY_KEY) {
        console.warn('Razorpay not configured; proceeding without payment');
        return this.finalizeOrder(details);
      }

      // Validate minimum amount
      if (totalAmount < 1) {
        alert('Minimum order amount is ₹1');
        return;
      }

          try {
            const options = {
              key: window.RAZORPAY_KEY,
              amount: Math.round(totalAmount * 100), // Ensure integer amount in paisa
              currency: 'INR',
              name: 'Mango Mart',
              description: `Order Payment - ${cartItems.length} items`,
              handler: (response) => {
                console.log('Payment successful:', response);
                this._lastPayment = response;
                // Close any open modals first
                this.closeModal();
                // Show loading state
                this.showPaymentSuccess();
                // Process order
                this.finalizeOrder(details);
              },
              prefill: { 
                name: name, 
                contact: mobile,
                email: u.email || ''
              },
              theme: { 
                color: '#f97316',
                backdrop_color: '#000000',
                hide_topbar: false
              },
              modal: {
                ondismiss: () => {
                  console.log('Payment modal dismissed');
                  // Show COD option when payment is cancelled
                  if (confirm('Payment cancelled. Would you like to proceed with Cash on Delivery?')) {
                    this.finalizeOrder(details);
                  }
                }
              },
              config: {
                display: {
                  blocks: {
                    banks: {
                      name: "Pay using Banking",
                      instruments: [
                        {
                          method: "card",
                          issuers: ["HDFC", "ICICI", "AXIS"]
                        },
                        {
                          method: "netbanking",
                          banks: ["HDFC", "ICICI", "AXIS"]
                        }
                      ]
                    }
                  },
                  sequence: ["block.banks"],
                  preferences: {
                    show_default_blocks: true
                  }
                }
              }
            };

        console.log('Opening Razorpay with options:', options);
      const rz = new Razorpay(options);
      rz.open();
      } catch (error) {
        console.error('Razorpay error:', error);
        alert('Payment gateway error. Proceeding with Cash on Delivery.');
        this.finalizeOrder(details);
      }
    }

    async finalizeOrder(details){
      console.log('Finalizing order...', details);
      const u = getCurrentUser();
      const cartItems = await getCart();
      const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

      console.log('Order details:', { user: u.id, cartItems: cartItems.length, totalAmount });

      // Check if user is authenticated with Supabase
      if (window.supabaseService) {
        const supabaseUser = window.supabaseService.getCurrentUser();
        if (!supabaseUser) {
          console.warn('User not authenticated with Supabase, trying to authenticate...');
          // Try to authenticate the user
          try {
            const authResult = await window.supabaseService.signIn(u.email, u.password);
            if (!authResult) {
              console.error('Failed to authenticate with Supabase');
              alert('Authentication error. Please try logging in again.');
              return;
            }
            console.log('User authenticated with Supabase successfully');
          } catch (error) {
            console.error('Supabase authentication error:', error);
            alert('Authentication error. Please try logging in again.');
            return;
          }
        } else {
          console.log('User already authenticated with Supabase');
        }
      }

      // Get location (optional)
      const dropPromise = new Promise((res)=>{
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((p)=>{
            res({lat:p.coords.latitude,lng:p.coords.longitude});
          },()=>res(null),{maximumAge:60000,timeout:5000});
        } else { res(null); }
      });
      
      const drop = await dropPromise;
      
      const orderData = {
        customer_id: u.id,
        customer_name: details.name || u.name,
        customer_email: u.email,
        customer_phone: details.mobile || u.phone,
        total_amount: totalAmount,
        status: "pending",
        payment_status: this._lastPayment ? "paid" : "pending",
        payment_method: this._lastPayment ? "razorpay" : "cod",
        payment_reference: this._lastPayment ? this._lastPayment.razorpay_payment_id : null,
        delivery_address: details.address,
        delivery_landmark: details.landmark,
        delivery_pincode: details.pincode,
        delivery_latitude: drop ? drop.lat : null,
        delivery_longitude: drop ? drop.lng : null,
        delivery_notes: details.notes || "",
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity
        }))
      };

      console.log('Order data prepared:', orderData);

      let orderResult;
      try {
        if (window.supabaseService) {
          console.log('Saving order to Supabase...');
          orderResult = await window.supabaseService.addOrder(orderData);
          console.log('Order saved to Supabase:', orderResult);
        } else {
          console.log('Supabase not available, using localStorage fallback');
          // Fallback to localStorage
          const orders = await getOrders();
          const order = {
            id: idGen(),
            order_number: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
            ...orderData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          orders.push(order);
          await saveOrders(orders);
          orderResult = order;
          console.log('Order saved to localStorage:', orderResult);
        }

        if (!orderResult) {
          throw new Error('Failed to save order');
        }

        // Clear cart after successful order
        console.log('Clearing cart...');
        console.log('Cart before clearing:', await getCart());
        
        // Clear cart multiple times to ensure it's cleared
        for (let i = 0; i < 5; i++) {
          await clearCart();
          const cartAfterClear = await getCart();
          console.log(`Cart after clear attempt ${i + 1}:`, cartAfterClear.length, 'items');
          
          if (cartAfterClear.length === 0) {
            console.log('Cart successfully cleared on attempt', i + 1);
            break;
          }
        }
        
        console.log('Cart cleared successfully');

        // Verify cart is cleared
        const clearedCart = await getCart();
        console.log('Final cart check:', clearedCart.length, 'items');
        
        if (clearedCart.length > 0) {
          console.warn('Cart still not cleared, trying localStorage fallback...');
          localStorage.removeItem('cart');
          // Also try to clear from Supabase again
          if (window.supabaseService) {
            try {
              await window.supabaseService.clearCart(u.id);
            } catch (error) {
              console.error('Error clearing cart from Supabase:', error);
            }
          }
          console.log('Cart after localStorage clear:', await getCart());
        }

        // Force refresh all UI elements
        console.log('Force refreshing all UI elements...');
        
        // Force update cart count
        console.log('Force updating cart count...');
        const currentCartItems = await getCart();
        const cartCount = currentCartItems.reduce((s, i) => s + i.quantity, 0);
        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) {
          cartCountEl.textContent = cartCount;
          console.log('Cart count updated to:', cartCount);
        }
        
        // Force refresh orders
        await this.renderCustomerOrders();
        
        // Force update cart display
        console.log('Force updating cart display...');
        const cartItemsEl = document.getElementById("cart-items");
        const cartTotalEl = document.getElementById("cart-total");
        const displayCartItems = await getCart();
        
        if (!displayCartItems.length) {
          if (cartItemsEl) cartItemsEl.innerHTML = "<p>Cart is empty</p>";
          if (cartTotalEl) cartTotalEl.innerHTML = "";
          console.log('Cart display updated to empty');
        } else {
          console.log('Cart still has items:', displayCartItems.length);
          await this.updateCart();
        }
        
        // Force display orders
        console.log('Force displaying orders...');
        const ordersCurrentEl = document.getElementById('orders-current');
        const ordersPreviousEl = document.getElementById('orders-previous');
        
        if (ordersCurrentEl) {
          console.log('Orders current element found');
        } else {
          console.log('Orders current element not found');
        }
        
        if (ordersPreviousEl) {
          console.log('Orders previous element found');
        } else {
          console.log('Orders previous element not found');
        }
        
        // Force refresh orders from database
        console.log('Force refreshing orders from database...');
        try {
          // Force refresh orders by calling getOrders again
          const freshOrders = await getOrders();
          console.log('Fresh orders from database:', freshOrders.length);
          
          // Force refresh customer orders
          await this.renderCustomerOrders();
          
          // Also refresh if we're on orders tab
          const ordersTab = document.getElementById('orders-tab');
          if (ordersTab && ordersTab.classList.contains('active')) {
            await this.renderCustomerOrders();
          }
          
          // Force refresh orders display
          setTimeout(async () => {
            await this.renderCustomerOrders();
            console.log('Orders refreshed after delay');
          }, 1000);
          
        } catch (error) {
          console.error('Error refreshing orders:', error);
        }
        
        // Show success message with better UI
        const c = document.getElementById("modal-content");
        c.innerHTML = `
          <div class="modal-header">
            <h3 style="color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-check-circle"></i>
              Order Placed Successfully!
            </h3>
            <button class="modal-close" onclick="app.closeModal()">&times;</button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 2rem;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
              <h4 style="color: #166534; margin: 0 0 1rem 0;">Order Confirmation</h4>
              <p style="font-size: 1.2rem; font-weight: 600; color: #166534; margin: 0;">
                Order #${orderResult.order_number || orderResult.id}
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem;">
                <div style="font-weight: 600; color: #374151;">Total Amount</div>
                <div style="font-size: 1.1rem; color: #059669;">₹${totalAmount}</div>
              </div>
              <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem;">
                <div style="font-weight: 600; color: #374151;">Payment Method</div>
                <div style="font-size: 1.1rem; color: #059669;">
                  ${this._lastPayment ? 'Online Payment' : 'Cash on Delivery'}
                </div>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
              <div style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Delivery Address</div>
              <div style="color: #6b7280;">
                ${details.address}<br>
                ${details.landmark ? details.landmark + '<br>' : ''}
                ${details.pincode}
              </div>
            </div>
            
            <p style="color: #6b7280; margin: 0;">
              You will receive updates about your order status via notifications.
            </p>
          </div>
          <div class="modal-footer" style="justify-content: center; gap: 1rem;">
            <button class="btn btn-outline" onclick="app.closeModal()">Continue Shopping</button>
            <button class="btn btn-primary" onclick="app.closeModal(); app.switchTab('orders'); setTimeout(() => { app.renderCustomerOrders(); app.updateCartCount(); app.updateCart(); }, 1000);">
              <i class="fas fa-shopping-bag"></i>
              View My Orders
            </button>
          </div>
        `;
        
        // Auto-redirect to orders after 3 seconds
        setTimeout(() => {
          if (confirm('Would you like to view your orders now?')) {
            this.closeModal();
            this.switchTab('orders');
            setTimeout(() => { 
              this.renderCustomerOrders(); 
              this.updateCartCount(); 
              this.updateCart(); 
            }, 1000);
          }
        }, 3000);
        
      } catch (error) {
        console.error('Error finalizing order:', error);
        alert('Error placing order. Please try again or contact support.');
      }
    }

    // Show payment success loading
    showPaymentSuccess() {
      const modal = document.getElementById("modal");
      const modalContent = document.getElementById("modal-content");
      
      if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
      }
      
      modal.style.display = "flex";
      modalContent.innerHTML = `
        <div class="modal-header">
          <h3>Processing Payment...</h3>
        </div>
        <div class="modal-body" style="text-align: center; padding: 2rem;">
          <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
          <p>Your payment was successful! Processing your order...</p>
        </div>
      `;
    }

    // Test Razorpay integration
    testRazorpay() {
      console.log('Testing Razorpay integration...');
      
      if (!window.Razorpay) {
        console.error('Razorpay not loaded');
        alert('Razorpay is not loaded. Please check your internet connection.');
        return false;
      }
      
      if (!window.RAZORPAY_KEY) {
        console.error('Razorpay key not configured');
        alert('Razorpay key is not configured.');
        return false;
      }
      
      console.log('Razorpay key:', window.RAZORPAY_KEY);
      console.log('Razorpay object:', window.Razorpay);
      
      // Test with minimal amount
      const options = {
        key: window.RAZORPAY_KEY,
        amount: 100, // ₹1 in paisa
        currency: 'INR',
        name: 'Mango Mart Test',
        description: 'Test Payment',
        handler: function (response) {
          console.log('Test payment successful:', response);
          alert('Razorpay test successful! Payment ID: ' + response.razorpay_payment_id);
        },
        prefill: {
          name: 'Test User',
          contact: '9999999999',
          email: 'test@example.com'
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: function() {
            console.log('Test payment cancelled');
            alert('Test payment cancelled');
          }
        }
      };
      
      try {
        const rz = new Razorpay(options);
        rz.open();
        console.log('Razorpay test modal opened');
        return true;
      } catch (error) {
        console.error('Razorpay test error:', error);
        alert('Razorpay test failed: ' + error.message);
        return false;
      }
    }
  
    async renderCustomerOrders(){
      const u = getCurrentUser();
      if (!u) {
        console.log('No user logged in, cannot render orders');
        return;
      }
      
      console.log('Rendering customer orders for user:', u.id, u.email);
      const orders = await getOrders();
      console.log('All orders from database:', orders.length);
      console.log('Orders data:', orders);
      
      // Filter orders by customer_id and ensure they have items
      const all = orders.filter(o => {
        const hasItems = o.items && o.items.length > 0;
        const isUserOrder = o.customer_id === u.id;
        console.log(`Order ${o.id}: customer_id=${o.customer_id}, user_id=${u.id}, hasItems=${hasItems}, isUserOrder=${isUserOrder}`);
        return isUserOrder && hasItems;
      }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log('Filtered orders for user:', all.length);
      console.log('Filtered orders data:', all);
      
      const current = all.filter(o => o.status !== 'delivered');
      let previous = all.filter(o => o.status === 'delivered');
      
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
        if (range==='7d') inRange = (now - new Date(o.created_at)) <= 7*24*60*60*1000;
        else if (range==='30d') inRange = (now - new Date(o.created_at)) <= 30*24*60*60*1000;
        else if (range==='year') inRange = (new Date(o.created_at).getFullYear() === now.getFullYear());
        let byRating = true;
        if (rating==='rated') byRating = !!(o.rating_stars || o.rating);
        else if (rating==='unrated') byRating = !(o.rating_stars || o.rating);
        return inRange && byRating;
      });
      const curEl = document.getElementById('orders-current');
      const prevEl = document.getElementById('orders-previous');
      const render = async (o)=>{
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
        // Get order status history from database
        let statusHistory = '';
        if (window.supabaseService) {
          try {
            const history = await getOrderStatusHistory(o.id);
            if (history && history.length > 0) {
              statusHistory = `<div class="order-timeline" style="margin-top:.5rem;display:flex;flex-direction:column;gap:.25rem">
                ${history.map(h => `
                  <div class="timeline-item" style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;background:#f8f9fa;border-radius:.5rem;margin-bottom:.25rem">
                    <div>
                      <div class="timeline-status" style="font-weight:600;color:#333">${h.status_display}</div>
                      ${h.notes ? `<div class="timeline-notes" style="font-size:.8rem;color:#666">${h.notes}</div>` : ''}
                    </div>
                    <div class="timeline-time" style="font-size:.8rem;color:#999">${new Date(h.created_at).toLocaleString()}</div>
                  </div>
                `).join('')}
              </div>`;
            }
          } catch (error) {
            console.warn('Failed to fetch order status history:', error);
          }
        }
        
        // Fallback to local history if no database history
        const hist = (o.history||[]).slice().sort((a,b)=>a.ts-b.ts).map(h=>`<div class="pill">${new Date(h.ts).toLocaleString()} – ${h.status.replaceAll('_',' ')}</div>`).join('');
        const timeline = statusHistory || (o.status==='delivered' ? `<div class="order-timeline" style="margin-top:.5rem;display:flex;flex-direction:column;gap:.25rem">${hist}</div>` : '');
        
        const actions = [
          (o.status==='delivered' && !(o.rating_stars || o.rating)) ? `<button class="btn btn-primary" onclick="app.openRating('${o.id}')">Rate Order</button>` : ''
        ].filter(Boolean).join('');
        
        // Render ordered products - only if order has items
        const products = (o.items && o.items.length > 0) ? (o.items || []).map(item => {
          return `<div class="order-product-item">
            <img src="${item.product_image || ''}" alt="${item.product_name}" class="order-product-image">
            <div class="order-product-details">
              <div class="order-product-name">${item.product_name}</div>
              <div class="order-product-price">₹${item.product_price} × ${item.quantity}</div>
              <div class="order-product-total">Total: ₹${item.total_price}</div>
            </div>
          </div>`;
        }).join('') : '';
        
        const orderProducts = products ? `<div class="order-products">
          <h4 style="margin:0 0 0.75rem 0;color:#374151;font-size:1rem">Ordered Products:</h4>
          <div class="order-products-list">${products}</div>
        </div>` : '';
        
        return `<div class="order-card">
          <div class="order-meta">
            <div><strong>Order #${o.order_number || o.id}</strong> – ₹${o.total_amount || o.total}</div>
            ${orderProducts}
            ${stepper}
            ${timeline}
          </div>
          <div class="order-actions">${actions}</div>
        </div>`;
      };
      // Handle async render function
      if (current.length) {
        const currentHtml = await Promise.all(current.map(render));
        curEl.innerHTML = currentHtml.join('');
      } else {
        curEl.innerHTML = `<div class="empty-orders-state">
          <i class="fas fa-shopping-bag"></i>
          <h3>No Current Orders</h3>
          <p>You don't have any active orders at the moment.</p>
          <button class="btn btn-primary" onclick="app.switchTab('products')">Start Shopping</button>
        </div>`;
      }
      
      if (previous.length) {
        const previousHtml = await Promise.all(previous.map(render));
        prevEl.innerHTML = previousHtml.join('');
      } else {
        prevEl.innerHTML = `<div class="empty-orders-state">
          <i class="fas fa-history"></i>
          <h3>No Order History</h3>
          <p>You haven't placed any orders yet.</p>
          <button class="btn btn-primary" onclick="app.switchTab('products')">Start Shopping</button>
        </div>`;
      }
      // ratings panel removed from orders view per request
      this.renderCustomerNotifications(u.id);
    }

    // Tracking functionality removed for cleaner UI
  
    // Map tracking removed for cleaner UI
  
    // Map marker functions removed for cleaner UI

    async renderCustomerNotifications(userId){
      const box = document.getElementById('customer-notifications');
      if (!box) return;
      const n = await getNotifications(userId);
      box.innerHTML = n.slice(-5).reverse().map(m=>`<div class="cart-item">${new Date(m.created_at).toLocaleTimeString()} – ${m.message}</div>`).join('') || '';
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
    async submitRating(orderId){
      const u = getCurrentUser();
      const stars = Math.max(1, Math.min(5, parseInt(rt_stars.value||'5')));
      const feedback = (rt_feedback.value||'').trim();
      await saveRating(orderId, u.id, stars, feedback);
      this.closeModal();
      await this.renderCustomerOrders();
    }
    
  
    // 👨‍💼 ADMIN SIDE
    async updateAdminStats() {
      const products = await getProducts();
      const orders = await getOrders();
      const agents = await getDeliveryAgents();
      document.getElementById("total-products").textContent = products.length;
      document.getElementById("total-orders").textContent = orders.length;
      document.getElementById("total-agents").textContent = agents.length;
    }
  
    async renderAdmin() {
      // Update Razorpay status
      const razorpayStatus = document.getElementById('razorpay-status');
      if (razorpayStatus) {
        if (window.Razorpay && window.RAZORPAY_KEY) {
          razorpayStatus.textContent = 'Ready';
          razorpayStatus.style.color = '#10b981';
        } else {
          razorpayStatus.textContent = 'Error';
          razorpayStatus.style.color = '#ef4444';
        }
      }

      const grid = document.getElementById("admin-products-grid");
      const products = await getProducts();
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
        // Homepage cards are now static - no editing needed
      }
  
      const agentList = document.getElementById("admin-agents-list");
      const agents = await getDeliveryAgents();
      agentList.innerHTML = agents
        .map((a) => `<div class="cart-item">${a.name} – ${a.email}</div>`)
        .join("");

      

      // recent orders
      const ro = document.getElementById('admin-recent-orders');
      if (ro) {
        const orders = await getOrders();
        const recentOrders = orders.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10);
        ro.innerHTML = recentOrders.map(o=>`<div class="cart-item"><div><strong>#${o.id}</strong> – ${o.customer_name||o.customer_id} – ₹${o.total}</div><div>${o.status}</div></div>`).join('') || '<p>No orders</p>';
      }

      // top-selling products (by quantity)
      const tp = document.getElementById('admin-top-products');
      if (tp) {
        const orders = await getOrders();
        const tally = {};
        orders.forEach(o=> (o.items||[]).forEach(it=>{ tally[it.productId]=(tally[it.productId]||0)+it.quantity; }));
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
        const logs = await getSearchLogs();
        const sortedLogs = logs.slice().sort((a,b)=>b.count-a.count).slice(0,15);
        sl.innerHTML = sortedLogs.map(l=>`<div class=\"cart-item\"><div><strong>${l.term}</strong></div><div>Searched: ${l.count}×</div></div>`).join('') || '<p>No search data</p>';
      }

      // charts
      if (window.Chart) {
        const orders = await getOrders();
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

    // Homepage cards are now static - no editing functionality needed

    // Homepage card functions removed - cards are now static

    // Homepage card functions removed - cards are now static

    // Homepage card functions removed - cards are now static

    // Homepage card functions removed - cards are now static

    
  
    async openProductModal(id) {
      const o = document.getElementById("modal-overlay"),
        c = document.getElementById("modal-content");
      const products = await getProducts();
      const p = id ? products.find((x) => x.id === id) : null;
  
      c.innerHTML = `
        <div class="modal-header"><h3>${p ? "Edit" : "Add"} Product</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Name</label><input id="p_name" value="${p ? p.name : ""}"></div>
          <div class="form-group"><label>Description</label><input id="p_desc" value="${p ? p.description : ""}"></div>
          <div class="form-group"><label>Price (₹)</label><input id="p_price" type="number" value="${p ? p.price : ""}"></div>
          <div class="form-group"><label>Stock</label><input id="p_stock" type="number" value="${p ? p.stock : ""}"></div>
          <div class="form-group"><label>Status</label>
            <select id="p_status">
              <option value="in" ${p && p.stockStatus !== "out" ? "selected" : ""}>In Stock</option>
              <option value="out" ${p && p.stockStatus === "out" ? "selected" : ""}>Out of Stock</option>
            </select>
          </div>
          <div class="form-group"><label>Category</label>
            <select id="p_cat">
              <option>Fruits and Vegetables</option>
              <option>Grocery</option>
              <option>Stationery</option>
            </select>
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
  
    async saveProduct(id) {
      const n = p_name.value.trim(),
        d = p_desc.value.trim(),
        price = parseInt(p_price.value),
        stock = parseInt(p_stock.value),
        cat = p_cat.value,
        status = p_status.value,
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
      };
  
      console.log('Saving product:', prod);
      console.log('Supabase service available:', !!window.supabaseService);
      
      if (id) {
        console.log('Updating existing product');
        await updateProduct(prod);
      } else {
        console.log('Adding new product');
        await addProduct(prod);
      }
      
      // Verify the product was saved by checking both sources
      console.log('Verifying product was saved...');
      const allProducts = await getProducts();
      console.log('Total products after save:', allProducts.length);
      const savedProduct = allProducts.find(p => p.id === prod.id);
      console.log('Product found after save:', !!savedProduct);
      if (savedProduct) {
        console.log('Saved product:', savedProduct);
        console.log('Full saved product:', savedProduct);
      } else {
        console.error('Product not found after save!');
      }
      
      // Also check localStorage directly
      const localStorageProducts = getLS('products') || [];
      const localStorageProduct = localStorageProducts.find(p => p.id === prod.id);
      if (localStorageProduct) {
        console.log('LocalStorage product:', localStorageProduct);
      }
      
      this.closeModal();
      await this.updateAdminStats();
      await this.renderAdmin();
      await this.renderProducts();
      alert("Product saved successfully! Check console for verification.");
    }
  
    openAgentModal() {
      const o = document.getElementById("modal-overlay"),
        c = document.getElementById("modal-content");
      c.innerHTML = `<div class="modal-header"><h3>Add Delivery Agent</h3><button class="modal-close" onclick="app.closeModal()">&times;</button></div>
        <div class="modal-body"><div class="form-group"><label>Name</label><input id="ag_name"></div><div class="form-group"><label>Email</label><input id="ag_email" type="email"></div><div class="form-group"><label>Password</label><input id="ag_pass" type="password"></div></div>
        <div class="modal-footer"><button class="btn btn-outline" onclick="app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="app.saveAgent()">Save</button></div>`;
      o.style.display = "flex";
    }
  
    async saveAgent() {
      const n = ag_name.value.trim(),
        e = ag_email.value.trim(),
        p = ag_pass.value.trim() || "delivery123";
      if (!n || !e) return alert("Fill all fields");
      const id = idGen();
      await addAgent({ id, name: n, email: e, status: "active" }, { id, name: n, email: e, password: p, role: "delivery" });
      this.closeModal();
      await this.updateAdminStats();
      await this.renderAdmin();
      alert("Agent added!");
    }
  
    async renderDelivery() {
      const u = getCurrentUser();
      const o = await getOrders();
      // Assigned: all not-delivered orders that are pending (unassigned) or assigned to this agent
      const list = o.filter((x) => x.status !== 'delivered' && (x.status === "pending" || x.delivery_agent_id === u.id));
      // Handle async map function
      if (list.length > 0) {
        const listHtml = await Promise.all(list.map(async (x) => {
          const s = x.status || 'pending';
          const stepIdx = s==='pending'?0:s==='picked_up'?1:s==='out_for_delivery'?2:3;
          const step = (label, idx, cls)=>`<div class="step ${cls}"><div class="dot"></div><div>${label}</div></div>`;
          const sep = '<div class="step-sep"></div>';
          const stepper = `<div class="stepper">${
            step('Pending',0, stepIdx>0?'done':stepIdx===0?'active':'')+sep+
            step('Picked up',1, stepIdx>1?'done':stepIdx===1?'active':'')+sep+
            step('Out for delivery',2, stepIdx>2?'done':stepIdx===2?'active':'')+sep+
            step('Delivered',3, stepIdx===3?'done':'')
          }</div>`;
          const products = await getProducts();
          const thumbs = (x.items||[]).map(it=>{
            const p = products.find(pp=>pp.id===it.productId);
            return p && p.image ? `<img class=\"thumb\" src=\"${p.image}\" alt=\"${p.name}\">` : '';
          }).join('');
          const thumbList = thumbs ? `<div class=\"thumb-list\">${thumbs}</div>` : '';
          const contact = x.contact || {};
          const addr = [contact.address, contact.landmark, contact.pincode].filter(Boolean).join(', ');
          const rating = x.rating ? `${'★'.repeat(x.rating.stars)}${'☆'.repeat(5-x.rating.stars)}` : '';
          return `<div class="delivery-order-card">
            <div class="delivery-order-header">
              <div class="delivery-order-id">Order #${x.id}</div>
              <div class="delivery-order-status ${s}">${s.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div class="delivery-order-details">
              <div class="delivery-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${x.total}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-user"></i>
                <span>${x.customer_name || 'Customer'}</span>
              </div>
              ${contact.mobile ? `<div class="delivery-detail-item">
                <i class="fas fa-phone"></i>
                <span>${contact.mobile}</span>
              </div>` : ''}
              ${thumbList}
            </div>
            ${addr ? `<div class="delivery-order-address">
              <strong>Delivery Address:</strong>
              ${addr}
            </div>` : ''}
            <div class="delivery-order-timeline">
              ${stepper}
            </div>
            ${rating ? `<div class="delivery-detail-item">
              <i class="fas fa-star"></i>
              <span>${rating} ${x.rating.feedback ? `– ${x.rating.feedback}` : ''}</span>
            </div>` : ''}
            <div class="delivery-order-actions">
              <button class="delivery-action-btn secondary" onclick="app.viewAddress('${x.id}')">
                <i class="fas fa-map-marker-alt"></i>
                View Address
              </button>
              <button class="delivery-action-btn primary" ${stepIdx!==0?'disabled':''} onclick="app.flowPickup('${x.id}')">
                <i class="fas fa-hand-paper"></i>
                Pick Up
              </button>
              <button class="delivery-action-btn primary" ${stepIdx!==1?'disabled':''} onclick="app.flowOutForDelivery('${x.id}')">
                <i class="fas fa-truck"></i>
                Out for Delivery
              </button>
              <button class="delivery-action-btn primary" ${stepIdx!==2?'disabled':''} onclick="app.flowDelivered('${x.id}')">
                <i class="fas fa-check"></i>
                Delivered
              </button>
            </div>
          </div>`;
        }));
        document.getElementById("assigned-orders").innerHTML = listHtml.join('');
      } else {
        document.getElementById("assigned-orders").innerHTML = `<div class="delivery-empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>No Assigned Orders</h3>
          <p>You don't have any orders assigned at the moment.</p>
        </div>`;
      }

      // delivered history
      const hist = o.filter(x=>x.delivery_agent_id===u.id && x.status==='delivered').sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10);
      const deliveredBox = document.getElementById('delivered-orders');
      if (deliveredBox) {
        deliveredBox.innerHTML = hist.length > 0 ? hist.map(h=>{
          const thumbs = (h.items||[]).map(it=>{
            const p = products.find(pp=>pp.id===it.productId);
            return p && p.image ? `<img class=\"thumb\" src=\"${p.image}\" alt=\"${p.name}\">` : '';
          }).join('');
          const thumbList = thumbs ? `<div class=\"thumb-list\">${thumbs}</div>` : '';
          const rating = h.rating ? `${'★'.repeat(h.rating.stars)}${'☆'.repeat(5-h.rating.stars)}${h.rating.feedback?` <span class=\\"muted\\">– ${h.rating.feedback}</span>`:''}` : '<span class=\\"muted\\">No rating</span>';
          return `<div class="delivery-order-card">
            <div class="delivery-order-header">
              <div class="delivery-order-id">Order #${h.id}</div>
              <div class="delivery-order-status delivered">DELIVERED</div>
            </div>
            <div class="delivery-order-details">
              <div class="delivery-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${h.total}</span>
              </div>
              <div class="delivery-detail-item">
                <i class="fas fa-calendar-check"></i>
                <span>Delivered on ${new Date(h.date).toLocaleString()}</span>
              </div>
              ${thumbList}
            </div>
            <div class="delivery-detail-item">
              <i class="fas fa-star"></i>
              <span>${rating}</span>
            </div>
          </div>`;
        }).join('') : `<div class="delivery-empty-state">
          <i class="fas fa-check-circle"></i>
          <h3>No Delivered Orders</h3>
          <p>You haven't delivered any orders yet.</p>
        </div>`;
      }
    }

    // Delivery map functions removed for cleaner UI

    // Map refresh functions removed for cleaner UI

    // Map marker functions removed for cleaner UI

    // Map view functions removed for cleaner UI

    async viewAddress(orderId){
      const orders = await getOrders();
      const o = orders.find(x=>x.id===orderId);
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

    // Geolocation functions removed for cleaner UI

    async flowPickup(orderId){
      console.log('Processing pickup for order:', orderId);
      const orders = await getOrders();
      const o = orders.find(x=>x.id===orderId); 
      if(!o || (o.status && o.status!=='pending')) {
        console.log('Order not found or not in pending status');
        return;
      }
      
      const u = getCurrentUser(); 
      if (!u) {
        console.log('No user logged in');
        return;
      }
      
      try {
        // Assign order to agent if not already assigned
        if (!o.delivery_agent_id) {
          console.log('Assigning order to agent:', u.id);
          await assignOrderToAgent(orderId, u.id);
        }
        
        // Update order status to picked_up
        console.log('Updating order status to picked_up');
        await updateOrderStatus(orderId,'picked_up'); 
        
        // Send notification to customer
        if(o.customer_id) {
          await pushNotification(o.customer_id,'Your order was picked up by delivery agent.');
        }
        
        // Refresh delivery dashboard
        await this.renderDelivery(); 
        
        console.log('Pickup completed successfully');
      } catch (error) {
        console.error('Error in flowPickup:', error);
        alert('Error updating order status. Please try again.');
      }
    }
    
    async flowOutForDelivery(orderId){
      console.log('Processing out for delivery for order:', orderId);
      const orders = await getOrders();
      const o = orders.find(x=>x.id===orderId); 
      if(!o || o.status!=='picked_up') {
        console.log('Order not found or not in picked_up status');
        return;
      }
      
      try {
        // Update order status to out_for_delivery
        console.log('Updating order status to out_for_delivery');
        await updateOrderStatus(orderId,'out_for_delivery'); 
        
        // Send notification to customer
        if(o.customer_id) {
          await pushNotification(o.customer_id,'Your order is out for delivery and will arrive soon.');
        }
        
        // Refresh delivery dashboard
        await this.renderDelivery(); 
        
        console.log('Out for delivery completed successfully');
      } catch (error) {
        console.error('Error in flowOutForDelivery:', error);
        alert('Error updating order status. Please try again.');
      }
    }
    
    async flowDelivered(orderId){
      console.log('Processing delivered for order:', orderId);
      const orders = await getOrders();
      const o = orders.find(x=>x.id===orderId); 
      if(!o || o.status!=='out_for_delivery') {
        console.log('Order not found or not in out_for_delivery status');
        return;
      }
      
      try {
        // Update order status to delivered
        console.log('Updating order status to delivered');
        await updateOrderStatus(orderId,'delivered'); 
        
        // Send notification to customer
        if(o.customer_id) {
          await pushNotification(o.customer_id,'Your order has been delivered successfully. Thank you for shopping with us!');
        }
        
        // Refresh delivery dashboard
        await this.renderDelivery(); 
        
        console.log('Delivery completed successfully');
      } catch (error) {
        console.error('Error in flowDelivered:', error);
        alert('Error updating order status. Please try again.');
      }
    }

    // Route drawing functions removed for cleaner UI
  
    async switchTab(tab) {
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
      if (tab === "cart") await this.updateCart();
      if (tab === "products" || tab === "admin-products") {
        await this.renderProducts();
        await this.renderAdmin();
      }
      if (tab === "orders") await this.renderCustomerOrders();
    }

    async goToHome() {
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
      await this.switchTab('products');
      
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
  }

  // Emergency fallback - hide loading and show login after 1 second
  setTimeout(() => {
    const loadingEl = document.getElementById("loading");
    const loginPage = document.getElementById("login-page");
    if (loadingEl && loadingEl.style.display !== "none") {
      console.warn('Emergency fallback: hiding loading spinner');
      loadingEl.style.display = "none";
      if (loginPage) loginPage.style.display = "block";
    }
  }, 1000);

  // Initialize app when DOM is ready
  function initApp() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.app = new MangoMartApp();
      });
    } else {
      window.app = new MangoMartApp();
    }
  }

  // Start the app
  initApp();
  