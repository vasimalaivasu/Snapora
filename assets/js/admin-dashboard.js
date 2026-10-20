/**
 * SNAPORA - Admin Dashboard, Booking Management, Booth Inventory, Packages, Customers & Reports Engine
 */
(function (window, document) {
  'use strict';

  let adminBookingsState = {
    search: '',
    status: 'All',
    eventType: 'All',
    dateFilter: '',
    sortBy: 'newest'
  };

  let adminBoothsState = {
    search: '',
    availability: 'All'
  };

  function getActiveAdmin() {
    const session = window.PBAuth ? window.PBAuth.requireAuth('admin') : null;
    return session || {
      id: 'usr-admin-1',
      name: 'Elena Wright',
      email: 'admin@photobooth.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    };
  }

  function renderAdminShell(pageTitle = 'Admin Dashboard') {
    const admin = getActiveAdmin();
    const sidebarMount = document.getElementById('adminSidebarMount');
    const headerMount = document.getElementById('adminHeaderMount');
    const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
    const currentHash = window.location.hash || '';
    const notifs = window.PBStore.getNotifications('admin');

    // All 14 required sidebar items from Section 19
    const navItems = [
      { href: 'dashboard.html', icon: 'bi-speedometer2', label: 'Dashboard' },
      { href: 'bookings.html', icon: 'bi-calendar2-check-fill', label: 'Bookings' },
      { href: 'bookings.html?filter=upcoming', icon: 'bi-calendar-event-fill', label: 'Events' },
      { href: 'customers.html', icon: 'bi-people-fill', label: 'Customers' },
      { href: 'booths.html', icon: 'bi-camera-reels-fill', label: 'Photo Booths' },
      { href: 'packages.html', icon: 'bi-box-seam-fill', label: 'Packages' },
      { href: 'reports.html#backdrops', icon: 'bi-easel2-fill', label: 'Backdrops' },
      { href: 'reports.html#addons', icon: 'bi-stars', label: 'Add-ons' },
      { href: '../gallery.html', icon: 'bi-images', label: 'Gallery' },
      { href: 'reports.html#reviews', icon: 'bi-chat-heart-fill', label: 'Reviews' },
      { href: 'reports.html#messages', icon: 'bi-envelope-paper-heart-fill', label: 'Messages' },
      { href: 'reports.html', icon: 'bi-bar-chart-line-fill', label: 'Reports' },
      { href: 'settings.html', icon: 'bi-gear-fill', label: 'Settings' }
    ];

    if (sidebarMount) {
      sidebarMount.innerHTML = `
        <div id="adminMobileOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 hidden lg:hidden"></div>
        <aside id="adminSidebar" class="fixed lg:static inset-y-0 start-0 w-72 bg-[#2B192E] text-[#FDF8F2] flex flex-col transform -translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0 transition-transform duration-300 z-50 shadow-2xl h-screen">
          <div class="p-5 border-b border-white/10 flex items-center justify-between">
            <a href="../index.html" class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#D9383A] text-white flex items-center justify-center shadow-md">
                <i class="bi bi-camera-reels-fill text-lg"></i>
              </div>
              <div>
                <span class="font-serif-editorial font-extrabold text-lg text-white block leading-none">SNAPORA</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#F4C95D]">Admin Control</span>
              </div>
            </a>
            <button type="button" id="closeAdminSidebarBtn" aria-label="Close Sidebar" class="lg:hidden w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white">
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          <nav class="flex-1 p-3.5 space-y-1 text-xs font-semibold overflow-y-auto" aria-label="Admin Sidebar Navigation">
            ${navItems.map(item => {
              const baseHref = item.href.split('#')[0].split('?')[0];
              const isHashMatch = item.href.includes('#') && currentFile === 'reports.html' && currentHash === ('#' + item.href.split('#')[1]);
              const isActive = isHashMatch || (!item.href.includes('#') && !item.href.includes('?') && currentFile === baseHref);
              return `
                <a href="${item.href}" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${isActive ? 'bg-[#D9383A] text-white font-bold shadow-md' : 'text-[#D7C8D2] hover:bg-white/10 hover:text-white'}">
                  <i class="bi ${item.icon} text-sm"></i>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}

            <div class="pt-3 mt-3 border-t border-white/10">
              <button type="button" onclick="window.PBAuth.logout()" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#F4C95D] hover:bg-[#D9383A] hover:text-white font-bold transition">
                <i class="bi bi-box-arrow-right text-sm"></i>
                <span>Logout</span>
              </button>
            </div>
          </nav>

          <div class="p-4 border-t border-white/10 bg-black/20 flex items-center gap-3">
            <img src="${admin.avatar}" alt="${admin.name}" class="w-9 h-9 rounded-full object-cover border border-[#F4C95D]">
            <div class="min-w-0 flex-1">
              <p class="font-bold text-xs text-white truncate">${admin.name}</p>
              <p class="text-[10px] text-[#F4C95D] truncate">${admin.email}</p>
            </div>
          </div>
        </aside>
      `;
    }

    if (headerMount) {
      headerMount.innerHTML = `
        <header class="bg-white border-b border-[#E6D8C7] px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button type="button" id="openAdminSidebarBtn" aria-label="Open Sidebar" class="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-[#1F1A1C]/25 text-[#1F1A1C] hover:border-[#D9383A] hover:text-[#D9383A] flex items-center justify-center text-xl sm:text-2xl font-extrabold shadow-sm transition active:scale-95 shrink-0">
              <i class="bi bi-list"></i>
            </button>
            <div class="min-w-0">
              <h1 class="font-serif-editorial text-base sm:text-xl font-bold text-[#1F1A1C] truncate leading-tight" title="${pageTitle}">${pageTitle}</h1>
              <p class="text-[11px] text-[#84727B] hidden sm:block truncate">Live LocalStorage synchronization with Customer Portal & Public Website</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button type="button" onclick="window.PBUI.toggleTheme()" aria-label="Toggle Theme" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#E6D8C7] flex items-center justify-center hover:border-[#D9383A] transition shrink-0">
              <i data-theme-toggle-icon class="bi bi-moon-stars-fill text-xs sm:text-sm"></i>
            </button>
            <button type="button" onclick="window.PBUI.toggleRtl()" aria-label="Toggle RTL" class="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-[#E6D8C7] text-xs font-extrabold flex items-center gap-1 hover:border-[#D9383A] transition shrink-0 whitespace-nowrap">
              <i class="bi bi-arrow-left-right text-[#D9383A] text-xs shrink-0"></i>
              <span data-rtl-toggle-label class="whitespace-nowrap">RTL</span>
            </button>
            <a href="../customer/dashboard.html" class="px-3 py-2 rounded-xl bg-[#FAF3E8] border border-[#E6D8C7] text-xs font-bold hover:border-[#D9383A] hidden md:inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <i class="bi bi-person-workspace text-[#2A7B76]"></i> View Customer Portal
            </a>
            <a href="../index.html" class="btn-cherry !py-1.5 sm:!py-2 !px-2.5 sm:!px-3.5 text-xs shrink-0 whitespace-nowrap flex items-center gap-1">
              <i class="bi bi-box-arrow-up-right"></i>
              <span class="hidden sm:inline">Live Site</span>
            </a>
          </div>
        </header>
      `;
    }

    const openBtn = document.getElementById('openAdminSidebarBtn');
    const closeBtn = document.getElementById('closeAdminSidebarBtn');
    const overlay = document.getElementById('adminMobileOverlay');
    const sidebar = document.getElementById('adminSidebar');

    function toggleSidebar(show) {
      if (!sidebar || !overlay) return;
      if (show) {
        sidebar.classList.remove('-translate-x-full', 'rtl:translate-x-full');
        overlay.classList.remove('hidden');
      } else {
        sidebar.classList.add('-translate-x-full', 'rtl:translate-x-full');
        overlay.classList.add('hidden');
      }
    }

    openBtn?.addEventListener('click', () => toggleSidebar(true));
    closeBtn?.addEventListener('click', () => toggleSidebar(false));
    overlay?.addEventListener('click', () => toggleSidebar(false));

    window.PBUI.updateThemeAndRtlIcons();
  }

  // 1. ADMIN DASHBOARD OVERVIEW (Section 19)
  function initAdminDashboardPage() {
    const root = document.getElementById('adminDashboardRoot');
    if (!root) return;
    renderAdminShell('Admin Executive Overview');

    const stats = window.PBStore.getAdminStatistics();
    const bookings = window.PBStore.getBookings();
    const booths = window.PBStore.getBooths();
    const customers = window.PBStore.getCustomersWithStats();
    const messages = window.PBStore.getMessages();

    // Calculate status percentages for visualization
    const totalB = Math.max(bookings.length, 1);
    const pctConfirmed = Math.round((stats.confirmedBookings / totalB) * 100);
    const pctPending = Math.round((stats.pendingBookings / totalB) * 100);
    const pctCompleted = Math.round((stats.completedEvents / totalB) * 100);
    const pctCancelled = Math.round((stats.cancelledBookings / totalB) * 100);

    root.innerHTML = `
      <!-- 9 Required Admin Statistics Cards (Section 19) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-9 gap-3.5">
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Total Customers</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#1F1A1C] mt-1">${stats.totalCustomers}</p>
          <span class="text-[10px] text-[#2A7B76] font-bold">Active accounts</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Total Bookings</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#1F1A1C] mt-1">${stats.totalBookings}</p>
          <span class="text-[10px] text-[#5A4B53]">All records</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Today's Events</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#D9383A] mt-1">${stats.todaysEvents}</p>
          <span class="text-[10px] text-[#D9383A] font-bold">Live dispatches</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Upcoming Events</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#2A7B76] mt-1">${stats.upcomingEvents}</p>
          <span class="text-[10px] text-[#5A4B53]">Scheduled</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Pending</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-amber-600 mt-1">${stats.pendingBookings}</p>
          <span class="text-[10px] text-amber-600 font-bold">Needs action</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Confirmed</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#2A7B76] mt-1">${stats.confirmedBookings}</p>
          <span class="text-[10px] text-[#2A7B76]">Ready</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Completed</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#1F1A1C] mt-1">${stats.completedEvents}</p>
          <span class="text-[10px] text-[#5A4B53]">Delivered</span>
        </div>
        <div class="surface-card bg-white p-4 rounded-2xl border border-[#E6D8C7]">
          <span class="text-[10px] font-extrabold uppercase text-[#84727B] block">Cancelled</span>
          <p class="font-serif-editorial text-2xl font-extrabold text-[#84727B] mt-1">${stats.cancelledBookings}</p>
          <span class="text-[10px] text-[#84727B]">Archived</span>
        </div>
        <div class="surface-card bg-white rounded-2xl border-2 border-[#D9383A] p-4 shadow-sm text-[#1F1A1C]">
          <span class="text-[10px] font-extrabold uppercase text-[#D9383A] block">Est. Demo Revenue</span>
          <p class="font-serif-editorial text-xl font-extrabold text-[#D9383A] mt-1">$${stats.estimatedRevenue.toLocaleString()}</p>
          <span class="text-[10px] text-[#84727B]">Excl. cancelled</span>
        </div>
      </div>

      <!-- 4 Dashboard Visualizations (Monthly Bookings, Status Breakdown, Event Categories, Package Popularity) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        <!-- Monthly Booking Chart -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Monthly Bookings</h3>
              <p class="text-[11px] text-[#84727B]">2026 Reservation Volume</p>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-[#2A7B76]/15 text-[#2A7B76] text-[10px] font-extrabold">+24% YoY</span>
          </div>
          <div class="h-40 flex items-end justify-between gap-2 pt-4 px-1">
            ${[
              { m: 'Jun', h: 48, v: 14 },
              { m: 'Jul', h: 62, v: 19 },
              { m: 'Aug', h: 75, v: 23 },
              { m: 'Sep', h: 86, v: 27 },
              { m: 'Oct', h: 95, v: 31 },
              { m: 'Nov', h: 82, v: 25 },
              { m: 'Dec', h: 90, v: 29 }
            ].map(bar => `
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <span class="text-[10px] font-bold text-[#5A4B53]">${bar.v}</span>
                <div class="w-full rounded-t-lg bg-gradient-to-t from-[#2B192E] to-[#D9383A] transition-all duration-500" style="height: ${bar.h}%;"></div>
                <span class="text-[10px] font-bold text-[#84727B]">${bar.m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Booking Status Chart -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-5 flex flex-col justify-between">
          <div>
            <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Booking Status Split</h3>
            <p class="text-[11px] text-[#84727B] mb-4">Live LocalStorage distribution</p>
            <div class="space-y-3 text-xs">
              <div>
                <div class="flex justify-between font-bold mb-1"><span>Confirmed & Prep</span><span class="text-[#2A7B76]">${pctConfirmed}%</span></div>
                <div class="w-full h-2.5 rounded-full bg-[#FAF3E8] overflow-hidden"><div class="h-full bg-[#2A7B76] rounded-full" style="width:${pctConfirmed}%"></div></div>
              </div>
              <div>
                <div class="flex justify-between font-bold mb-1"><span>Pending & Under Review</span><span class="text-amber-600">${pctPending}%</span></div>
                <div class="w-full h-2.5 rounded-full bg-[#FAF3E8] overflow-hidden"><div class="h-full bg-[#F4C95D] rounded-full" style="width:${pctPending}%"></div></div>
              </div>
              <div>
                <div class="flex justify-between font-bold mb-1"><span>Completed Events</span><span class="text-[#D9383A]">${pctCompleted}%</span></div>
                <div class="w-full h-2.5 rounded-full bg-[#FAF3E8] overflow-hidden"><div class="h-full bg-[#D9383A] rounded-full" style="width:${pctCompleted}%"></div></div>
              </div>
              <div>
                <div class="flex justify-between font-bold mb-1"><span>Cancelled</span><span class="text-[#84727B]">${pctCancelled}%</span></div>
                <div class="w-full h-2.5 rounded-full bg-[#FAF3E8] overflow-hidden"><div class="h-full bg-[#84727B] rounded-full" style="width:${pctCancelled}%"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Category Chart -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-5">
          <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Event Categories</h3>
          <p class="text-[11px] text-[#84727B] mb-4">Share by celebration type</p>
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF3E8]">
              <span class="font-bold flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#D9383A]"></span>Weddings & Engagements</span>
              <span class="font-extrabold">44%</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF3E8]">
              <span class="font-bold flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#2A7B76]"></span>Corporate & Brand Launches</span>
              <span class="font-extrabold">28%</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF3E8]">
              <span class="font-bold flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#F4C95D]"></span>Milestone Birthdays</span>
              <span class="font-extrabold">18%</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF3E8]">
              <span class="font-bold flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#C8B6E2]"></span>Private & Holiday Parties</span>
              <span class="font-extrabold">10%</span>
            </div>
          </div>
        </div>

        <!-- Package Popularity Chart -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-5">
          <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Top Rental Packages</h3>
          <p class="text-[11px] text-[#84727B] mb-4">Most selected packages</p>
          <div class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Wedding Memories ($995)</span><span>36%</span></div>
              <div class="w-full h-2.5 rounded-full bg-[#FAF3E8]"><div class="h-full bg-[#D9383A] rounded-full" style="width:82%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Brand Experience ($1,295)</span><span>28%</span></div>
              <div class="w-full h-2.5 rounded-full bg-[#FAF3E8]"><div class="h-full bg-[#2B192E] rounded-full" style="width:68%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Party Plus ($745)</span><span>22%</span></div>
              <div class="w-full h-2.5 rounded-full bg-[#FAF3E8]"><div class="h-full bg-[#E86A58] rounded-full" style="width:54%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Retro Party ($795)</span><span>14%</span></div>
              <div class="w-full h-2.5 rounded-full bg-[#FAF3E8]"><div class="h-full bg-[#2A7B76] rounded-full" style="width:38%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings Table + Upcoming Events List -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div class="xl:col-span-2 surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Recent Bookings</h3>
              <p class="text-xs text-[#84727B]">Confirm pending reservations or update status</p>
            </div>
            <a href="bookings.html" class="btn-outline-vintage !py-2 !px-3.5 text-xs">Manage All (${bookings.length})</a>
          </div>
          <div class="table-responsive">
            <table class="w-full text-start text-xs">
              <thead>
                <tr class="border-b border-[#E6D8C7] text-[10px] uppercase text-[#84727B]">
                  <th class="py-3 px-2 text-start">Ref</th>
                  <th class="py-3 px-2 text-start">Client</th>
                  <th class="py-3 px-2 text-start">Event Date</th>
                  <th class="py-3 px-2 text-start">Booth Style</th>
                  <th class="py-3 px-2 text-start">Total</th>
                  <th class="py-3 px-2 text-start">Status</th>
                  <th class="py-3 px-2 text-end">Quick Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E6D8C7]">
                ${bookings.slice(0, 5).map(b => `
                  <tr class="hover:bg-[#FAF3E8]/50 transition">
                    <td class="py-3 px-2 font-extrabold text-[#D9383A]">${b.reference}</td>
                    <td class="py-3 px-2 font-bold text-[#1F1A1C]">${b.customerName}</td>
                    <td class="py-3 px-2 text-[#5A4B53]">${b.eventDate}</td>
                    <td class="py-3 px-2 font-semibold">${b.boothName}</td>
                    <td class="py-3 px-2 font-bold">$${Number(b.totalPrice).toLocaleString()}</td>
                    <td class="py-3 px-2">${window.PBUI.getStatusBadgeHtml(b.status)}</td>
                    <td class="py-3 px-2 text-end">
                      ${b.status === 'Pending' || b.status === 'Under Review' ? `
                        <button type="button" onclick="window.PBAdmin.quickUpdateBookingStatus('${b.reference}','Confirmed')" class="px-2.5 py-1 rounded-lg bg-[#2A7B76] text-white font-bold text-[11px] hover:opacity-90">Confirm</button>
                      ` : `
                        <a href="bookings.html" class="px-2.5 py-1 rounded-lg bg-[#FAF3E8] font-bold text-[11px]">Manage</a>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Popular Booth Styles & Upcoming Events -->
        <div class="space-y-6">
          <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Popular Booth Styles</h3>
              <a href="booths.html" class="text-xs font-bold text-[#D9383A]">Inventory →</a>
            </div>
            <div class="space-y-3">
              ${booths.slice(0, 4).map(b => `
                <div class="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#FAF3E8]">
                  <div class="flex items-center gap-3 min-w-0">
                    <img src="${b.image}" alt="${b.name}" class="w-11 h-11 rounded-xl object-cover shrink-0">
                    <div class="min-w-0">
                      <p class="font-bold text-xs text-[#1F1A1C] truncate">${b.name}</p>
                      <p class="text-[11px] text-[#84727B]">From $${b.price} • ${b.availability}</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-white text-[10px] font-extrabold text-[#D9383A] border border-[#E6D8C7]">#${b.popularRank || 1}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Customer Registrations & Messages -->
          <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C]">Recent Inquiries & Clients</h3>
              <a href="reports.html#messages" class="text-xs font-bold text-[#D9383A]">View All</a>
            </div>
            <div class="space-y-2.5 text-xs">
              ${messages.slice(0, 2).map(m => `
                <div class="p-3 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7]">
                  <div class="flex justify-between font-bold text-[#1F1A1C]">
                    <span>${m.name}</span>
                    <span class="text-[10px] text-[#D9383A]">${m.eventType}</span>
                  </div>
                  <p class="text-[11px] text-[#5A4B53] line-clamp-1 mt-0.5">${m.message}</p>
                </div>
              `).join('')}
              ${customers.slice(0, 2).map(c => `
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-[#E6D8C7]">
                  <div class="flex items-center gap-2.5">
                    <img src="${c.avatar}" alt="${c.name}" class="w-8 h-8 rounded-full object-cover">
                    <div>
                      <p class="font-bold text-xs text-[#1F1A1C]">${c.name}</p>
                      <p class="text-[10px] text-[#84727B]">Joined ${c.joinedDate}</p>
                    </div>
                  </div>
                  <span class="text-xs font-extrabold text-[#2A7B76]">$${c.estimatedSpending.toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. ADMIN BOOKING MANAGEMENT (Section 20)
  function renderAdminBookingsTable() {
    const tbody = document.getElementById('adminBookingsTableBody');
    if (!tbody) return;

    let list = window.PBStore.getBookings();

    if (adminBookingsState.search) {
      const q = adminBookingsState.search.toLowerCase();
      list = list.filter(b =>
        b.reference.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.boothName.toLowerCase().includes(q) ||
        (b.venueName || '').toLowerCase().includes(q)
      );
    }

    if (adminBookingsState.status !== 'All') {
      list = list.filter(b => b.status === adminBookingsState.status);
    }

    if (adminBookingsState.eventType !== 'All') {
      list = list.filter(b => b.eventType === adminBookingsState.eventType);
    }

    if (adminBookingsState.dateFilter) {
      list = list.filter(b => b.eventDate === adminBookingsState.dateFilter);
    }

    list.sort((a, b) => {
      if (adminBookingsState.sortBy === 'date-asc') return a.eventDate.localeCompare(b.eventDate);
      if (adminBookingsState.sortBy === 'total-desc') return Number(b.totalPrice) - Number(a.totalPrice);
      return b.eventDate.localeCompare(a.eventDate);
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="py-12 text-center text-xs text-[#84727B]">No bookings match your current filter criteria.</td></tr>`;
      return;
    }

    const statuses = ['Pending', 'Under Review', 'Confirmed', 'Event Preparation', 'Event Completed', 'Cancelled'];

    tbody.innerHTML = list.map(b => `
      <tr class="hover:bg-[#FAF3E8]/60 transition">
        <td class="py-3.5 px-3 font-extrabold text-[#D9383A]">${b.reference}</td>
        <td class="py-3.5 px-3">
          <p class="font-bold text-[#1F1A1C]">${b.customerName}</p>
          <p class="text-[11px] text-[#84727B]">${b.customerEmail}</p>
        </td>
        <td class="py-3.5 px-3">
          <p class="font-bold text-[#1F1A1C]">${b.eventDate}</p>
          <p class="text-[11px] text-[#84727B]">${b.eventType} • ${b.guestCount} guests</p>
        </td>
        <td class="py-3.5 px-3">
          <p class="font-semibold text-[#1F1A1C]">${b.boothName}</p>
          <p class="text-[11px] text-[#2A7B76] font-semibold">${b.packageName}</p>
        </td>
        <td class="py-3.5 px-3">
          <span class="text-xs font-semibold text-[#1F1A1C]">${b.coordinator || 'Unassigned'}</span>
        </td>
        <td class="py-3.5 px-3 font-serif-editorial font-extrabold text-sm text-[#1F1A1C]">$${Number(b.totalPrice).toLocaleString()}</td>
        <td class="py-3.5 px-3">
          <select aria-label="Update status for ${b.reference}" onchange="window.PBAdmin.quickUpdateBookingStatus('${b.reference}', this.value)" class="px-2.5 py-1.5 rounded-xl border border-[#E6D8C7] bg-[#FAF3E8] text-xs font-bold">
            ${statuses.map(st => `<option value="${st}" ${b.status === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </td>
        <td class="py-3.5 px-3 text-end">
          <div class="inline-flex items-center gap-1.5">
            ${b.status === 'Pending' ? `
              <button type="button" onclick="window.PBAdmin.quickUpdateBookingStatus('${b.reference}','Confirmed')" class="px-2.5 py-1.5 rounded-lg bg-[#2A7B76] text-white text-xs font-bold hover:opacity-90" title="Confirm Pending Booking">
                <i class="bi bi-check2"></i> Confirm
              </button>
            ` : ''}
            <button type="button" onclick="window.PBAdmin.openAdminBookingModal('${b.reference}')" class="px-2.5 py-1.5 rounded-lg bg-[#2B192E] text-white text-xs font-bold hover:bg-[#D9383A] transition">
              <i class="bi bi-sliders"></i> Manage
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function openAdminBookingModal(ref) {
    const b = window.PBStore.getBookingByRef(ref);
    if (!b) return;

    let modal = document.getElementById('adminBookingDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminBookingDetailModal';
      modal.className = 'fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 hidden';
      document.body.appendChild(modal);
    }

    const statuses = ['Pending', 'Under Review', 'Confirmed', 'Event Preparation', 'Event Completed', 'Cancelled'];
    const coordinators = ['Unassigned', 'Eleanor Vance', 'Julian Mercer', 'Clara Lin', 'Marcus Sterling'];

    modal.innerHTML = `
      <div class="surface-card bg-white rounded-3xl border-2 border-[#E6D8C7] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button type="button" onclick="document.getElementById('adminBookingDetailModal').classList.add('hidden')" class="absolute top-5 end-5 w-9 h-9 rounded-full border border-[#E6D8C7] flex items-center justify-center">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="flex items-center gap-3 mb-2">
          <span class="font-serif-editorial text-2xl font-extrabold text-[#D9383A]">${b.reference}</span>
          ${window.PBUI.getStatusBadgeHtml(b.status)}
        </div>
        <p class="text-xs text-[#5A4B53]">Client: <strong>${b.customerName}</strong> (${b.customerEmail} • ${b.customerPhone})</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-xs">
          <div class="p-4 rounded-2xl bg-[#FAF3E8] space-y-1">
            <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Event & Venue</span>
            <p class="font-bold text-[#1F1A1C]">${b.eventType} (${b.guestCount} Guests)</p>
            <p>${b.eventDate} • ${b.startTime} (${b.duration})</p>
            <p>${b.venueName}, ${b.eventCity}</p>
          </div>
          <div class="p-4 rounded-2xl bg-[#FAF3E8] space-y-1">
            <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Hardware, Backdrop & Pricing</span>
            <p class="font-bold text-[#1F1A1C]">${b.boothName}</p>
            <p>Package: ${b.packageName} • Backdrop: ${b.backdropName}</p>
            <p>Add-ons: ${(b.addonNames || []).join(', ') || 'None'}</p>
            <p class="font-extrabold text-[#D9383A] pt-1">Estimated Total: $${Number(b.totalPrice).toLocaleString()}</p>
          </div>
        </div>

        <form id="adminBookingManageForm" class="space-y-4 text-xs border-t border-[#E6D8C7] pt-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Booking Status</label>
              <select id="admBkStatus" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7] font-bold">
                ${statuses.map(st => `<option value="${st}" ${b.status === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="font-bold block mb-1">Assigned Event Coordinator</label>
              <select id="admBkCoordinator" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7] font-bold">
                ${coordinators.map(c => `<option value="${c}" ${b.coordinator === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="font-bold block mb-1">Customer Setup Instructions</label>
            <input type="text" id="admBkCustNotes" value="${b.instructions || ''}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Internal Admin & Dispatch Notes</label>
            <textarea id="admBkInternalNotes" rows="3" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">${b.internalNotes || ''}</textarea>
          </div>
          <div class="flex flex-wrap justify-between items-center gap-3 pt-2">
            <button type="button" onclick="window.PBAdmin.quickUpdateBookingStatus('${b.reference}','Cancelled');document.getElementById('adminBookingDetailModal').classList.add('hidden');" class="px-4 py-2.5 rounded-xl bg-red-500/10 text-[#D9383A] font-bold hover:bg-[#D9383A] hover:text-white transition">
              Cancel Booking
            </button>
            <div class="flex gap-2">
              <button type="button" onclick="document.getElementById('adminBookingDetailModal').classList.add('hidden')" class="btn-outline-vintage !py-2.5 !px-4 text-xs">Close</button>
              <button type="submit" class="btn-cherry !py-2.5 !px-5 text-xs">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('adminBookingManageForm').addEventListener('submit', (e) => {
      e.preventDefault();
      window.PBStore.updateBooking(ref, {
        status: document.getElementById('admBkStatus').value,
        coordinator: document.getElementById('admBkCoordinator').value,
        instructions: document.getElementById('admBkCustNotes').value.trim(),
        internalNotes: document.getElementById('admBkInternalNotes').value.trim()
      });
      modal.classList.add('hidden');
      window.PBUI.toast(`Booking ${ref} updated and synced with Customer Dashboard!`, 'success');
      renderAdminBookingsTable();
      initAdminDashboardPage();
    });
  }

  function exportBookingsToCSV() {
    const bookings = window.PBStore.getBookings();
    const headers = ['Reference', 'Customer Name', 'Email', 'Phone', 'Event Type', 'Event Date', 'Start Time', 'Venue', 'City', 'Guests', 'Booth Style', 'Package', 'Backdrop', 'Estimated Total', 'Status', 'Coordinator'];
    const rows = bookings.map(b => [
      b.reference,
      `"${(b.customerName || '').replace(/"/g, '""')}"`,
      b.customerEmail,
      b.customerPhone,
      `"${b.eventType}"`,
      b.eventDate,
      b.startTime,
      `"${(b.venueName || '').replace(/"/g, '""')}"`,
      `"${(b.eventCity || '').replace(/"/g, '""')}"`,
      b.guestCount,
      `"${b.boothName}"`,
      `"${b.packageName}"`,
      `"${b.backdropName}"`,
      b.totalPrice,
      b.status,
      `"${b.coordinator || 'Unassigned'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapora-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.PBUI.toast(`Exported ${bookings.length} booking records to CSV!`, 'success', 'CSV Export Ready');
  }

  function initAdminBookingsPage() {
    const tbody = document.getElementById('adminBookingsTableBody');
    if (!tbody) return;
    renderAdminShell('Booking & Event Management');

    const evFilter = document.getElementById('admBookingEventFilter');
    if (evFilter) {
      const events = window.PBStore.getEvents();
      evFilter.innerHTML = `<option value="All">All Event Types</option>` +
        events.map(e => `<option value="${e.name}">${e.name}</option>`).join('');
      evFilter.addEventListener('change', (e) => {
        adminBookingsState.eventType = e.target.value;
        renderAdminBookingsTable();
      });
    }

    document.getElementById('admBookingSearch')?.addEventListener('input', (e) => {
      adminBookingsState.search = e.target.value.trim();
      renderAdminBookingsTable();
    });
    document.getElementById('admBookingStatusFilter')?.addEventListener('change', (e) => {
      adminBookingsState.status = e.target.value;
      renderAdminBookingsTable();
    });
    document.getElementById('admBookingDateFilter')?.addEventListener('change', (e) => {
      adminBookingsState.dateFilter = e.target.value;
      renderAdminBookingsTable();
    });
    document.getElementById('admBookingSort')?.addEventListener('change', (e) => {
      adminBookingsState.sortBy = e.target.value;
      renderAdminBookingsTable();
    });

    renderAdminBookingsTable();
  }

  // 3. ADMIN BOOTH MANAGEMENT (Section 21)
  function renderAdminBoothsGrid() {
    const grid = document.getElementById('adminBoothsGrid');
    if (!grid) return;

    let booths = window.PBStore.getBooths();
    if (adminBoothsState.search) {
      const q = adminBoothsState.search.toLowerCase();
      booths = booths.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.shortDesc.toLowerCase().includes(q));
    }
    if (adminBoothsState.availability !== 'All') {
      booths = booths.filter(b => b.availability === adminBoothsState.availability);
    }

    grid.innerHTML = booths.map(b => `
      <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] overflow-hidden flex flex-col justify-between shadow-xs">
        <div>
          <div class="relative h-48">
            <img src="${b.image}" alt="${b.name}" class="w-full h-full object-cover">
            <span class="absolute top-3 start-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${b.availability === 'Available' ? 'bg-[#2A7B76] text-white' : b.availability === 'Limited' ? 'bg-[#F4C95D] text-[#1F1A1C]' : 'bg-[#D9383A] text-white'}">${b.availability}</span>
            <span class="absolute top-3 end-3 px-3 py-1 rounded-full bg-[#2B192E]/90 text-[#F4C95D] text-xs font-extrabold">$${b.price}</span>
          </div>
          <div class="p-5">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#D9383A]">${b.category}</span>
            <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C] mt-0.5">${b.name}</h3>
            <p class="text-xs text-[#5A4B53] mt-1 line-clamp-2">${b.shortDesc}</p>
            <p class="text-[11px] text-[#84727B] mt-2"><i class="bi bi-people me-1"></i>${b.capacity}</p>
          </div>
        </div>
        <div class="p-5 pt-0 flex items-center gap-2">
          <button type="button" onclick="window.PBAdmin.openBoothModal('${b.id}')" class="btn-outline-vintage flex-1 !py-2 text-xs">
            <i class="bi bi-pencil-square"></i> Edit Booth
          </button>
          <button type="button" onclick="window.PBAdmin.deleteBoothItem('${b.id}')" aria-label="Delete ${b.name}" class="px-3 py-2 rounded-xl bg-red-500/10 text-[#D9383A] hover:bg-[#D9383A] hover:text-white text-xs font-bold transition">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  function openBoothModal(boothId = null) {
    const existing = boothId ? window.PBStore.getBoothById(boothId) : null;
    let modal = document.getElementById('adminBoothFormModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminBoothFormModal';
      modal.className = 'fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 hidden';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="surface-card bg-white rounded-3xl border-2 border-[#E6D8C7] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button type="button" onclick="document.getElementById('adminBoothFormModal').classList.add('hidden')" class="absolute top-5 end-5 w-8 h-8 rounded-full border border-[#E6D8C7] flex items-center justify-center">
          <i class="bi bi-x-lg text-xs"></i>
        </button>
        <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C]">${existing ? 'Edit Photo Booth' : 'Add New Photo Booth'}</h3>
        <p class="text-xs text-[#84727B] mt-0.5">Changes sync immediately with the public Photo Booth Styles page.</p>

        <form id="adminBoothForm" class="space-y-4 mt-5 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Booth Name *</label>
              <input type="text" id="bfName" required value="${existing ? existing.name : ''}" placeholder="e.g. Velvet Glam Booth" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Category *</label>
              <input type="text" id="bfCategory" required value="${existing ? existing.category : 'Open-Air Photo Booth'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="font-bold block mb-1">Starting Price ($) *</label>
              <input type="number" id="bfPrice" required min="100" value="${existing ? existing.price : 650}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Availability Status</label>
              <select id="bfStatus" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
                <option value="Available" ${existing?.availability === 'Available' ? 'selected' : ''}>Available</option>
                <option value="Limited" ${existing?.availability === 'Limited' ? 'selected' : ''}>Limited</option>
                <option value="Maintenance" ${existing?.availability === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
              </select>
            </div>
            <div>
              <label class="font-bold block mb-1">Base Duration</label>
              <input type="text" id="bfDuration" value="${existing ? existing.duration : '3 Hours Base Rental'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
          </div>
          <div>
            <label class="font-bold block mb-1">High-Res Image URL *</label>
            <input type="url" id="bfImage" required value="${existing ? existing.image : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Guest Capacity / Footprint</label>
            <input type="text" id="bfCapacity" value="${existing ? existing.capacity : 'Up to 10 guests per frame'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Short Description *</label>
            <textarea id="bfDesc" rows="2" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">${existing ? existing.shortDesc : ''}</textarea>
          </div>
          <div>
            <label class="font-bold block mb-1">Key Features (Comma separated)</label>
            <input type="text" id="bfFeatures" value="${existing ? (existing.features || []).join(', ') : 'Studio DSLR camera, Instant 2x6 prints, QR code sharing'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="document.getElementById('adminBoothFormModal').classList.add('hidden')" class="btn-outline-vintage !py-2.5 !px-4 text-xs">Cancel</button>
            <button type="submit" class="btn-cherry !py-2.5 !px-5 text-xs">${existing ? 'Update Booth' : 'Create Booth'}</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('adminBoothForm').addEventListener('submit', (e) => {
      e.preventDefault();
      window.PBStore.saveBooth({
        id: existing ? existing.id : undefined,
        name: document.getElementById('bfName').value.trim(),
        category: document.getElementById('bfCategory').value.trim(),
        price: Number(document.getElementById('bfPrice').value),
        availability: document.getElementById('bfStatus').value,
        duration: document.getElementById('bfDuration').value.trim(),
        image: document.getElementById('bfImage').value.trim(),
        capacity: document.getElementById('bfCapacity').value.trim(),
        shortDesc: document.getElementById('bfDesc').value.trim(),
        description: existing?.description || document.getElementById('bfDesc').value.trim(),
        features: document.getElementById('bfFeatures').value.split(',').map(s => s.trim()).filter(Boolean)
      });
      modal.classList.add('hidden');
      window.PBUI.toast('Photo booth inventory saved to LocalStorage!', 'success');
      renderAdminBoothsGrid();
    });
  }

  function initAdminBoothsPage() {
    const grid = document.getElementById('adminBoothsGrid');
    if (!grid) return;
    renderAdminShell('Photo Booth Inventory Management');

    document.getElementById('admBoothSearch')?.addEventListener('input', (e) => {
      adminBoothsState.search = e.target.value.trim();
      renderAdminBoothsGrid();
    });
    document.getElementById('admBoothAvailFilter')?.addEventListener('change', (e) => {
      adminBoothsState.availability = e.target.value;
      renderAdminBoothsGrid();
    });

    renderAdminBoothsGrid();
  }

  // 4. ADMIN PACKAGE MANAGEMENT (Section 22)
  function renderAdminPackagesGrid() {
    const grid = document.getElementById('adminPackagesGrid');
    if (!grid) return;

    const pkgs = window.PBStore.getPackages(true);
    grid.innerHTML = pkgs.map(p => `
      <div class="surface-card bg-white rounded-3xl border-2 ${p.recommended ? 'border-[#D9383A]' : 'border-[#E6D8C7]'} p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-[#FAF3E8] text-[#D9383A] text-[10px] font-extrabold uppercase">${p.category}</span>
            <div class="flex items-center gap-1.5">
              ${p.recommended ? '<span class="px-2 py-0.5 rounded-full bg-[#F4C95D] text-[#1F1A1C] text-[10px] font-extrabold">Recommended</span>' : ''}
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${p.active !== false ? 'bg-[#2A7B76]/15 text-[#2A7B76]' : 'bg-gray-200 text-gray-600'}">${p.active !== false ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mt-2">${p.name}</h3>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="font-serif-editorial text-2xl font-extrabold text-[#1F1A1C]">$${p.price}</span>
            <span class="text-xs text-[#84727B]">• ${p.duration}</span>
          </div>
          <p class="text-xs text-[#5A4B53] mt-2">${p.boothType}</p>
          <ul class="mt-3 space-y-1 text-xs text-[#5A4B53] border-t border-[#E6D8C7] pt-3">
            ${(p.features || []).slice(0, 4).map(f => `<li class="flex items-center gap-1.5"><i class="bi bi-check2 text-[#2A7B76]"></i> <span>${f}</span></li>`).join('')}
          </ul>
        </div>
        <div class="mt-5 pt-3 border-t border-[#E6D8C7] flex items-center gap-2">
          <button type="button" onclick="window.PBAdmin.openPackageModal('${p.id}')" class="btn-outline-vintage flex-1 !py-2 text-xs">
            <i class="bi bi-pencil-square"></i> Edit
          </button>
          <button type="button" onclick="window.PBAdmin.deletePackageItem('${p.id}')" aria-label="Delete ${p.name}" class="px-3 py-2 rounded-xl bg-red-500/10 text-[#D9383A] hover:bg-[#D9383A] hover:text-white text-xs font-bold transition">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  function openPackageModal(pkgId = null) {
    const existing = pkgId ? window.PBStore.getPackageById(pkgId) : null;
    let modal = document.getElementById('adminPackageFormModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminPackageFormModal';
      modal.className = 'fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 hidden';
      document.body.appendChild(modal);
    }

    const cats = ['Wedding', 'Birthday', 'Corporate', 'Private Party'];
    modal.innerHTML = `
      <div class="surface-card bg-white rounded-3xl border-2 border-[#E6D8C7] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button type="button" onclick="document.getElementById('adminPackageFormModal').classList.add('hidden')" class="absolute top-5 end-5 w-8 h-8 rounded-full border border-[#E6D8C7] flex items-center justify-center">
          <i class="bi bi-x-lg text-xs"></i>
        </button>
        <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C]">${existing ? 'Edit Rental Package' : 'Create Rental Package'}</h3>
        <form id="adminPackageForm" class="space-y-4 mt-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Package Name *</label>
              <input type="text" id="pfName" required value="${existing ? existing.name : ''}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Event Category *</label>
              <select id="pfCategory" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
                ${cats.map(c => `<option value="${c}" ${existing?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Price ($) *</label>
              <input type="number" id="pfPrice" required min="100" value="${existing ? existing.price : 795}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Rental Duration *</label>
              <input type="text" id="pfDuration" required value="${existing ? existing.duration : '4 Hours'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
          </div>
          <div>
            <label class="font-bold block mb-1">Included Booth Type</label>
            <input type="text" id="pfBoothType" value="${existing ? existing.boothType : 'Any Open-Air or Vintage Booth'}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Included Features (Comma separated)</label>
            <textarea id="pfFeatures" rows="3" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">${existing ? (existing.features || []).join(', ') : 'Unlimited 2x6 Prints, Custom Monogram, On-site Attendant, Online Cloud Gallery'}</textarea>
          </div>
          <div class="flex items-center gap-6 pt-1">
            <label class="flex items-center gap-2 font-bold cursor-pointer">
              <input type="checkbox" id="pfRecommended" ${existing?.recommended ? 'checked' : ''} class="w-4 h-4 accent-[#D9383A]">
              <span>Mark as Recommended Tier</span>
            </label>
            <label class="flex items-center gap-2 font-bold cursor-pointer">
              <input type="checkbox" id="pfActive" ${existing?.active !== false ? 'checked' : ''} class="w-4 h-4 accent-[#2A7B76]">
              <span>Active on Website</span>
            </label>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" onclick="document.getElementById('adminPackageFormModal').classList.add('hidden')" class="btn-outline-vintage !py-2.5 !px-4 text-xs">Cancel</button>
            <button type="submit" class="btn-cherry !py-2.5 !px-5 text-xs">Save Package</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('adminPackageForm').addEventListener('submit', (e) => {
      e.preventDefault();
      window.PBStore.savePackage({
        id: existing ? existing.id : undefined,
        name: document.getElementById('pfName').value.trim(),
        category: document.getElementById('pfCategory').value,
        price: Number(document.getElementById('pfPrice').value),
        duration: document.getElementById('pfDuration').value.trim(),
        boothType: document.getElementById('pfBoothType').value.trim(),
        printsDesc: existing?.printsDesc || 'Unlimited Archival Prints + Digital Copies',
        backdropChoices: existing?.backdropChoices || 'Choice of Any Standard or Shimmer Backdrop',
        features: document.getElementById('pfFeatures').value.split(',').map(s => s.trim()).filter(Boolean),
        recommended: document.getElementById('pfRecommended').checked,
        active: document.getElementById('pfActive').checked
      });
      modal.classList.add('hidden');
      window.PBUI.toast('Rental package saved and synced with Packages & Booking pages!', 'success');
      renderAdminPackagesGrid();
    });
  }

  function initAdminPackagesPage() {
    const grid = document.getElementById('adminPackagesGrid');
    if (!grid) return;
    renderAdminShell('Packages & Pricing Management');
    renderAdminPackagesGrid();
  }

  // 5. ADMIN CUSTOMER MANAGEMENT (Section 23)
  function renderAdminCustomersTable(searchQuery = '', statusFilter = 'All') {
    const tbody = document.getElementById('adminCustomersTableBody');
    if (!tbody) return;

    let customers = window.PBStore.getCustomersWithStats();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      customers = customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').includes(q));
    }
    if (statusFilter !== 'All') {
      customers = customers.filter(c => (c.status || 'Active') === statusFilter);
    }

    tbody.innerHTML = customers.map(c => `
      <tr class="hover:bg-[#FAF3E8]/60 transition">
        <td class="py-4 px-3">
          <div class="flex items-center gap-3">
            <img src="${c.avatar}" alt="${c.name}" class="w-10 h-10 rounded-full object-cover border border-[#E6D8C7]">
            <div>
              <p class="font-bold text-[#1F1A1C]">${c.name}</p>
              <p class="text-[11px] text-[#84727B]">${c.city || 'San Francisco, CA'}</p>
            </div>
          </div>
        </td>
        <td class="py-4 px-3">
          <p class="font-semibold text-[#1F1A1C]">${c.email}</p>
          <p class="text-[11px] text-[#84727B]">${c.phone}</p>
        </td>
        <td class="py-4 px-3 font-bold text-[#1F1A1C]">${c.bookingsCount} Total</td>
        <td class="py-4 px-3 text-[#2A7B76] font-bold">${c.upcomingCount} Upcoming</td>
        <td class="py-4 px-3 text-[#5A4B53]">${c.completedCount} Completed</td>
        <td class="py-4 px-3 font-serif-editorial font-extrabold text-sm text-[#1F1A1C]">$${c.estimatedSpending.toLocaleString()}</td>
        <td class="py-4 px-3">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${(c.status || 'Active') === 'Active' ? 'bg-[#2A7B76]/15 text-[#2A7B76]' : 'bg-amber-500/20 text-amber-700'}">${c.status || 'Active'}</span>
        </td>
        <td class="py-4 px-3 text-end">
          <button type="button" onclick="window.PBAdmin.openCustomerModal('${c.id}')" class="px-3 py-1.5 rounded-xl bg-[#FAF3E8] hover:bg-[#D9383A] hover:text-white text-xs font-bold transition">
            <i class="bi bi-person-lines-fill me-1"></i>View / Edit
          </button>
        </td>
      </tr>
    `).join('');
  }

  function openCustomerModal(userId) {
    const customers = window.PBStore.getCustomersWithStats();
    const cust = customers.find(c => c.id === userId);
    if (!cust) return;

    let modal = document.getElementById('adminCustomerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminCustomerModal';
      modal.className = 'fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 hidden';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="surface-card bg-white rounded-3xl border-2 border-[#E6D8C7] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button type="button" onclick="document.getElementById('adminCustomerModal').classList.add('hidden')" class="absolute top-5 end-5 w-8 h-8 rounded-full border border-[#E6D8C7] flex items-center justify-center">
          <i class="bi bi-x-lg text-xs"></i>
        </button>

        <div class="flex items-center gap-4 pb-4 border-b border-[#E6D8C7]">
          <img src="${cust.avatar}" alt="${cust.name}" class="w-14 h-14 rounded-full object-cover border-2 border-[#D9383A]">
          <div>
            <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C]">${cust.name}</h3>
            <p class="text-xs text-[#84727B]">${cust.email} • ${cust.phone} • Est. Spending: <strong class="text-[#2A7B76]">$${cust.estimatedSpending.toLocaleString()}</strong></p>
          </div>
        </div>

        <form id="adminCustEditForm" class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
          <div>
            <label class="font-bold block mb-1">Full Name</label>
            <input type="text" id="admCustName" value="${cust.name}" required class="w-full px-3 py-2 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Phone</label>
            <input type="text" id="admCustPhone" value="${cust.phone}" required class="w-full px-3 py-2 rounded-xl border border-[#E6D8C7]">
          </div>
          <div>
            <label class="font-bold block mb-1">Account Status</label>
            <select id="admCustStatus" class="w-full px-3 py-2 rounded-xl border border-[#E6D8C7] font-bold">
              <option value="Active" ${cust.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="VIP Client" ${cust.status === 'VIP Client' ? 'selected' : ''}>VIP Client</option>
              <option value="Inactive" ${cust.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div class="sm:col-span-3 flex justify-end">
            <button type="submit" class="btn-cherry !py-2 !px-4 text-xs">Save Customer Profile</button>
          </div>
        </form>

        <div class="mt-4 pt-4 border-t border-[#E6D8C7]">
          <h4 class="font-serif-editorial text-base font-bold text-[#1F1A1C] mb-3">Booking History (${cust.bookingHistory.length})</h4>
          <div class="space-y-2 max-h-48 overflow-y-auto text-xs">
            ${cust.bookingHistory.map(b => `
              <div class="p-3 rounded-2xl bg-[#FAF3E8] flex items-center justify-between">
                <div>
                  <span class="font-extrabold text-[#D9383A]">${b.reference}</span> • <strong>${b.boothName}</strong>
                  <p class="text-[11px] text-[#5A4B53]">${b.eventType} on ${b.eventDate} (${b.venueName})</p>
                </div>
                <div class="text-end">
                  <p class="font-bold">$${Number(b.totalPrice).toLocaleString()}</p>
                  ${window.PBUI.getStatusBadgeHtml(b.status)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('adminCustEditForm').addEventListener('submit', (e) => {
      e.preventDefault();
      window.PBStore.updateUser(cust.id, {
        name: document.getElementById('admCustName').value.trim(),
        phone: document.getElementById('admCustPhone').value.trim(),
        status: document.getElementById('admCustStatus').value
      });
      modal.classList.add('hidden');
      window.PBUI.toast('Customer profile updated!', 'success');
      renderAdminCustomersTable();
    });
  }

  function initAdminCustomersPage() {
    const tbody = document.getElementById('adminCustomersTableBody');
    if (!tbody) return;
    renderAdminShell('Customer Directory & History');

    let q = '';
    let st = 'All';
    document.getElementById('admCustSearch')?.addEventListener('input', (e) => {
      q = e.target.value.trim();
      renderAdminCustomersTable(q, st);
    });
    document.getElementById('admCustStatusFilter')?.addEventListener('change', (e) => {
      st = e.target.value;
      renderAdminCustomersTable(q, st);
    });

    renderAdminCustomersTable();
  }

  // 6. ADMIN REPORTS, BACKDROPS, ADD-ONS, REVIEWS & MESSAGES PAGE
  function initAdminReportsPage() {
    const root = document.getElementById('adminReportsRoot');
    if (!root) return;
    renderAdminShell('Analytics, Backdrops, Reviews & Inquiries');

    const backdrops = window.PBStore.getBackdrops();
    const addons = window.PBStore.getAddons();
    const reviews = window.PBStore.getReviews();
    const messages = window.PBStore.getMessages();

    root.innerHTML = `
      <div class="space-y-8">
        <!-- Export Banner -->
        <div class="rounded-3xl bg-[#FAF3E8] border border-[#E6D8C7] text-[#1F1A1C] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-[#D9383A]">Financial & Operations Export</span>
            <h2 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C] mt-1">Download Complete Booking & Revenue Ledger</h2>
            <p class="text-xs text-[#5A4B53] mt-1">Export all demo reservations, event dates, assigned coordinators, and estimated totals to CSV.</p>
          </div>
          <button type="button" onclick="window.PBAdmin.exportBookingsToCSV()" class="btn-cherry text-xs shrink-0">
            <i class="bi bi-file-earmark-spreadsheet-fill"></i>
            <span>Export Bookings to CSV</span>
          </button>
        </div>

        <!-- Messages Section -->
        <section id="messages" class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
          <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mb-4"><i class="bi bi-envelope-paper-heart text-[#D9383A] me-2"></i>Customer Inquiries & Quote Requests (${messages.length})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${messages.map(m => `
              <div class="p-4 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <strong class="text-sm text-[#1F1A1C]">${m.name}</strong>
                  <span class="px-2.5 py-0.5 rounded-full bg-[#D9383A]/15 text-[#D9383A] font-extrabold text-[10px]">${m.eventType} • ${m.eventDate}</span>
                </div>
                <p class="text-[#5A4B53]">${m.email} • ${m.phone}</p>
                <p class="text-[#1F1A1C] italic bg-white p-3 rounded-xl border border-[#E6D8C7]">"${m.message}"</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Backdrops & Add-ons Catalog Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="backdrops" class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Backdrop Inventory (${backdrops.length})</h3>
              <a href="../backdrops.html" class="text-xs font-bold text-[#D9383A]">Public View →</a>
            </div>
            <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              ${backdrops.map(b => `
                <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF3E8] text-xs">
                  <div class="flex items-center gap-3">
                    <img src="${b.image}" alt="${b.name}" class="w-10 h-10 rounded-xl object-cover">
                    <div>
                      <p class="font-bold text-[#1F1A1C]">${b.name}</p>
                      <p class="text-[10px] text-[#84727B]">${b.dimensions}</p>
                    </div>
                  </div>
                  <span class="font-extrabold ${b.price === 0 ? 'text-[#2A7B76]' : 'text-[#D9383A]'}">${b.price === 0 ? 'Included' : '+$' + b.price}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <section id="addons" class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Custom Add-Ons (${addons.length})</h3>
              <a href="../backdrops.html#addons-section" class="text-xs font-bold text-[#D9383A]">Public View →</a>
            </div>
            <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              ${addons.map(a => `
                <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF3E8] text-xs">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#D9383A]"><i class="bi ${a.icon}"></i></div>
                    <div>
                      <p class="font-bold text-[#1F1A1C]">${a.name}</p>
                      <p class="text-[10px] text-[#84727B]">${a.category}</p>
                    </div>
                  </div>
                  <span class="font-extrabold text-[#1F1A1C]">${a.price === 0 ? 'Included' : '+$' + a.price}</span>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <!-- Customer Reviews Section -->
        <section id="reviews" class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Submitted Customer Reviews (${reviews.length})</h3>
            <a href="../reviews.html" class="text-xs font-bold text-[#D9383A]">Public Reviews Page →</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            ${reviews.slice(0, 6).map(r => `
              <div class="p-4 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between text-amber-500 mb-2">
                    <span>${'★'.repeat(r.rating)}</span>
                    <span class="text-[10px] font-bold text-[#2A7B76]">${r.verifiedSample ? 'Verified Sample' : 'Demo User Review'}</span>
                  </div>
                  <p class="text-[#1F1A1C] italic">"${r.comment}"</p>
                </div>
                <div class="mt-3 pt-2 border-t border-[#E6D8C7] flex justify-between text-[11px] font-bold">
                  <span>${r.name}</span>
                  <span class="text-[#D9383A]">${r.eventType}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  // 7. ADMIN SETTINGS & DEMO RESET PAGE
  function initAdminSettingsPage() {
    const root = document.getElementById('adminSettingsRoot');
    if (!root) return;
    renderAdminShell('Platform Settings & Demo Data Control');

    root.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 sm:p-8">
          <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">Company & Booking Configuration</h2>
          <p class="text-xs text-[#84727B] mt-1">Configure demo business details and default reservation settings.</p>
          <form id="adminSettingsForm" class="space-y-4 mt-6 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="font-bold block mb-1.5">Company Brand Name</label>
                <input type="text" value="Snapora & Event Rentals" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label class="font-bold block mb-1.5">Dispatch Support Email</label>
                <input type="email" value="hello@snapora.demo" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="font-bold block mb-1.5">Support Hotline</label>
                <input type="text" value="(800) 555-SNAP" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label class="font-bold block mb-1.5">Default New Booking Status</label>
                <select class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
                  <option value="Pending" selected>Pending (Requires Coordinator Review)</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn-cherry !py-3 !px-6 text-xs">Save Platform Settings</button>
          </form>
        </div>

        <!-- Reset Demo Data Card (Section 30) -->
        <div class="surface-card bg-white rounded-3xl border-2 border-[#D9383A]/40 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span class="px-3 py-1 rounded-full bg-[#D9383A]/10 text-[#D9383A] text-[10px] font-extrabold uppercase tracking-wider">LocalStorage Sandbox</span>
            <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mt-3">Reset All Demo Data</h3>
            <p class="text-xs text-[#5A4B53] mt-2 leading-relaxed">
              Restore all 12 photo booths, 12 packages, 10 backdrops, 12 add-ons, sample bookings, and customer accounts back to their clean factory defaults.
            </p>
          </div>
          <div class="mt-6 space-y-3">
            <button type="button" onclick="window.PBAdmin.resetFactoryDemoData()" class="w-full py-3 rounded-xl bg-[#D9383A] text-white font-extrabold text-xs hover:bg-[#B8282A] transition shadow-md">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset LocalStorage to Factory Defaults
            </button>
            <p class="text-[11px] text-[#84727B] text-center">LocalStorage is stored locally in your browser and is not shared across external devices.</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('adminSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.PBUI.toast('Platform configuration saved to LocalStorage!', 'success');
    });
  }

  window.PBAdmin = {
    initAdminDashboardPage,
    initAdminBookingsPage,
    initAdminBoothsPage,
    initAdminPackagesPage,
    initAdminCustomersPage,
    initAdminReportsPage,
    initAdminSettingsPage,
    openAdminBookingModal,
    exportBookingsToCSV,
    openBoothModal,
    openPackageModal,
    openCustomerModal,
    quickUpdateBookingStatus(ref, newStatus) {
      window.PBStore.updateBooking(ref, { status: newStatus });
      window.PBUI.toast(`Booking ${ref} updated to "${newStatus}"!`, 'success');
      renderAdminBookingsTable();
      initAdminDashboardPage();
    },
    deleteBoothItem(id) {
      if (!window.confirm('Delete this photo booth from demo inventory?')) return;
      window.PBStore.deleteBooth(id);
      window.PBUI.toast('Photo booth removed from inventory.', 'warning');
      renderAdminBoothsGrid();
    },
    deletePackageItem(id) {
      if (!window.confirm('Delete this rental package from demo pricing?')) return;
      window.PBStore.deletePackage(id);
      window.PBUI.toast('Package deleted.', 'warning');
      renderAdminPackagesGrid();
    },
    resetFactoryDemoData() {
      if (!window.confirm('Reset all bookings, booths, packages, and reviews to factory demo defaults?')) return;
      window.PBStore.resetAllDemoData();
      window.PBUI.toast('All LocalStorage demo data has been restored to factory defaults!', 'success', 'Demo Data Reset');
      setTimeout(() => window.location.reload(), 900);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboardPage();
    initAdminBookingsPage();
    initAdminBoothsPage();
    initAdminPackagesPage();
    initAdminCustomersPage();
    initAdminReportsPage();
    initAdminSettingsPage();
  });
})(window, document);
