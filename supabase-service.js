// Supabase Service Layer - Replaces localStorage functions with Supabase database calls

class SupabaseService {
  constructor() {
    this.client = window.supabaseClient;
    if (!this.client) {
      console.error('Supabase client not initialized. Make sure supabase-config.js is loaded first.');
    }
  }

  // Authentication methods
  async signIn(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        return null;
      }
      
      console.log('Supabase sign in successful:', data.user);
      return data.user;
    } catch (error) {
      console.error('Supabase sign in error:', error);
      return null;
    }
  }

  async signUp(email, password, userData) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error('Supabase sign up error:', error);
        return null;
      }
      
      console.log('Supabase sign up successful:', data.user);
      return data.user;
    } catch (error) {
      console.error('Supabase sign up error:', error);
      return null;
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        return false;
      }
      console.log('Supabase sign out successful');
      return true;
    } catch (error) {
      console.error('Supabase sign out error:', error);
      return false;
    }
  }

  getCurrentUser() {
    try {
      const { data: { user } } = this.client.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Helper method to handle Supabase responses
  async handleResponse(operation, errorMessage = 'Operation failed') {
    try {
      const { data, error } = await operation;
      if (error) {
        console.error(errorMessage, error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        // Don't throw error, return empty result to allow fallback
        return null;
      }
      console.log('Supabase operation successful, data:', data);
      return data;
    } catch (error) {
      console.error(errorMessage, error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      // Don't throw error, return null to allow fallback
      return null;
    }
  }

  // Helper method to convert camelCase to snake_case for database
  toSnakeCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      converted[snakeKey] = value;
    }
    return converted;
  }

  // Helper method to convert snake_case to camelCase for JavaScript
  toCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      converted[camelKey] = value;
    }
    return converted;
  }

  // PRODUCTS
  async getProducts() {
    try {
      const data = await this.handleResponse(
        this.client.from('products').select('*').order('created_at', { ascending: false }),
        'Failed to fetch products'
      );
      // Convert snake_case to camelCase
      return data ? data.map(product => this.toCamelCase(product)) : [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async addProduct(product) {
    // Convert camelCase to snake_case for database
    const dbProduct = this.toSnakeCase(product);
    return await this.handleResponse(
      this.client.from('products').insert([dbProduct]),
      'Failed to add product'
    );
  }

  async updateProduct(product) {
    console.log('Supabase updateProduct called with:', product);
    // Convert camelCase to snake_case for database
    const dbProduct = this.toSnakeCase(product);
    console.log('Converted to snake_case:', dbProduct);
    
    const result = await this.handleResponse(
      this.client.from('products').update(dbProduct).eq('id', product.id),
      'Failed to update product'
    );
    
    console.log('Supabase updateProduct handleResponse result:', result);
    return result;
  }

  async deleteProduct(productId) {
    return await this.handleResponse(
      this.client.from('products').delete().eq('id', productId),
      'Failed to delete product'
    );
  }

  // ORDERS
  async getOrders() {
    try {
      const data = await this.handleResponse(
        this.client.from('order_details').select('*').order('created_at', { ascending: false }),
        'Failed to fetch orders'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  async addOrder(orderData) {
    try {
      // Generate order number
      const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      // Insert order
      const order = {
        order_number: orderNumber,
        customer_id: orderData.customer_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        total_amount: orderData.total_amount,
        status: orderData.status || 'pending',
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method,
        payment_reference: orderData.payment_reference,
        delivery_address: orderData.delivery_address,
        delivery_landmark: orderData.delivery_landmark,
        delivery_pincode: orderData.delivery_pincode,
        delivery_latitude: orderData.delivery_latitude,
        delivery_longitude: orderData.delivery_longitude,
        delivery_notes: orderData.delivery_notes,
        order_notes: orderData.order_notes
      };

      const orderResult = await this.handleResponse(
        this.client.from('orders').insert([order]).select('id').single(),
        'Failed to add order'
      );

      if (orderResult && orderData.items) {
        // Insert order items
        const orderItems = orderData.items.map(item => ({
          order_id: orderResult.id,
          product_id: item.productId,
          product_name: item.productName,
          product_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity
        }));

        await this.handleResponse(
          this.client.from('order_items').insert(orderItems),
          'Failed to add order items'
        );
      }

      return orderResult;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }

  async updateOrder(orderId, updates) {
    return await this.handleResponse(
      this.client.from('orders').update(updates).eq('id', orderId),
      'Failed to update order'
    );
  }

  async assignOrderToAgent(orderId, agentId) {
    return await this.updateOrder(orderId, {
      delivery_agent_id: agentId,
      status: 'pending',
      updated_at: new Date().toISOString()
    });
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log('Updating order status:', { orderId, status });
      
      // Get current order to preserve history
      const order = await this.getOrderById(orderId);
      if (!order) {
        console.error('Order not found:', orderId);
        return null;
      }

      // Update order with new status
      const updates = {
        status,
        updated_at: new Date().toISOString()
      };

      // If status is delivered, set delivered_at timestamp
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      const result = await this.handleResponse(
        this.client.from('orders').update(updates).eq('id', orderId),
        'Failed to update order status'
      );

      // The trigger will automatically create the status history record
      console.log('Order status updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  // Get order status history for a specific order
  async getOrderStatusHistory(orderId) {
    try {
      const data = await this.handleResponse(
        this.client.from('order_status_history')
          .select(`
            id,
            status,
            status_display,
            notes,
            created_at,
            created_by,
            users!created_by(name, email)
          `)
          .eq('order_id', orderId)
          .order('created_at', { ascending: true }),
        'Failed to fetch order status history'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting order status history:', error);
      return [];
    }
  }

  // Get orders for a specific customer (with proper filtering)
  async getCustomerOrders(customerId) {
    try {
      const data = await this.handleResponse(
        this.client.from('order_details')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false }),
        'Failed to fetch customer orders'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  }

  async getOrderById(orderId) {
    try {
      const data = await this.handleResponse(
        this.client.from('orders').select('*').eq('id', orderId).single(),
        'Failed to fetch order'
      );
      return data;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  // USERS
  async getUsers() {
    try {
      const data = await this.handleResponse(
        this.client.from('users').select('*').order('created_at', { ascending: false }),
        'Failed to fetch users'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async addUser(user) {
    try {
      console.log('Adding user to Supabase:', user.email);
      const result = await this.handleResponse(
        this.client.from('users').insert([user]).select().single(),
        'Failed to add user'
      );
      console.log('User added successfully:', result);
      return result;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }

  async updateUser(userId, updates) {
    try {
      console.log('Updating user in Supabase:', userId, updates);
      const result = await this.handleResponse(
        this.client.from('users').update(updates).eq('id', userId),
        'Failed to update user'
      );
      console.log('User updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async getUserByEmail(email) {
    try {
      console.log('Looking up user by email in Supabase:', email);
      const data = await this.handleResponse(
        this.client.from('users').select('*').eq('email', email).single(),
        'Failed to fetch user'
      );
      console.log('User lookup result:', data ? 'Found' : 'Not found');
      return data;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // DELIVERY AGENTS
  async getDeliveryAgents() {
    try {
      const data = await this.handleResponse(
        this.client.from('delivery_agents').select('*').order('created_at', { ascending: false }),
        'Failed to fetch delivery agents'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting delivery agents:', error);
      return [];
    }
  }

  async addDeliveryAgent(agent) {
    return await this.handleResponse(
      this.client.from('delivery_agents').insert([agent]),
      'Failed to add delivery agent'
    );
  }

  // HOMEPAGE CARDS
  async getHomepageCards() {
    try {
      const data = await this.handleResponse(
        this.client.from('homepage_cards').select('*').order('created_at', { ascending: false }),
        'Failed to fetch homepage cards'
      );
      // Convert snake_case to camelCase
      return data ? data.map(card => this.toCamelCase(card)) : [];
    } catch (error) {
      console.error('Error getting homepage cards:', error);
      return [];
    }
  }

  async saveHomepageCards(cards) {
    // Delete existing cards and insert new ones
    await this.client.from('homepage_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (cards && cards.length > 0) {
      // Convert camelCase to snake_case for database
      const dbCards = cards.map(card => this.toSnakeCase(card));
      return await this.handleResponse(
        this.client.from('homepage_cards').insert(dbCards),
        'Failed to save homepage cards'
      );
    }
  }

  // AGENT LOCATIONS
  async setAgentLocation(agentId, coords) {
    return await this.handleResponse(
      this.client.from('agent_locations').insert([{
        agent_id: agentId,
        latitude: coords.lat,
        longitude: coords.lng,
        timestamp: new Date().toISOString()
      }]),
      'Failed to set agent location'
    );
  }

  async getAgentLocation(agentId) {
    try {
      const data = await this.handleResponse(
        this.client.from('agent_locations')
          .select('latitude, longitude, timestamp')
          .eq('agent_id', agentId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single(),
        'Failed to fetch agent location'
      );
      
      if (data) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          ts: new Date(data.timestamp).getTime()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting agent location:', error);
      return null;
    }
  }

  // NOTIFICATIONS
  async pushNotification(userId, message) {
    return await this.handleResponse(
      this.client.from('notifications').insert([{
        user_id: userId,
        message: message
      }]),
      'Failed to push notification'
    );
  }

  async getNotifications(userId) {
    try {
      const data = await this.handleResponse(
        this.client.from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50),
        'Failed to fetch notifications'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // SEARCH LOGS
  async logSearchTerm(term) {
    const trimmedTerm = (term || '').trim().toLowerCase();
    if (!trimmedTerm) return;

    try {
      // Check if term already exists
      const { data: existing } = await this.client
        .from('search_logs')
        .select('*')
        .eq('term', trimmedTerm)
        .single();

      if (existing) {
        // Update count
        return await this.handleResponse(
          this.client.from('search_logs')
            .update({ 
              count: existing.count + 1,
              last_searched: new Date().toISOString()
            })
            .eq('id', existing.id),
          'Failed to update search log'
        );
      } else {
        // Insert new term
        return await this.handleResponse(
          this.client.from('search_logs').insert([{
            term: trimmedTerm,
            count: 1
          }]),
          'Failed to log search term'
        );
      }
    } catch (error) {
      console.error('Error logging search term:', error);
    }
  }

  async getSearchLogs() {
    try {
      const data = await this.handleResponse(
        this.client.from('search_logs')
          .select('*')
          .order('count', { ascending: false })
          .limit(100),
        'Failed to fetch search logs'
      );
      return data || [];
    } catch (error) {
      console.error('Error getting search logs:', error);
      return [];
    }
  }

  // CATEGORIES
  async getCategories() {
    try {
      const data = await this.handleResponse(
        this.client.from('categories').select('*').order('name'),
        'Failed to fetch categories'
      );
      return data ? data.map(c => c.name) : [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async addCategory(name) {
    return await this.handleResponse(
      this.client.from('categories').insert([{ name }]),
      'Failed to add category'
    );
  }

  // RATINGS
  async saveRating(orderId, customerId, rating, feedback) {
    const ratingData = {
      stars: rating,
      feedback: feedback,
      ts: Date.now()
    };

    return await this.updateOrder(orderId, {
      rating: ratingData,
      updated_at: new Date().toISOString()
    });
  }

  // CART - Database-based cart management
  async getCart(userId) {
    try {
      const data = await this.handleResponse(
        this.client.from('cart')
          .select(`
            id,
            quantity,
            product_id,
            products (
              id,
              name,
              price,
              image,
              stock_status
            )
          `)
          .eq('user_id', userId),
        'Failed to fetch cart'
      );
      
      if (!data) return [];
      
      // Convert to the format expected by the app
      return data.map(item => ({
        productId: item.product_id,
        productName: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        image: item.products.image,
        stockStatus: item.products.stock_status
      }));
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  async addToCart(userId, productId, quantity = 1) {
    try {
      // Check if item already exists in cart
      const { data: existing } = await this.client
        .from('cart')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Update quantity
        return await this.handleResponse(
          this.client.from('cart')
            .update({ 
              quantity: existing.quantity + quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id),
          'Failed to update cart item'
        );
      } else {
        // Add new item
        return await this.handleResponse(
          this.client.from('cart').insert([{
            user_id: userId,
            product_id: productId,
            quantity: quantity
          }]),
          'Failed to add to cart'
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  async updateCartItem(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId);
    }

    try {
      return await this.handleResponse(
        this.client.from('cart')
          .update({ 
            quantity: quantity,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', productId),
        'Failed to update cart item'
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
  }

  async removeFromCart(userId, productId) {
    try {
      return await this.handleResponse(
        this.client.from('cart')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId),
        'Failed to remove from cart'
      );
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  }

  async clearCart(userId) {
    try {
      return await this.handleResponse(
        this.client.from('cart')
          .delete()
          .eq('user_id', userId),
        'Failed to clear cart'
      );
    } catch (error) {
      console.error('Error clearing cart:', error);
      return null;
    }
  }

  // Fallback methods for localStorage compatibility
  getCartFallback() {
    return getLS('cart') || [];
  }

  saveCartFallback(cart) {
    setLS('cart', cart);
  }

  clearCartFallback() {
    localStorage.removeItem('cart');
  }
}

// Test Supabase connection and create global instance
async function initializeSupabaseService() {
  try {
    const service = new SupabaseService();
    // Test connection with timeout
    const testPromise = service.client.from('products').select('id').limit(1);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    await Promise.race([testPromise, timeoutPromise]);
    window.supabaseService = service;
    console.log('Supabase service initialized successfully');
  } catch (error) {
    console.warn('Supabase connection failed, using localStorage fallback:', error);
    // Don't set window.supabaseService, so dataservice.js will use localStorage
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupabaseService);
} else {
  initializeSupabaseService();
}
