/**
 * SNAPORA - Demo Authentication & Route Protection Module
 * Security Note: LocalStorage authentication is strictly for frontend template demonstration.
 * Production deployments require server-side authentication, HTTP-only cookies/JWT, and bcrypt/Argon2 password hashing.
 */
(function (window) {
  'use strict';

  function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/customer/') || path.includes('/admin/')) {
      return '../';
    }
    return '';
  }

  const PBAuth = {
    getBasePath,

    getCurrentUser() {
      return window.PBStore ? window.PBStore.getSession() : null;
    },

    login(email, password, remember = false) {
      if (!window.PBStore) return { ok: false, message: 'Storage engine not initialized.' };
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail || !cleanPass) {
        return { ok: false, message: 'Please enter both your email address and password.' };
      }

      // Check registered or demo customer accounts
      const users = window.PBStore.getUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!matchedUser) {
        return {
          ok: false,
          message: 'No account found with that email address. Please verify your email or create a new account.'
        };
      }

      const expectedToken = window.PBStore.demoHash(cleanPass);
      if (matchedUser.passwordToken !== expectedToken) {
        return {
          ok: false,
          message: 'Incorrect password. Please verify and try again.'
        };
      }

      const session = window.PBStore.setSession({ ...matchedUser, remember });
      const targetRedirect = getBasePath() + 'index.html';

      return {
        ok: true,
        user: session,
        redirectUrl: targetRedirect,
        message: `Welcome back, ${matchedUser.name}! Redirecting to home page...`
      };
    },

    register({ name, email, phone, password, confirmPassword, termsAccepted }) {
      if (!window.PBStore) return { ok: false, message: 'Storage engine not initialized.' };

      const cleanName = (name || '').trim();
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPhone = (phone || '').trim();

      if (!cleanName || cleanName.length < 2) {
        return { ok: false, message: 'Please enter your full name (at least 2 characters).' };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return { ok: false, message: 'Please enter a valid email address.' };
      }
      if (!cleanPhone || cleanPhone.length < 7) {
        return { ok: false, message: 'Please enter a valid contact phone number.' };
      }
      if (!password || password.length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters long.' };
      }
      if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match. Please verify your confirmation password.' };
      }
      if (!termsAccepted) {
        return { ok: false, message: 'Please accept the rental terms & privacy policy to register.' };
      }

      const users = window.PBStore.getUsers();
      const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        return { ok: false, message: 'An account with this email address is already registered in this demo.' };
      }

      const newUser = {
        id: 'usr-cust-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        passwordToken: window.PBStore.demoHash(password),
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        city: 'San Francisco, CA',
        savedVenue: '',
        savedEventDate: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        preferences: {
          favoriteEventType: 'Weddings',
          preferredStyle: 'Vintage Enclosed Photo Booth',
          preferredContact: 'Email & SMS',
          newsletter: true
        }
      };

      users.push(newUser);
      localStorage.setItem(window.PBStore.KEYS.USERS, JSON.stringify(users));

      const session = window.PBStore.setSession(newUser);
      window.PBStore.addNotification({
        targetRole: 'customer',
        userId: newUser.id,
        title: 'Welcome to Snapora!',
        text: 'Your customer account is ready. Explore our 12 photo booth styles or start a booking!',
        link: '../booths.html'
      });

      return {
        ok: true,
        user: session,
        redirectUrl: getBasePath() + 'index.html',
        message: 'Account created! Redirecting to home page...'
      };
    },

    logout() {
      if (window.PBStore) {
        window.PBStore.clearSession();
      }
      const base = getBasePath();
      window.location.href = base + 'index.html?logged_out=1';
    },

    requireAuth(requiredRole) {
      const session = this.getCurrentUser();
      const base = getBasePath();

      if (!session) {
        const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
        const roleHint = requiredRole || 'customer';
        window.location.href = `${base}login.html?role=${roleHint}&redirect=${encodeURIComponent(roleHint + '/' + currentFile)}`;
        return null;
      }

      if (requiredRole === 'admin' && session.role !== 'admin') {
        window.location.href = `${base}login.html?role=admin&unauthorized=1`;
        return null;
      }

      return session;
    }
  };

  window.PBAuth = PBAuth;
})(window);
