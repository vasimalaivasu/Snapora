/**
 * SNAPORA - Core UI, Navigation, Theme, RTL & Interactive Utilities
 */
(function (window, document) {
  'use strict';

  function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/customer/') || path.includes('/admin/')) {
      return '../';
    }
    return '';
  }

  // Ensure Favicon is set on document head
  function ensureFavicon() {
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    const base = getBasePath();
    link.href = `${base}assets/images/favicon.svg`;
  }

  ensureFavicon();

  // Apply saved Theme & RTL immediately to avoid flash
  function applyInitialPreferences() {
    const savedTheme = localStorage.getItem('fb_studio_theme') || 'light';
    const savedRtl = localStorage.getItem('fb_studio_rtl') || 'ltr';

    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.setAttribute('dir', savedRtl);
  }

  applyInitialPreferences();

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fb_studio_theme', next);
    updateThemeAndRtlIcons();
    toast(`Switched to ${next === 'dark' ? 'Dark Plum' : 'Warm Ivory Light'} Mode`, 'info');
  }

  function toggleRtl() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', nextDir);
    localStorage.setItem('fb_studio_rtl', nextDir);
    updateThemeAndRtlIcons();
    toast(`Layout direction set to ${nextDir.toUpperCase()}`, 'info');
  }

  function updateThemeAndRtlIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    document.querySelectorAll('[data-theme-toggle-icon]').forEach(el => {
      el.className = isDark ? 'bi bi-sun-fill text-amber-400 text-lg' : 'bi bi-moon-stars-fill text-lg';
    });

    document.querySelectorAll('[data-rtl-toggle-label]').forEach(el => {
      el.textContent = isRtl ? 'LTR' : 'RTL';
    });
  }

  // Toast Notification System
  function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  }

  function toast(message, type = 'success', title = '') {
    const container = ensureToastContainer();
    const item = document.createElement('div');
    item.className = 'toast-item';

    const iconMap = {
      success: 'bi-check-circle-fill text-[#2A7B76]',
      error: 'bi-exclamation-triangle-fill text-[#D9383A]',
      info: 'bi-Sparkles bi-stars text-[#E86A58]',
      warning: 'bi-info-circle-fill text-amber-500'
    };
    const borderMap = {
      success: '#2A7B76',
      error: '#D9383A',
      info: '#E86A58',
      warning: '#F4C95D'
    };

    item.style.borderInlineStartColor = borderMap[type] || '#D9383A';

    const heading = title || (type === 'error' ? 'Attention' : type === 'info' ? 'Snapora' : 'Success');
    item.innerHTML = `
      <i class="bi ${iconMap[type] || iconMap.success} text-xl mt-0.5"></i>
      <div class="flex-1 text-sm">
        <p class="font-bold text-[#1F1A1C] leading-tight">${heading}</p>
        <p class="text-[#5A4B53] text-xs mt-1 leading-relaxed">${message}</p>
      </div>
      <button type="button" aria-label="Dismiss notification" class="text-[#84727B] hover:text-[#D9383A] p-1">
        <i class="bi bi-x-lg text-xs"></i>
      </button>
    `;

    item.querySelector('button').addEventListener('click', () => item.remove());
    container.appendChild(item);

    setTimeout(() => {
      if (item.parentNode) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'all 0.25s ease';
        setTimeout(() => item.remove(), 250);
      }
    }, 4200);
  }

  // Render Shared Public Navbar
  function renderNavbar() {
    const navMount = document.getElementById('navbar');
    if (!navMount) return;

    const base = getBasePath();
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const session = window.PBStore ? window.PBStore.getSession() : null;

    const authButtonHtml = session
      ? `
        <div class="relative" id="userNavMenuContainer">
          <button id="userNavMenuBtn" type="button" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E6D8C7] bg-white hover:border-[#D9383A] transition text-xs font-bold">
            <img src="${session.avatar}" alt="${session.name}" class="w-6 h-6 rounded-full object-cover">
            <span class="max-w-[100px] truncate">${session.name.split(' ')[0]}</span>
            <i class="bi bi-chevron-down text-[10px]"></i>
          </button>
          <div id="userNavDropdown" class="hidden absolute end-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E6D8C7] py-2 z-50">
            <div class="px-4 py-2 border-b border-[#E6D8C7]">
              <p class="font-bold text-xs text-[#1F1A1C]">${session.name}</p>
              <p class="text-[11px] text-[#84727B] truncate">${session.email}</p>
              <span class="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#D9383A]">Customer Account</span>
            </div>
            <a href="${base}customer/dashboard.html" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-[#FAF3E8] transition">
              <i class="bi bi-speedometer2 text-[#D9383A]"></i> Open My Dashboard
            </a>
            <a href="${base}customer/bookings.html" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-[#FAF3E8] transition">
              <i class="bi bi-calendar2-check text-[#2A7B76]"></i> My Bookings
            </a>
            <a href="${base}customer/favorites.html" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-[#FAF3E8] transition">
              <i class="bi bi-heart text-[#E86A58]"></i> Saved Favorites
            </a>
            <button type="button" onclick="window.PBAuth.logout()" class="w-full text-start flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#D9383A] hover:bg-red-50/50 border-t border-[#E6D8C7] mt-1">
              <i class="bi bi-box-arrow-right"></i> Sign Out
            </button>
          </div>
        </div>
      `
      : `
        <a href="${base}login.html" class="px-4 py-2 rounded-xl border-2 border-[#E6D8C7] font-bold text-xs hover:border-[#D9383A] hover:text-[#D9383A] transition">
          Login
        </a>
      `;

    navMount.innerHTML = `
      <header id="mainNavbar" class="fixed top-0 inset-x-0 z-50 bg-[#FDF8F2]/95 backdrop-blur-md border-b border-[#E6D8C7] transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <!-- Brand Logo -->
          <a href="${base}index.html" class="flex items-center gap-2.5 group shrink-0" aria-label="Snapora Home">
            <div class="w-10 h-10 rounded-xl bg-[#D9383A] text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
              <i class="bi bi-camera-reels-fill text-xl"></i>
            </div>
            <div>
              <span class="font-serif-editorial text-xl font-extrabold tracking-tight text-[#1F1A1C] block leading-none">SNAPORA</span>
              <span class="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D9383A] block mt-0.5">Photo Booth & Rentals</span>
            </div>
          </a>

          <!-- Desktop Nav Links -->
          <nav class="hidden xl:flex items-center gap-7 text-sm font-semibold text-[#1F1A1C]" aria-label="Main Navigation">
            <!-- Home Dropdown & Direct Link -->
            <div class="relative group" data-dropdown>
              <div class="flex items-center gap-1 py-2 ${(currentFile === 'index.html' || currentFile === 'index-dashboard.html') ? 'nav-link-active' : ''}">
                <a href="${base}index.html" class="hover:text-[#D9383A] transition">
                  <span>Home</span>
                </a>
                <button type="button" data-dropdown-btn aria-expanded="false" aria-haspopup="true" aria-label="Toggle Home menu options" class="hover:text-[#D9383A] transition p-0.5">
                  <i class="bi bi-chevron-down text-[11px] transition-transform duration-200"></i>
                </button>
              </div>
              <div data-dropdown-menu class="hidden absolute start-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-[#E6D8C7] p-2 z-50">
                <a href="${base}index.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF3E8] transition group/item">
                  <i class="bi bi-stars text-[#D9383A] text-lg mt-0.5 group-hover/item:scale-110 transition-transform"></i>
                  <div>
                    <p class="font-bold text-xs text-[#1F1A1C]">Editorial Studio Showcase</p>
                    <p class="text-[11px] text-[#84727B]">Vintage photo booths &amp; wedding aesthetics</p>
                  </div>
                </a>
                <a href="${base}index-dashboard.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF3E8] transition group/item">
                  <i class="bi bi-grid-1x2-fill text-[#2A7B76] text-lg mt-0.5 group-hover/item:scale-110 transition-transform"></i>
                  <div>
                    <p class="font-bold text-xs text-[#1F1A1C]">Interactive Booking Hub</p>
                    <p class="text-[11px] text-[#84727B]">Live availability &amp; instant reservations</p>
                  </div>
                </a>
              </div>
            </div>

            <!-- Direct Booths Link -->
            <a href="${base}booths.html" class="py-2 hover:text-[#D9383A] transition ${(currentFile === 'booths.html' || currentFile === 'booth-details.html') ? 'nav-link-active' : ''}">Booths</a>

            <!-- Direct Backdrops Link -->
            <a href="${base}backdrops.html" class="py-2 hover:text-[#D9383A] transition ${currentFile === 'backdrops.html' ? 'nav-link-active' : ''}">Backdrops</a>

            <!-- Direct Packages Link -->
            <a href="${base}packages.html" class="py-2 hover:text-[#D9383A] transition ${currentFile === 'packages.html' ? 'nav-link-active' : ''}">Packages</a>

            <!-- Combined Celebrations & Gallery Link -->
            <a href="${base}events.html" class="py-2 hover:text-[#D9383A] transition ${(currentFile === 'events.html' || currentFile === 'gallery.html') ? 'nav-link-active' : ''}">Celebrations &amp; Gallery</a>

            <!-- Direct Contact Link -->
            <a href="${base}contact.html" class="py-2 hover:text-[#D9383A] transition ${currentFile === 'contact.html' ? 'nav-link-active' : ''}">Contact</a>
          </nav>

          <!-- Right Controls -->
          <div class="hidden lg:flex items-center gap-2.5 shrink-0">
            <button type="button" onclick="window.PBUI.toggleTheme()" aria-label="Toggle Dark or Light Mode" class="w-9 h-9 rounded-xl border border-[#E6D8C7] bg-white flex items-center justify-center hover:border-[#D9383A] transition" title="Toggle Theme">
              <i data-theme-toggle-icon class="bi bi-moon-stars-fill text-lg"></i>
            </button>
            <button type="button" onclick="window.PBUI.toggleRtl()" aria-label="Toggle Right to Left Layout" class="h-9 px-2.5 rounded-xl border border-[#E6D8C7] bg-white flex items-center justify-center gap-1 text-xs font-extrabold hover:border-[#D9383A] transition" title="Toggle RTL/LTR">
              <i class="bi bi-arrow-left-right text-xs text-[#D9383A]"></i>
              <span data-rtl-toggle-label>RTL</span>
            </button>

            ${authButtonHtml}

            <a href="${base}booking.html" class="btn-cherry text-xs !py-2.5 !px-4 whitespace-nowrap">
              <i class="bi bi-calendar2-heart-fill"></i>
              <span>Book Now</span>
            </a>
          </div>

          <!-- Mobile Hamburger -->
          <div class="flex items-center gap-2 xl:hidden">
            <button type="button" onclick="window.PBUI.toggleTheme()" aria-label="Toggle Theme" class="w-9 h-9 rounded-xl border border-[#E6D8C7] bg-white flex items-center justify-center lg:hidden">
              <i data-theme-toggle-icon class="bi bi-moon-stars-fill text-base"></i>
            </button>
            <button type="button" id="mobileMenuOpenBtn" aria-label="Open Navigation Menu" aria-expanded="false" class="w-10 h-10 rounded-xl bg-[#FAF3E8] border border-[#E6D8C7] hover:border-[#D9383A] text-[#1F1A1C] flex items-center justify-center text-xl shadow-xs">
              <i class="bi bi-list"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Overlay -->
      <div id="mobileNavOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden transition-opacity"></div>

      <!-- Mobile Drawer -->
      <aside id="mobileNavDrawer" aria-label="Mobile Navigation" class="fixed top-0 end-0 bottom-0 w-80 max-w-[88vw] bg-[#FDF8F2] text-[#1F1A1C] z-50 shadow-2xl border-s border-[#E6D8C7] transform translate-x-full rtl:-translate-x-full transition-transform duration-300 flex flex-col">
        <div class="p-5 border-b border-[#E6D8C7] flex items-center justify-between">
          <a href="${base}index.html" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#D9383A] text-white flex items-center justify-center">
              <i class="bi bi-camera-reels-fill"></i>
            </div>
            <span class="font-serif-editorial font-extrabold text-lg">SNAPORA</span>
          </a>
          <button type="button" id="mobileMenuCloseBtn" aria-label="Close Navigation Menu" class="w-9 h-9 rounded-xl border border-[#E6D8C7] flex items-center justify-center text-lg hover:text-[#D9383A]">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-2 text-sm font-semibold">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B] px-2">Studio Experiences</p>
          <a href="${base}index.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Editorial Studio Showcase</a>
          <a href="${base}index-dashboard.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Interactive Booking Hub</a>

          <p class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B] px-2 pt-3">Photo Booths & Backdrops</p>
          <a href="${base}booths.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Photo Booths & Specs (12)</a>
          <a href="${base}backdrops.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Backdrops</a>
          <a href="${base}packages.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Packages & Pricing</a>

          <p class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B] px-2 pt-3">Celebrations & Explore</p>
          <a href="${base}events.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Celebrations &amp; Gallery</a>
          <a href="${base}reviews.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Customer Reviews</a>
          <a href="${base}blog.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Event Planning Blog</a>
          <a href="${base}contact.html" class="block px-3 py-2 rounded-xl hover:bg-[#FAF3E8]">Contact Us</a>
          <a href="${base}customer/dashboard.html" class="block px-3 py-2 rounded-xl bg-[#FAF3E8] text-[#D9383A] font-bold"><i class="bi bi-person-circle me-2"></i>Customer Dashboard</a>
        </div>

        <div class="p-5 border-t border-[#E6D8C7] space-y-3">
          <div class="flex items-center justify-between gap-2">
            <button type="button" onclick="window.PBUI.toggleTheme()" class="flex-1 py-2 px-3 rounded-xl border border-[#E6D8C7] text-xs font-bold flex items-center justify-center gap-2">
              <i data-theme-toggle-icon class="bi bi-moon-stars-fill"></i>
              <span>Theme</span>
            </button>
            <button type="button" onclick="window.PBUI.toggleRtl()" class="flex-1 py-2 px-3 rounded-xl border border-[#E6D8C7] text-xs font-bold flex items-center justify-center gap-2">
              <i class="bi bi-arrow-left-right"></i>
              <span data-rtl-toggle-label>RTL</span>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <a href="${base}login.html" class="py-2.5 rounded-xl border-2 border-[#E6D8C7] text-center text-xs font-bold">Login</a>
            <a href="${base}booking.html" class="btn-cherry !py-2.5 text-xs">Book Now</a>
          </div>
        </div>
      </aside>
    `;

    // Dropdown interactions (Hover + Click + Keyboard accessibility)
    document.querySelectorAll('[data-dropdown]').forEach(drop => {
      const btn = drop.querySelector('[data-dropdown-btn]');
      const menu = drop.querySelector('[data-dropdown-menu]');
      if (!btn || !menu) return;

      let leaveTimer = null;

      const openDropdown = () => {
        clearTimeout(leaveTimer);
        document.querySelectorAll('[data-dropdown-menu]').forEach(m => {
          if (m !== menu) m.classList.add('hidden');
        });
        menu.classList.remove('hidden');
        drop.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('.bi-chevron-down');
        if (icon) icon.style.transform = 'rotate(180deg)';
      };

      const closeDropdown = (delay = 0) => {
        clearTimeout(leaveTimer);
        if (delay > 0) {
          leaveTimer = setTimeout(() => {
            menu.classList.add('hidden');
            drop.removeAttribute('data-open');
            btn.setAttribute('aria-expanded', 'false');
            const icon = btn.querySelector('.bi-chevron-down');
            if (icon) icon.style.transform = '';
          }, delay);
        } else {
          menu.classList.add('hidden');
          drop.removeAttribute('data-open');
          btn.setAttribute('aria-expanded', 'false');
          const icon = btn.querySelector('.bi-chevron-down');
          if (icon) icon.style.transform = '';
        }
      };

      // Hover on desktop with smooth grace period
      drop.addEventListener('mouseenter', openDropdown);
      drop.addEventListener('mouseleave', () => closeDropdown(160));

      // Click / Touch toggle
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) {
          closeDropdown(0);
        } else {
          openDropdown();
        }
      });
    });

    const userMenuContainer = document.getElementById('userNavMenuContainer');
    const userMenuBtn = document.getElementById('userNavMenuBtn');
    const userMenuDrop = document.getElementById('userNavDropdown');
    if (userMenuContainer && userMenuBtn && userMenuDrop) {
      let userLeaveTimer = null;
      const openUserDrop = () => {
        clearTimeout(userLeaveTimer);
        userMenuDrop.classList.remove('hidden');
      };
      const closeUserDrop = (delay = 0) => {
        clearTimeout(userLeaveTimer);
        if (delay > 0) {
          userLeaveTimer = setTimeout(() => userMenuDrop.classList.add('hidden'), delay);
        } else {
          userMenuDrop.classList.add('hidden');
        }
      };

      userMenuContainer.addEventListener('mouseenter', openUserDrop);
      userMenuContainer.addEventListener('mouseleave', () => closeUserDrop(160));

      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuDrop.classList.toggle('hidden');
      });
    }

    document.addEventListener('click', () => {
      document.querySelectorAll('[data-dropdown]').forEach(drop => {
        const menu = drop.querySelector('[data-dropdown-menu]');
        const btn = drop.querySelector('[data-dropdown-btn]');
        const icon = btn?.querySelector('.bi-chevron-down');
        if (menu) menu.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = '';
        drop.removeAttribute('data-open');
      });
      if (userMenuDrop) userMenuDrop.classList.add('hidden');
    });

    // Mobile drawer open/close
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    const closeBtn = document.getElementById('mobileMenuCloseBtn');
    const overlay = document.getElementById('mobileNavOverlay');
    const drawer = document.getElementById('mobileNavDrawer');

    function closeMobileMenu() {
      if (!drawer || !overlay) return;
      drawer.classList.add('translate-x-full', 'rtl:-translate-x-full');
      overlay.classList.add('hidden');
      openBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMobileMenu() {
      if (!drawer || !overlay) return;
      drawer.classList.remove('translate-x-full', 'rtl:-translate-x-full');
      overlay.classList.remove('hidden');
      openBtn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    openBtn?.addEventListener('click', openMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        document.querySelectorAll('[data-dropdown]').forEach(drop => {
          const menu = drop.querySelector('[data-dropdown-menu]');
          const btn = drop.querySelector('[data-dropdown-btn]');
          const icon = btn?.querySelector('.bi-chevron-down');
          if (menu) menu.classList.add('hidden');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (icon) icon.style.transform = '';
          drop.removeAttribute('data-open');
        });
        if (userMenuDrop) userMenuDrop.classList.add('hidden');
        closeAvailabilityModal();
      }
    });

    updateThemeAndRtlIcons();
  }

  // Render Shared Public Footer (Compact Spacing)
  function renderFooter() {
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('login.html') || currentPath.includes('signup.html') || currentPath.includes('register.html')) {
      const mount = document.getElementById('footer');
      if (mount) mount.remove();
      return;
    }

    const footerMount = document.getElementById('footer');
    if (!footerMount) return;

    const base = getBasePath();
    footerMount.innerHTML = `
      <footer class="bg-[#2B192E] text-[#FDF8F2] pt-12 pb-8 border-t-4 border-[#D9383A] relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Newsletter Strip -->
          <div class="bg-[#38223C] rounded-3xl p-6 md:p-8 mb-10 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div class="max-w-xl">
              <span class="inline-block px-3 py-0.5 rounded-full bg-[#F4C95D]/20 text-[#F4C95D] text-xs font-extrabold uppercase tracking-widest mb-2">VIP Event Lookbook</span>
              <h3 class="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">Get $75 Off Your First Photo Booth Rental</h3>
              <p class="text-[#D7C8D2] text-xs sm:text-sm mt-1 leading-relaxed">Join 8,500+ couples, party hosts, and event planners receiving our seasonal backdrop lookbooks and custom photo strip templates.</p>
            </div>
            <form id="footerNewsletterForm" class="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 shrink-0">
              <label for="footerNewsletterEmail" class="sr-only">Email address</label>
              <input id="footerNewsletterEmail" type="email" required placeholder="Enter your email address..." class="px-4 py-3 rounded-xl bg-[#211324] border border-white/20 text-white placeholder-white/50 text-sm min-w-[240px] focus:outline-none focus:border-[#F4C95D]">
              <button type="submit" class="btn-cherry whitespace-nowrap !py-3">
                <span>Claim $75 Voucher</span>
                <i class="bi bi-arrow-right rtl-flip"></i>
              </button>
            </form>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-white/10">
            <!-- Brand Info -->
            <div class="lg:col-span-2 space-y-3">
              <a href="${base}index.html" class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-[#D9383A] text-white flex items-center justify-center shadow-lg">
                  <i class="bi bi-camera-reels-fill text-lg"></i>
                </div>
                <div>
                  <span class="font-serif-editorial text-xl font-extrabold tracking-tight text-white block leading-none">SNAPORA</span>
                  <span class="text-[9px] font-bold uppercase tracking-[0.22em] text-[#F4C95D] block mt-0.5">Studio & Event Rentals</span>
                </div>
              </a>
              <p class="text-[#D7C8D2] text-xs sm:text-sm leading-relaxed max-w-sm">
                Combining the nostalgic charm of vintage analog photography with a modern event reservation platform. Serving weddings, milestone birthdays, and brand activations across 12 metro areas.
              </p>
              <div class="flex items-center gap-2.5 pt-1">
                <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer" aria-label="Facebook Login" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D9383A] flex items-center justify-center text-white transition"><i class="bi bi-facebook"></i></a>
                <a href="https://x.com/i/flow/login" target="_blank" rel="noopener noreferrer" aria-label="X Login" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D9383A] flex items-center justify-center text-white transition"><i class="bi bi-twitter-x"></i></a>
                <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Login" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D9383A] flex items-center justify-center text-white transition"><i class="bi bi-instagram"></i></a>
                <a href="https://www.tiktok.com/login" target="_blank" rel="noopener noreferrer" aria-label="TikTok Login" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D9383A] flex items-center justify-center text-white transition"><i class="bi bi-tiktok"></i></a>
                <a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank" rel="noopener noreferrer" aria-label="YouTube Login" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D9383A] flex items-center justify-center text-white transition"><i class="bi bi-youtube"></i></a>
              </div>
            </div>

            <!-- Booth Styles -->
            <div>
              <h4 class="font-serif-editorial text-sm font-bold text-[#F4C95D] mb-3">Booth Collection</h4>
              <ul class="space-y-2 text-xs text-[#D7C8D2]">
                <li><a href="${base}booths.html?id=vintage-enclosed" class="hover:text-white transition">Vintage Enclosed Booth</a></li>
                <li><a href="${base}booths.html?id=glam-booth" class="hover:text-white transition">Black & White Glam Booth</a></li>
                <li><a href="${base}booths.html?id=360-video-booth" class="hover:text-white transition">360° Slow-Mo Video Booth</a></li>
                <li><a href="${base}booths.html?id=retro-caravan" class="hover:text-white transition">1972 Retro Caravan Booth</a></li>
                <li><a href="${base}booths.html?id=mirror-booth" class="hover:text-white transition">Interactive Mirror Booth</a></li>
                <li><a href="${base}booths.html" class="text-[#F4C95D] font-bold hover:underline">View All 12 Booths & Specs →</a></li>
              </ul>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="font-serif-editorial text-sm font-bold text-[#F4C95D] mb-3">Plan Your Event</h4>
              <ul class="space-y-2 text-xs text-[#D7C8D2]">
                <li><a href="${base}booking.html" class="hover:text-white transition">Online Booking Studio</a></li>
                <li><a href="${base}packages.html" class="hover:text-white transition">Packages & Demo Pricing</a></li>
                <li><a href="${base}backdrops.html" class="hover:text-white transition">Backdrops & Add-Ons</a></li>
                <li><a href="${base}events.html" class="hover:text-white transition">Events We Serve</a></li>
                <li><a href="${base}reviews.html" class="hover:text-white transition">Client Testimonials</a></li>
                <li><a href="${base}blog.html" class="hover:text-white transition">Event Planning Blog</a></li>
              </ul>
            </div>

            <!-- Client Portal & Studio -->
            <div>
              <h4 class="font-serif-editorial text-sm font-bold text-[#F4C95D] mb-3">Client Portal &amp; Studio</h4>
              <ul class="space-y-2 text-xs text-[#D7C8D2]">
                <li><a href="${base}customer/dashboard.html" class="hover:text-white transition">Customer Dashboard</a></li>
                <li><a href="${base}customer/bookings.html" class="hover:text-white transition">Track Booking Status</a></li>
                <li><a href="${base}customer/favorites.html" class="hover:text-white transition">Saved Favorites</a></li>
                <li><a href="${base}login.html" class="hover:text-white transition">Customer Sign In</a></li>
                <li><a href="${base}signup.html" class="hover:text-white transition">Customer Sign Up</a></li>
                <li class="pt-1 text-[11px] text-white/75">
                  <i class="bi bi-geo-alt-fill text-[#E86A58] me-1"></i> 742 Analog Way, Arts District, LA
                </li>
                <li class="text-[11px] text-white/75">
                  <i class="bi bi-telephone-fill text-[#E86A58] me-1"></i> (800) 555-SNAP • hello@snapora.demo
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#D7C8D2]">
            <p>© 2026 Snapora & Event Rentals. Frontend Demonstration Template (LocalStorage Demo Mode).</p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="${base}about.html" class="hover:text-white">Our Story</a>
              <a href="${base}contact.html" class="hover:text-white">Support & FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    `;

    const newsForm = document.getElementById('footerNewsletterForm');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('footerNewsletterEmail');
        const email = emailInput.value.trim();
        if (email) {
          const list = JSON.parse(localStorage.getItem('fb_studio_newsletter') || '[]');
          if (!list.includes(email)) list.push(email);
          localStorage.setItem('fb_studio_newsletter', JSON.stringify(list));
          emailInput.value = '';
          toast('You are subscribed! Demo voucher code FLASH75 saved to your browser.', 'success', 'Welcome to the Lookbook!');
        }
      });
    }
  }

  // Global Quick Check Availability Modal
  function openAvailabilityModal(preselectedBoothId = 'vintage-enclosed') {
    let modal = document.getElementById('globalAvailabilityModal');
    const booths = window.PBStore ? window.PBStore.getBooths() : [];
    const events = window.PBStore ? window.PBStore.getEvents() : [];
    const base = getBasePath();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'globalAvailabilityModal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs hidden';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'availModalTitle');
      document.body.appendChild(modal);
    }

    const boothOptions = booths.map(b =>
      `<option value="${b.id}" ${b.id === preselectedBoothId ? 'selected' : ''}>${b.name} — Starting at $${b.price}</option>`
    ).join('');

    const eventOptions = events.map(ev =>
      `<option value="${ev.name}">${ev.name}</option>`
    ).join('');

    modal.innerHTML = `
      <div class="bg-[#FDF8F2] surface-card border-2 border-[#E6D8C7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-[toastSlideIn_0.25s_ease]">
        <button type="button" onclick="window.PBUI.closeAvailabilityModal()" aria-label="Close modal" class="absolute top-5 end-5 w-9 h-9 rounded-full border border-[#E6D8C7] flex items-center justify-center hover:text-[#D9383A]">
          <i class="bi bi-x-lg"></i>
        </button>

        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9383A]/10 text-[#D9383A] text-xs font-extrabold uppercase tracking-wider mb-3">
          <i class="bi bi-calendar2-check-fill"></i> Instant Date Checker
        </span>
        <h3 id="availModalTitle" class="font-serif-editorial text-2xl font-bold text-[#1F1A1C]">Check Booth Availability</h3>
        <p class="text-xs text-[#5A4B53] mt-1">Select your celebration date and preferred booth style to check demo availability and lock in your quote.</p>

        <form id="globalAvailForm" class="space-y-4 mt-5">
          <div>
            <label for="availBoothSelect" class="block text-xs font-bold uppercase tracking-wider text-[#5A4B53] mb-1.5">Photo Booth Style</label>
            <select id="availBoothSelect" required class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7] bg-white text-sm font-semibold">
              ${boothOptions}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="availEventDate" class="block text-xs font-bold uppercase tracking-wider text-[#5A4B53] mb-1.5">Event Date *</label>
              <input id="availEventDate" type="date" min="${tomorrow}" value="${tomorrow}" required class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7] bg-white text-sm font-semibold">
            </div>
            <div>
              <label for="availEventType" class="block text-xs font-bold uppercase tracking-wider text-[#5A4B53] mb-1.5">Event Type *</label>
              <select id="availEventType" required class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7] bg-white text-sm font-semibold">
                ${eventOptions}
              </select>
            </div>
          </div>
          <div id="availStatusResult" class="hidden p-4 rounded-2xl bg-[#2A7B76]/10 border border-[#2A7B76]/30 text-xs"></div>
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" id="verifyDateBtn" class="btn-outline-vintage flex-1 !py-3 text-xs">
              <i class="bi bi-search"></i> Verify Date
            </button>
            <button type="submit" class="btn-cherry flex-1 !py-3 text-xs">
              <span>Continue to Booking</span>
              <i class="bi bi-arrow-right rtl-flip"></i>
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');

    const verifyBtn = document.getElementById('verifyDateBtn');
    const resultBox = document.getElementById('availStatusResult');
    const form = document.getElementById('globalAvailForm');

    verifyBtn.addEventListener('click', () => {
      const boothId = document.getElementById('availBoothSelect').value;
      const dateVal = document.getElementById('availEventDate').value;
      const booth = window.PBStore.getBoothById(boothId);
      if (!dateVal) {
        toast('Please choose an event date first.', 'warning');
        return;
      }
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-check-circle-fill text-xl text-[#2A7B76]"></i>
          <div>
            <p class="font-bold text-[#1F1A1C]">Good news! ${booth.name} is Available for ${dateVal}</p>
            <p class="text-[#5A4B53] mt-0.5">Starting at $${booth.price} (${booth.duration}). Click "Continue to Booking" to customize your package.</p>
          </div>
        </div>
      `;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const boothId = document.getElementById('availBoothSelect').value;
      const eventDate = document.getElementById('availEventDate').value;
      const eventType = document.getElementById('availEventType').value;

      if (window.PBStore) {
        window.PBStore.saveDraftBooking({
          boothId,
          eventDate,
          eventType,
          step: 1
        });
      }
      window.location.href = `${base}booking.html?booth=${encodeURIComponent(boothId)}&date=${encodeURIComponent(eventDate)}&event=${encodeURIComponent(eventType)}`;
    });
  }

  function closeAvailabilityModal() {
    const modal = document.getElementById('globalAvailabilityModal');
    if (modal) modal.classList.add('hidden');
  }

  // Scroll Reveal & Animated Counters
  function initScrollAndCounters() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const revObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(el => revObserver.observe(el));

      const counterEls = document.querySelectorAll('[data-counter]');
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 1400;
            const startTime = performance.now();

            function step(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              el.textContent = prefix + current.toLocaleString() + suffix;
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
              }
            }
            requestAnimationFrame(step);
            countObserver.unobserve(el);
          }
        });
      }, { threshold: 0.25 });
      counterEls.forEach(el => countObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('revealed'));
    }
  }

  function getStatusBadgeHtml(status) {
    const norm = (status || 'Pending').toLowerCase().replace(/\s+/g, '-');
    const iconMap = {
      'pending': 'bi-hourglass-split',
      'booking-requested': 'bi-send-check',
      'under-review': 'bi-search',
      'confirmed': 'bi-check2-circle',
      'event-preparation': 'bi-tools',
      'event-completed': 'bi-stars',
      'cancelled': 'bi-x-circle'
    };
    return `<span class="status-badge status-${norm}"><i class="bi ${iconMap[norm] || 'bi-circle-fill'}"></i> ${status}</span>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initScrollAndCounters();
  });

  window.PBUI = {
    toggleTheme,
    toggleRtl,
    updateThemeAndRtlIcons,
    toast,
    openAvailabilityModal,
    closeAvailabilityModal,
    initScrollAndCounters,
    getStatusBadgeHtml,
    getBasePath
  };
})(window, document);
