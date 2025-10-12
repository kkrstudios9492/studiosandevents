var currentUser = null;

function initAuth() {
  const d = getLS('currentUser');
  if (d) {
    currentUser = d;
    console.log('User session restored from localStorage:', d.email);
    
    // Try to authenticate with Supabase if user was previously authenticated
    if (window.supabaseService && d.supabaseUser) {
      // Check if user is still authenticated with Supabase
      const supabaseUser = window.supabaseService.getCurrentUser();
      if (!supabaseUser) {
        console.log('User session expired, need to re-authenticate');
        // Try to re-authenticate
        window.supabaseService.signIn(d.email, d.password).then(result => {
          if (result) {
            console.log('User re-authenticated with Supabase');
          } else {
            console.log('Failed to re-authenticate with Supabase');
          }
        }).catch(error => {
          console.error('Re-authentication error:', error);
        });
      } else {
        console.log('User still authenticated with Supabase');
      }
    }
  }
}

async function doLogin(email, password) {
  try {
    console.log('Attempting login for email:', email);
    
    // First try Supabase authentication
    let supabaseUser = null;
    if (window.supabaseService) {
      try {
        supabaseUser = await window.supabaseService.signIn(email, password);
        console.log('Supabase authentication successful:', supabaseUser ? 'Yes' : 'No');
      } catch (error) {
        console.warn('Supabase authentication failed:', error);
      }
    }
    
    // If Supabase auth fails, try database lookup
    let user = null;
    if (window.supabaseService && !supabaseUser) {
      try {
        user = await window.supabaseService.getUserByEmail(email);
        console.log('User found in database:', user ? 'Yes' : 'No');
        
        // If user found in database, try to sign them in with Supabase
        if (user && user.password === password) {
          supabaseUser = await window.supabaseService.signIn(email, password);
          console.log('Supabase sign in after database lookup:', supabaseUser ? 'Yes' : 'No');
        }
      } catch (error) {
        console.warn('Database login failed, trying localStorage:', error);
      }
    }
    
    // If not found in database, try localStorage
    if (!user && !supabaseUser) {
      const users = await getUsers();
      user = users.find(x => x.email === email && x.password === password);
      console.log('User found in localStorage:', user ? 'Yes' : 'No');
    }
    
    // Verify password and set current user
    if ((user && user.password === password) || supabaseUser) {
      const finalUser = supabaseUser || user;
      currentUser = {
        id: finalUser.id || finalUser.user_metadata?.id || idGen(),
        email: finalUser.email || finalUser.user_metadata?.email,
        name: finalUser.name || finalUser.user_metadata?.name || finalUser.email?.split('@')[0],
        phone: finalUser.phone || finalUser.user_metadata?.phone || '',
        role: finalUser.role || finalUser.user_metadata?.role || 'customer',
        password: finalUser.password || '',
        supabaseUser: supabaseUser ? true : false
      };
      
      setLS('currentUser', currentUser);
      console.log('Login successful for:', currentUser.email);
      
      // Update last login timestamp in database
      if (window.supabaseService) {
        try {
          await window.supabaseService.updateUser(currentUser.id, {
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } catch (error) {
          console.warn('Failed to update last login timestamp:', error);
        }
      }
      
      return true;
    }
    
    console.log('Login failed: Invalid credentials');
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

async function doRegister(name, email, password) {
  try {
    console.log('Attempting registration for email:', email);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Create new user
    const newUser = {
      id: idGen(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'customer',
      phone: null,
      address: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    
    console.log('Creating new user:', newUser.email);
    
    // Save user to database
    if (window.supabaseService) {
      try {
        // Try Supabase authentication first
        let supabaseUser = null;
        try {
          supabaseUser = await window.supabaseService.signUp(email, password, {
            name: name,
            role: 'customer'
          });
          console.log('Supabase registration successful:', supabaseUser ? 'Yes' : 'No');
          
          if (supabaseUser) {
            // Update the user ID to match Supabase user ID
            newUser.id = supabaseUser.id;
          }
        } catch (error) {
          console.warn('Supabase registration failed, using database only:', error);
        }
        
        const result = await window.supabaseService.addUser(newUser);
        console.log('User registered successfully in database:', result);
      } catch (error) {
        console.warn('Failed to save user to database, using localStorage fallback:', error);
        // Fallback to localStorage
        const users = await getUsers();
        users.push(newUser);
        await saveUsers(users);
        console.log('User saved to localStorage fallback');
      }
    } else {
      // Use localStorage fallback
      const users = await getUsers();
      users.push(newUser);
      await saveUsers(users);
      console.log('User saved to localStorage');
    }
    
    // Auto-login after registration
    currentUser = newUser;
    setLS('currentUser', newUser);
    console.log('Auto-login successful after registration');
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

async function doLogout() {
  console.log('Logging out user:', currentUser ? currentUser.email : 'No user');
  
  // Sign out from Supabase if user was authenticated
  if (window.supabaseService && currentUser && currentUser.supabaseUser) {
    try {
      await window.supabaseService.signOut();
      console.log('Supabase sign out successful');
    } catch (error) {
      console.warn('Supabase sign out failed:', error);
    }
  }
  
  currentUser = null;
  localStorage.removeItem('currentUser');
  // Clear cart on logout
  clearCart();
}

function getCurrentUser() {
  return currentUser;
}

async function getUserByEmail(email) {
  console.log('Looking up user by email:', email);
  
  if (window.supabaseService) {
    try {
      const user = await window.supabaseService.getUserByEmail(email);
      console.log('User found in database:', user ? 'Yes' : 'No');
      return user;
    } catch (error) {
      console.warn('Failed to get user by email from database, using localStorage fallback:', error);
    }
  }
  
  // Fallback to localStorage
  const users = await getUsers();
  const user = users.find(x => x.email === email);
  console.log('User found in localStorage:', user ? 'Yes' : 'No');
  return user;
}

// Check if user is already logged in on page load
function checkExistingSession() {
  const savedUser = getLS('currentUser');
  if (savedUser && savedUser.email) {
    console.log('Existing session found for:', savedUser.email);
    currentUser = savedUser;
    return true;
  }
  return false;
}

// Validate user session and refresh if needed
async function validateUserSession() {
  if (!currentUser) return false;
  
  try {
    // Check if user still exists in database
    if (window.supabaseService) {
      const user = await window.supabaseService.getUserByEmail(currentUser.email);
      if (user) {
        // Update local session with latest user data
        currentUser = user;
        setLS('currentUser', user);
        console.log('User session validated and refreshed');
        return true;
      }
    }
    
    // Fallback: check localStorage
    const users = await getUsers();
    const user = users.find(x => x.email === currentUser.email);
    if (user) {
      currentUser = user;
      setLS('currentUser', user);
      console.log('User session validated from localStorage');
      return true;
    }
    
    // User not found, clear session
    console.log('User session invalid, clearing...');
    doLogout();
    return false;
  } catch (error) {
    console.error('Error validating user session:', error);
    return false;
  }
}

// Initialize auth
initAuth();
