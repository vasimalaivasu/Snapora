/**
 * SNAPORA - Customer Dashboard, My Bookings, Status Tracking, Favorites & Profile Engine
 */
(function (window, document) {
  'use strict';

  let currentCustomer = null;
  let bookingsFilterState = {
    search: '',
    status: 'All',
    dateFilter: 'All',
    sortBy: 'newest',
    page: 1,
    perPage: 5
  };

  function getActiveCustomer() {
    if (currentCustomer) return currentCustomer;
    const session = window.PBAuth ? window.PBAuth.requireAuth('customer') : null;
    if (!session) return null;
    const users = window.PBStore.getUsers();
    currentCustomer = users.find(u => u.id === session.id || u.email.toLowerCase() === session.email.toLowerCase()) || session;
    return currentCustomer;
  }

  function renderCustomerShell(pageTitle = 'Customer Dashboard') {
    const user = getActiveCustomer();
    if (!user) return;

    const sidebarMount = document.getElementById('customerSidebarMount');
    const headerMount = document.getElementById('customerHeaderMount');
    const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
    const notifs = window.PBStore.getNotifications('customer');
    const unreadCount = notifs.filter(n => !n.read).length;

    const navItems = [
      { href: 'dashboard.html', icon: 'bi-grid-1x2-fill', label: 'Dashboard Overview' },
      { href: 'bookings.html', icon: 'bi-calendar2-check-fill', label: 'My Bookings' },
      { href: 'booking-details.html', icon: 'bi-geo-fill', label: 'Status Tracker' },
      { href: 'favorites.html', icon: 'bi-heart-fill', label: 'Saved Favorites' },
      { href: 'profile.html', icon: 'bi-person-Lines-fill bi-person-vcard-fill', label: 'Customer Profile' }
    ];

    if (sidebarMount) {
      sidebarMount.innerHTML = `
        <div id="custMobileOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 hidden lg:hidden"></div>
        <aside id="custSidebar" class="fixed lg:static inset-y-0 start-0 w-72 bg-white surface-card border-e border-[#E6D8C7] flex flex-col transform -translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0 transition-transform duration-300 z-50 shadow-xl lg:shadow-none h-screen">
          <div class="p-5 border-b border-[#E6D8C7] flex items-center justify-between">
            <a href="../index.html" class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#D9383A] text-white flex items-center justify-center shadow-md">
                <i class="bi bi-camera-reels-fill text-lg"></i>
              </div>
              <div>
                <span class="font-serif-editorial font-extrabold text-lg text-[#1F1A1C] block leading-none">SNAPORA</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#D9383A]">Client Portal</span>
              </div>
            </a>
            <button type="button" id="closeCustSidebarBtn" aria-label="Close Sidebar" class="lg:hidden w-8 h-8 rounded-lg border border-[#E6D8C7] flex items-center justify-center">
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          <div class="p-4 mx-4 mt-4 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] flex items-center gap-3">
            <img src="${user.avatar}" alt="${user.name}" class="w-11 h-11 rounded-full object-cover border-2 border-[#D9383A]">
            <div class="min-w-0">
              <p class="font-bold text-xs text-[#1F1A1C] truncate">${user.name}</p>
              <p class="text-[11px] text-[#84727B] truncate">${user.email}</p>
              <span class="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-[#2A7B76]/15 text-[#2A7B76] text-[10px] font-extrabold">VIP Event Host</span>
            </div>
          </div>

          <nav class="flex-1 p-4 space-y-1.5 text-sm font-semibold overflow-y-auto" aria-label="Customer Sidebar Navigation">
            ${navItems.map(item => {
              const active = currentFile === item.href;
              return `
                <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? 'bg-[#D9383A] text-white font-bold shadow-md' : 'text-[#5A4B53] hover:bg-[#FAF3E8] hover:text-[#1F1A1C]'}">
                  <i class="bi ${item.icon} text-base"></i>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}

            <div class="pt-4 mt-4 border-t border-[#E6D8C7] space-y-1.5">
              <p class="px-4 text-[10px] font-extrabold uppercase tracking-widest text-[#84727B]">Quick Actions</p>
              <a href="../booking.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#D9383A] hover:bg-[#FAF3E8] font-bold">
                <i class="bi bi-plus-circle-fill"></i> New Booth Booking
              </a>
              <a href="../booths.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#5A4B53] hover:bg-[#FAF3E8]">
                <i class="bi bi-camera2"></i> Explore Booth Styles
              </a>
              <a href="../index.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#5A4B53] hover:bg-[#FAF3E8]">
                <i class="bi bi-globe"></i> Public Website
              </a>
            </div>
          </nav>

          <div class="p-4 border-t border-[#E6D8C7]">
            <button type="button" onclick="window.PBAuth.logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-[#D9383A] hover:bg-[#D9383A] hover:text-white font-bold text-xs transition">
              <i class="bi bi-box-arrow-right"></i> Sign Out of Portal
            </button>
          </div>
        </aside>
      `;
    }

    if (headerMount) {
      headerMount.innerHTML = `
        <header class="bg-white border-b border-[#E6D8C7] px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button type="button" id="openCustSidebarBtn" aria-label="Open Sidebar" class="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-[#1F1A1C]/25 text-[#1F1A1C] hover:border-[#D9383A] hover:text-[#D9383A] flex items-center justify-center text-xl sm:text-2xl font-extrabold shadow-sm transition active:scale-95 shrink-0">
              <i class="bi bi-list"></i>
            </button>
            <div class="min-w-0">
              <h1 class="font-serif-editorial text-base sm:text-xl font-bold text-[#1F1A1C] truncate leading-tight" title="${pageTitle}">${pageTitle}</h1>
              <p class="text-[11px] text-[#84727B] hidden sm:block truncate">Manage your photo booth reservations, backdrops, and event timeline</p>
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

            <!-- Notifications Dropdown -->
            <div class="relative shrink-0">
              <button type="button" id="custNotifBtn" aria-label="Notifications" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#E6D8C7] flex items-center justify-center relative hover:border-[#D9383A] transition shrink-0">
                <i class="bi bi-bell-fill text-xs sm:text-sm"></i>
                ${unreadCount > 0 ? `<span class="w-2.5 h-2.5 rounded-full bg-[#D9383A] absolute top-1 end-1"></span>` : ''}
              </button>
              <div id="custNotifDropdown" class="hidden absolute end-0 mt-2 w-72 sm:w-80 bg-white surface-card rounded-2xl shadow-2xl border border-[#E6D8C7] p-3 z-50">
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-[#E6D8C7]">
                  <span class="font-bold text-xs text-[#1F1A1C]">Booking Notifications</span>
                  <span class="text-[10px] font-bold text-[#D9383A]">${notifs.length} Updates</span>
                </div>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  ${notifs.map(n => `
                    <a href="${n.link}" class="block p-2.5 rounded-xl bg-[#FAF3E8] hover:border-[#D9383A] border border-transparent transition">
                      <p class="font-bold text-xs text-[#1F1A1C]">${n.title}</p>
                      <p class="text-[11px] text-[#5A4B53] mt-0.5">${n.text}</p>
                      <span class="text-[10px] text-[#84727B] mt-1 block">${n.time}</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            </div>

            <a href="../booking.html" class="btn-cherry !py-1.5 sm:!py-2 !px-2.5 sm:!px-3.5 text-xs hidden sm:inline-flex shrink-0 whitespace-nowrap">
              <i class="bi bi-calendar-plus"></i>
              <span>Book a Booth</span>
            </a>
          </div>
        </header>
      `;
    }

    // Wire mobile sidebar & notifications
    const openBtn = document.getElementById('openCustSidebarBtn');
    const closeBtn = document.getElementById('closeCustSidebarBtn');
    const overlay = document.getElementById('custMobileOverlay');
    const sidebar = document.getElementById('custSidebar');

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

    const notifBtn = document.getElementById('custNotifBtn');
    const notifDrop = document.getElementById('custNotifDropdown');
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDrop.classList.toggle('hidden');
      window.PBStore.markNotificationsRead('customer');
    });
    document.addEventListener('click', () => notifDrop?.classList.add('hidden'));

    window.PBUI.updateThemeAndRtlIcons();
  }

  // 1. OVERVIEW PAGE
  function initOverviewPage() {
    const root = document.getElementById('custOverviewRoot');
    if (!root) return;
    renderCustomerShell('Dashboard Overview');

    const user = getActiveCustomer();
    const myBookings = window.PBStore.getCustomerBookings(user);
    const today = '2026-10-13';

    const totalBookings = myBookings.length;
    const upcomingEvents = myBookings.filter(b => b.eventDate >= today && b.status !== 'Cancelled' && b.status !== 'Event Completed');
    const pendingRes = myBookings.filter(b => b.status === 'Pending' || b.status === 'Booking Requested' || b.status === 'Under Review');
    const confirmedRes = myBookings.filter(b => b.status === 'Confirmed' || b.status === 'Event Preparation');
    const completedRes = myBookings.filter(b => b.status === 'Event Completed');
    const totalValue = myBookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

    const nextUpcoming = [...upcomingEvents].sort((a, b) => a.eventDate.localeCompare(b.eventDate))[0] || myBookings[0];

    root.innerHTML = `
      <!-- Welcome Hero Card -->
      <div class="rounded-3xl bg-gradient-to-r from-[#2B192E] via-[#3B2240] to-[#D9383A] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full bg-white/15 text-[#F4C95D] text-xs font-extrabold uppercase tracking-wider mb-2">Customer Reservation Portal</span>
          <h2 class="font-serif-editorial text-2xl sm:text-3xl font-bold">Welcome back, ${user.name.split(' ')[0]}!</h2>
          <p class="text-sm text-white/85 mt-1.5 leading-relaxed">
            Track your upcoming photo booth setups, customize your backdrop and print templates, or book a new booth for your next celebration.
          </p>
          <div class="flex flex-wrap gap-3 mt-5">
            <a href="../booking.html" class="px-5 py-2.5 rounded-xl bg-[#F4C95D] text-[#1F1A1C] font-extrabold text-xs shadow-md hover:bg-white transition">
              <i class="bi bi-calendar2-plus-fill me-1"></i> Book Another Booth
            </a>
            <a href="bookings.html" class="px-5 py-2.5 rounded-xl bg-white/15 text-white font-bold text-xs hover:bg-white/25 transition">
              Manage My Bookings (${totalBookings})
            </a>
          </div>
        </div>
        <i class="bi bi-camera-reels text-9xl text-white/10 absolute -bottom-6 end-6 pointer-events-none"></i>
      </div>

      <!-- 6 Statistics Cards (Section 13) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mt-6">
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Total Bookings</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-[#1F1A1C] mt-1">${totalBookings}</p>
          <span class="text-[10px] sm:text-[11px] text-[#2A7B76] font-semibold truncate block">All-time reservations</span>
        </div>
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Upcoming Events</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-[#D9383A] mt-1">${upcomingEvents.length}</p>
          <span class="text-[10px] sm:text-[11px] text-[#5A4B53] truncate block">Scheduled ahead</span>
        </div>
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Pending Review</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">${pendingRes.length}</p>
          <span class="text-[10px] sm:text-[11px] text-[#5A4B53] truncate block">Awaiting confirmation</span>
        </div>
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Confirmed</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-[#2A7B76] mt-1">${confirmedRes.length}</p>
          <span class="text-[10px] sm:text-[11px] text-[#2A7B76] font-semibold truncate block">Locked in calendar</span>
        </div>
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Completed Events</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-[#1F1A1C] mt-1">${completedRes.length}</p>
          <span class="text-[10px] sm:text-[11px] text-[#5A4B53] truncate block">Galleries delivered</span>
        </div>
        <div class="surface-card bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E6D8C7] shadow-xs">
          <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#84727B] truncate block">Est. Booking Value</span>
          <p class="font-serif-editorial text-xl sm:text-2xl font-extrabold text-[#1F1A1C] mt-1">$${totalValue.toLocaleString()}</p>
          <span class="text-[10px] sm:text-[11px] text-[#84727B] truncate block">Demo total value</span>
        </div>
      </div>

      <!-- Next Upcoming Event + Recent Booking Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Next Upcoming Event Highlight -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#D9383A]"><i class="bi bi-calendar-heart me-1"></i>Next Upcoming Event</span>
              ${nextUpcoming ? window.PBUI.getStatusBadgeHtml(nextUpcoming.status) : ''}
            </div>
            ${nextUpcoming ? `
              <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">${nextUpcoming.boothName}</h3>
              <p class="text-xs font-semibold text-[#2A7B76] mt-0.5">${nextUpcoming.packageName} Package • ${nextUpcoming.eventType}</p>

              <div class="mt-4 p-4 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] space-y-2 text-xs text-[#5A4B53]">
                <div class="flex justify-between"><span>Reference:</span> <strong class="text-[#1F1A1C]">${nextUpcoming.reference}</strong></div>
                <div class="flex justify-between"><span>Event Date:</span> <strong class="text-[#1F1A1C]">${nextUpcoming.eventDate} (${nextUpcoming.startTime})</strong></div>
                <div class="flex justify-between"><span>Venue:</span> <strong class="text-[#1F1A1C] truncate max-w-[180px]">${nextUpcoming.venueName}</strong></div>
                <div class="flex justify-between"><span>Backdrop:</span> <strong class="text-[#1F1A1C]">${nextUpcoming.backdropName}</strong></div>
                <div class="flex justify-between"><span>Coordinator:</span> <strong class="text-[#1F1A1C]">${nextUpcoming.coordinator || 'Assigned Soon'}</strong></div>
              </div>
            ` : `<p class="text-xs text-[#5A4B53]">No upcoming events scheduled yet.</p>`}
          </div>
          ${nextUpcoming ? `
            <div class="mt-5 pt-4 border-t border-[#E6D8C7] flex gap-2">
              <a href="booking-details.html?ref=${encodeURIComponent(nextUpcoming.reference)}" class="btn-cherry flex-1 !py-2.5 text-xs">Track Status</a>
              <a href="bookings.html" class="btn-outline-vintage !py-2.5 !px-4 text-xs">All Bookings</a>
            </div>
          ` : ''}
        </div>

        <!-- Recent Booking Activity Table -->
        <div class="lg:col-span-2 surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Recent Booking Activity</h3>
              <p class="text-xs text-[#84727B]">Synchronized live with browser LocalStorage</p>
            </div>
            <a href="bookings.html" class="text-xs font-bold text-[#D9383A] hover:underline">View All →</a>
          </div>
          <div class="table-responsive">
            <table class="w-full text-start text-xs">
              <thead>
                <tr class="border-b border-[#E6D8C7] text-[#84727B] uppercase text-[10px]">
                  <th class="py-3 px-2 text-start">Reference</th>
                  <th class="py-3 px-2 text-start">Event & Date</th>
                  <th class="py-3 px-2 text-start">Booth & Package</th>
                  <th class="py-3 px-2 text-start">Est. Total</th>
                  <th class="py-3 px-2 text-start">Status</th>
                  <th class="py-3 px-2 text-end">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E6D8C7]">
                ${myBookings.slice(0, 4).map(b => `
                  <tr class="hover:bg-[#FAF3E8]/60 transition">
                    <td class="py-3.5 px-2 font-bold text-[#D9383A]">${b.reference}</td>
                    <td class="py-3.5 px-2">
                      <p class="font-bold text-[#1F1A1C]">${b.eventType}</p>
                      <p class="text-[11px] text-[#84727B]">${b.eventDate}</p>
                    </td>
                    <td class="py-3.5 px-2">
                      <p class="font-semibold text-[#1F1A1C]">${b.boothName}</p>
                      <p class="text-[11px] text-[#84727B]">${b.packageName}</p>
                    </td>
                    <td class="py-3.5 px-2 font-bold text-[#1F1A1C]">$${Number(b.totalPrice).toLocaleString()}</td>
                    <td class="py-3.5 px-2">${window.PBUI.getStatusBadgeHtml(b.status)}</td>
                    <td class="py-3.5 px-2 text-end">
                      <a href="booking-details.html?ref=${encodeURIComponent(b.reference)}" class="px-3 py-1.5 rounded-lg bg-[#FAF3E8] hover:bg-[#D9383A] hover:text-white font-bold transition inline-block">Details</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 2. MY BOOKINGS PAGE
  function renderMyBookingsTable() {
    const tbody = document.getElementById('custBookingsTableBody');
    const paginationEl = document.getElementById('custBookingsPagination');
    if (!tbody) return;

    const user = getActiveCustomer();
    let list = window.PBStore.getCustomerBookings(user);
    const today = '2026-10-13';

    // Filter by search
    if (bookingsFilterState.search) {
      const q = bookingsFilterState.search.toLowerCase();
      list = list.filter(b =>
        b.reference.toLowerCase().includes(q) ||
        b.boothName.toLowerCase().includes(q) ||
        b.eventType.toLowerCase().includes(q) ||
        (b.venueName || '').toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (bookingsFilterState.status !== 'All') {
      list = list.filter(b => b.status === bookingsFilterState.status);
    }

    // Filter by date
    if (bookingsFilterState.dateFilter === 'upcoming') {
      list = list.filter(b => b.eventDate >= today);
    } else if (bookingsFilterState.dateFilter === 'past') {
      list = list.filter(b => b.eventDate < today);
    }

    // Sort
    list.sort((a, b) => {
      if (bookingsFilterState.sortBy === 'date-asc') return a.eventDate.localeCompare(b.eventDate);
      if (bookingsFilterState.sortBy === 'price-desc') return Number(b.totalPrice) - Number(a.totalPrice);
      if (bookingsFilterState.sortBy === 'price-asc') return Number(a.totalPrice) - Number(b.totalPrice);
      return b.eventDate.localeCompare(a.eventDate);
    });

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center">
            <i class="bi bi-calendar-x text-3xl text-[#D9383A]"></i>
            <p class="font-serif-editorial text-base font-bold text-[#1F1A1C] mt-2">No reservations match your current filters</p>
            <p class="text-xs text-[#84727B] mt-1">Try resetting the search bar or book a new booth experience.</p>
          </td>
        </tr>
      `;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(list.length / bookingsFilterState.perPage) || 1;
    if (bookingsFilterState.page > totalPages) bookingsFilterState.page = 1;
    const startIdx = (bookingsFilterState.page - 1) * bookingsFilterState.perPage;
    const paged = list.slice(startIdx, startIdx + bookingsFilterState.perPage);

    tbody.innerHTML = paged.map(b => {
      const canEditOrCancel = !['Cancelled', 'Event Completed'].includes(b.status);
      return `
        <tr class="hover:bg-[#FAF3E8]/60 transition">
          <td class="py-4 px-3 font-extrabold text-[#D9383A]">${b.reference}</td>
          <td class="py-4 px-3">
            <p class="font-bold text-[#1F1A1C]">${b.eventType}</p>
            <p class="text-[11px] text-[#84727B]">${b.venueName || ''}</p>
          </td>
          <td class="py-4 px-3">
            <p class="font-semibold text-[#1F1A1C]">${b.eventDate}</p>
            <p class="text-[11px] text-[#84727B]">${b.startTime} (${b.duration})</p>
          </td>
          <td class="py-4 px-3">
            <p class="font-bold text-[#1F1A1C]">${b.boothName}</p>
            <p class="text-[11px] text-[#2A7B76] font-semibold">${b.packageName}</p>
          </td>
          <td class="py-4 px-3 font-serif-editorial text-sm font-extrabold text-[#1F1A1C]">$${Number(b.totalPrice).toLocaleString()}</td>
          <td class="py-4 px-3">${window.PBUI.getStatusBadgeHtml(b.status)}</td>
          <td class="py-4 px-3 text-end">
            <div class="inline-flex items-center gap-1.5">
              <a href="booking-details.html?ref=${encodeURIComponent(b.reference)}" class="px-2.5 py-1.5 rounded-lg bg-[#FAF3E8] hover:bg-[#2B192E] hover:text-white text-xs font-bold transition" title="View Details">
                <i class="bi bi-eye"></i> View
              </a>
              ${canEditOrCancel ? `
                <button type="button" onclick="window.PBCustomer.openEditBookingModal('${b.reference}')" class="px-2.5 py-1.5 rounded-lg bg-[#FAF3E8] hover:bg-[#2A7B76] hover:text-white text-xs font-bold transition" title="Edit Booking">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button type="button" onclick="window.PBCustomer.cancelCustomerBooking('${b.reference}')" class="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-[#D9383A] hover:bg-[#D9383A] hover:text-white text-xs font-bold transition" title="Cancel Booking">
                  <i class="bi bi-x-circle"></i> Cancel
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (paginationEl) {
      paginationEl.innerHTML = `
        <span class="text-xs text-[#84727B]">Showing ${startIdx + 1}–${Math.min(startIdx + paged.length, list.length)} of ${list.length} reservations</span>
        <div class="flex items-center gap-1.5">
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
            <button type="button" onclick="window.PBCustomer.setBookingsPage(${p})" class="w-8 h-8 rounded-lg text-xs font-bold ${p === bookingsFilterState.page ? 'bg-[#D9383A] text-white' : 'bg-[#FAF3E8] text-[#1F1A1C]'}">${p}</button>
          `).join('')}
        </div>
      `;
    }
  }

  function initMyBookingsPage() {
    const tbody = document.getElementById('custBookingsTableBody');
    if (!tbody) return;
    renderCustomerShell('My Bookings');

    document.getElementById('custBookingSearch')?.addEventListener('input', (e) => {
      bookingsFilterState.search = e.target.value.trim();
      bookingsFilterState.page = 1;
      renderMyBookingsTable();
    });
    document.getElementById('custBookingStatusFilter')?.addEventListener('change', (e) => {
      bookingsFilterState.status = e.target.value;
      bookingsFilterState.page = 1;
      renderMyBookingsTable();
    });
    document.getElementById('custBookingDateFilter')?.addEventListener('change', (e) => {
      bookingsFilterState.dateFilter = e.target.value;
      bookingsFilterState.page = 1;
      renderMyBookingsTable();
    });
    document.getElementById('custBookingSort')?.addEventListener('change', (e) => {
      bookingsFilterState.sortBy = e.target.value;
      renderMyBookingsTable();
    });

    renderMyBookingsTable();
  }

  function openEditBookingModal(ref) {
    const booking = window.PBStore.getBookingByRef(ref);
    if (!booking) return;

    let modal = document.getElementById('custEditBookingModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'custEditBookingModal';
      modal.className = 'fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 hidden';
      document.body.appendChild(modal);
    }

    const backdrops = window.PBStore.getBackdrops();
    const minDate = new Date().toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="surface-card bg-white rounded-3xl border-2 border-[#E6D8C7] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button type="button" onclick="document.getElementById('custEditBookingModal').classList.add('hidden')" class="absolute top-5 end-5 w-8 h-8 rounded-full border border-[#E6D8C7] flex items-center justify-center">
          <i class="bi bi-x-lg text-xs"></i>
        </button>
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Modify Reservation ${booking.reference}</span>
        <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C] mt-1">Edit Event Details</h3>
        <form id="custEditBookingForm" class="space-y-4 mt-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Event Date *</label>
              <input type="date" id="editBkDate" min="${minDate}" value="${booking.eventDate}" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Start Time *</label>
              <input type="time" id="editBkTime" value="${booking.startTime || '18:00'}" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold block mb-1">Venue Name *</label>
              <input type="text" id="editBkVenue" value="${booking.venueName || ''}" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
            <div>
              <label class="font-bold block mb-1">Guest Count *</label>
              <input type="number" id="editBkGuests" min="10" max="5000" value="${booking.guestCount || 100}" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
            </div>
          </div>
          <div>
            <label class="font-bold block mb-1">Backdrop Choice</label>
            <select id="editBkBackdrop" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">
              ${backdrops.map(b => `<option value="${b.id}" ${b.id === booking.backdropId ? 'selected' : ''}>${b.name} (${b.price === 0 ? 'Included' : '+$' + b.price})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1">Special Instructions</label>
            <textarea id="editBkNotes" rows="3" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D8C7]">${booking.instructions || ''}</textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" onclick="document.getElementById('custEditBookingModal').classList.add('hidden')" class="btn-outline-vintage !py-2.5 !px-4 text-xs">Cancel</button>
            <button type="submit" class="btn-cherry !py-2.5 !px-5 text-xs">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('custEditBookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newBackdrop = window.PBStore.getBackdropById(document.getElementById('editBkBackdrop').value);
      const newTotal = Number(booking.basePrice || 695) + Number(newBackdrop.price || 0) + Number(booking.addonsPrice || 0);

      window.PBStore.updateBooking(ref, {
        eventDate: document.getElementById('editBkDate').value,
        startTime: document.getElementById('editBkTime').value,
        venueName: document.getElementById('editBkVenue').value.trim(),
        guestCount: Number(document.getElementById('editBkGuests').value),
        backdropId: newBackdrop.id,
        backdropName: newBackdrop.name,
        backdropPrice: Number(newBackdrop.price || 0),
        totalPrice: newTotal,
        instructions: document.getElementById('editBkNotes').value.trim()
      });

      modal.classList.add('hidden');
      window.PBUI.toast(`Reservation ${ref} updated in LocalStorage!`, 'success');
      renderMyBookingsTable();
      initBookingDetailsPage();
    });
  }

  function cancelCustomerBooking(ref) {
    const confirmed = window.confirm(`Are you sure you want to cancel demo reservation ${ref}? This will update its status to Cancelled.`);
    if (!confirmed) return;
    window.PBStore.updateBooking(ref, { status: 'Cancelled' });
    window.PBUI.toast(`Booking ${ref} has been marked as Cancelled.`, 'warning', 'Reservation Cancelled');
    renderMyBookingsTable();
    initBookingDetailsPage();
  }

  // 3. BOOKING DETAILS & STATUS TRACKING PAGE (Sections 13 & 14)
  function initBookingDetailsPage() {
    const root = document.getElementById('custBookingDetailsRoot');
    if (!root) return;
    renderCustomerShell('Reservation Details & Status Tracker');

    const params = new URLSearchParams(window.location.search);
    const user = getActiveCustomer();
    const myBookings = window.PBStore.getCustomerBookings(user);
    const requestedRef = params.get('ref');
    const booking = requestedRef
      ? window.PBStore.getBookingByRef(requestedRef)
      : (myBookings[0] || window.PBStore.getBookings()[0]);

    if (!booking) return;

    const stages = [
      { key: 'Booking Requested', match: ['Pending', 'Booking Requested'], icon: 'bi-send-check-fill', desc: 'Online reservation submitted' },
      { key: 'Under Review', match: ['Under Review'], icon: 'bi-Clipboard2-check-fill bi-search', desc: 'Coordinator verifying booth & venue' },
      { key: 'Confirmed', match: ['Confirmed'], icon: 'bi-check-circle-fill', desc: 'Date locked & COI prepared' },
      { key: 'Event Preparation', match: ['Event Preparation'], icon: 'bi-magic', desc: 'Custom strip & backdrop staged' },
      { key: 'Event Completed', match: ['Event Completed'], icon: 'bi-stars', desc: 'Prints & cloud gallery delivered' }
    ];

    let activeStageIdx = 0;
    stages.forEach((st, idx) => {
      if (st.match.includes(booking.status)) activeStageIdx = idx;
    });
    const isCancelled = booking.status === 'Cancelled';
    const canModify = !['Cancelled', 'Event Completed'].includes(booking.status);

    root.innerHTML = `
      <!-- Switch Reservation Bar -->
      <div class="surface-card bg-white rounded-2xl border border-[#E6D8C7] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <a href="bookings.html" class="w-9 h-9 rounded-xl bg-[#FAF3E8] flex items-center justify-center text-[#1F1A1C] hover:bg-[#D9383A] hover:text-white transition">
            <i class="bi bi-arrow-left rtl-flip"></i>
          </a>
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B]">Tracking Reservation</span>
            <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">${booking.reference} — ${booking.boothName}</h2>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <label for="bookingSwitcherSelect" class="text-xs font-bold text-[#5A4B53] shrink-0">Switch Booking:</label>
          <select id="bookingSwitcherSelect" class="px-3.5 py-2 rounded-xl border border-[#E6D8C7] bg-[#FAF3E8] text-xs font-bold flex-1">
            ${window.PBStore.getBookings().map(b => `
              <option value="${b.reference}" ${b.reference === booking.reference ? 'selected' : ''}>${b.reference} • ${b.eventType} (${b.status})</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Status Tracking Timeline Card (Section 14) -->
      <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 sm:p-8 mt-6">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6D8C7]">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#D9383A]">Live Reservation Progress</span>
            <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C] mt-1">Booking Status Tracker</h3>
            <p class="text-xs text-[#84727B] mt-0.5">Last status update: ${new Date(booking.updatedAt).toLocaleString()}</p>
          </div>
          <div class="flex items-center gap-3">
            ${window.PBUI.getStatusBadgeHtml(booking.status)}
            ${canModify ? `
              <button type="button" onclick="window.PBCustomer.openEditBookingModal('${booking.reference}')" class="btn-outline-vintage !py-2 !px-3.5 text-xs">
                <i class="bi bi-pencil-square"></i> Edit Booking
              </button>
              <button type="button" onclick="window.PBCustomer.cancelCustomerBooking('${booking.reference}')" class="px-3.5 py-2 rounded-xl bg-red-500/10 text-[#D9383A] hover:bg-[#D9383A] hover:text-white font-bold text-xs transition">
                Cancel
              </button>
            ` : ''}
          </div>
        </div>

        ${isCancelled ? `
          <div class="mt-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-4">
            <i class="bi bi-x-octagon-fill text-3xl text-[#D9383A]"></i>
            <div>
              <h4 class="font-bold text-sm text-[#1F1A1C]">This reservation has been Cancelled</h4>
              <p class="text-xs text-[#5A4B53] mt-0.5">Want to reinstate or book a new date? Start a fresh booking anytime or update status in the Admin Dashboard.</p>
            </div>
          </div>
        ` : `
          <div class="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            ${stages.map((st, idx) => {
              const done = idx <= activeStageIdx;
              const isCurrent = idx === activeStageIdx;
              return `
                <div class="p-4 rounded-2xl border-2 transition ${isCurrent ? 'border-[#D9383A] bg-[#D9383A]/5 shadow-md' : done ? 'border-[#2A7B76]/50 bg-[#2A7B76]/5' : 'border-[#E6D8C7] opacity-60'}">
                  <div class="flex items-center justify-between mb-2">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold ${isCurrent ? 'bg-[#D9383A] text-white animate-pulse-glow' : done ? 'bg-[#2A7B76] text-white' : 'bg-[#FAF3E8] text-[#84727B]'}">
                      <i class="bi ${done && !isCurrent ? 'bi-check-lg' : st.icon}"></i>
                    </div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider ${isCurrent ? 'text-[#D9383A]' : done ? 'text-[#2A7B76]' : 'text-[#84727B]'}">Stage ${idx + 1}</span>
                  </div>
                  <h4 class="font-bold text-xs text-[#1F1A1C]">${st.key}</h4>
                  <p class="text-[11px] text-[#5A4B53] mt-1">${st.desc}</p>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Complete Breakdown Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6">
            <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C] mb-4">Event & Hardware Specification</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 rounded-2xl bg-[#FAF3E8]">
                <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Event Occasion</span>
                <p class="font-bold text-sm text-[#1F1A1C] mt-1">${booking.eventType} (${booking.guestCount} Guests)</p>
                <p class="text-[#5A4B53] mt-1"><i class="bi bi-calendar3 me-1"></i>${booking.eventDate} • ${booking.startTime} (${booking.duration})</p>
              </div>
              <div class="p-4 rounded-2xl bg-[#FAF3E8]">
                <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Venue & Location</span>
                <p class="font-bold text-sm text-[#1F1A1C] mt-1">${booking.venueName}</p>
                <p class="text-[#5A4B53] mt-1"><i class="bi bi-geo-alt-fill text-[#D9383A] me-1"></i>${booking.eventCity}</p>
              </div>
              <div class="p-4 rounded-2xl bg-[#FAF3E8]">
                <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Photo Booth & Package</span>
                <p class="font-bold text-sm text-[#1F1A1C] mt-1">${booking.boothName}</p>
                <p class="text-[#2A7B76] font-semibold mt-1">${booking.packageName} Package</p>
              </div>
              <div class="p-4 rounded-2xl bg-[#FAF3E8]">
                <span class="text-[10px] font-extrabold uppercase text-[#84727B]">Backdrop & Print Layout</span>
                <p class="font-bold text-sm text-[#1F1A1C] mt-1">${booking.backdropName}</p>
                <p class="text-[#5A4B53] mt-1">Layout: ${booking.stripDesign || 'Custom 2×6 Strip'}</p>
              </div>
            </div>

            <div class="mt-4 p-4 rounded-2xl bg-[#FAF3E8] text-xs">
              <span class="text-[10px] font-extrabold uppercase text-[#84727B] block mb-1">Special Setup & Client Instructions</span>
              <p class="text-[#1F1A1C]">${booking.instructions || 'Standard 60-minute complimentary setup prior to event start time.'}</p>
            </div>
          </div>
        </div>

        <!-- Price Breakdown & Contact -->
        <div class="space-y-6">
          <div class="rounded-3xl bg-[#FAF3E8] text-[#1F1A1C] border border-[#E6D8C7] p-6 shadow-xs">
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Estimated Price Breakdown</span>
            <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mt-1">Reservation Summary</h3>
            <div class="mt-4 space-y-2.5 text-xs text-[#5A4B53]">
              <div class="flex justify-between"><span>Package &amp; Booth Base</span><span class="text-[#1F1A1C] font-bold">$${Number(booking.basePrice).toLocaleString()}</span></div>
              <div class="flex justify-between"><span>Backdrop (${booking.backdropName})</span><span class="text-[#1F1A1C] font-bold">+$${Number(booking.backdropPrice).toLocaleString()}</span></div>
              <div class="flex justify-between"><span>Selected Add-Ons (${(booking.addonNames || []).length})</span><span class="text-[#1F1A1C] font-bold">+$${Number(booking.addonsPrice).toLocaleString()}</span></div>
              <div class="border-t border-[#E6D8C7] pt-3 flex justify-between items-baseline">
                <span class="font-bold text-sm text-[#1F1A1C]">Estimated Total</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#D9383A]">$${Number(booking.totalPrice).toLocaleString()}</span>
              </div>
            </div>
            <div class="mt-5 pt-4 border-t border-[#E6D8C7] text-xs space-y-1 text-[#5A4B53]">
              <p><strong>Client:</strong> ${booking.customerName}</p>
              <p><strong>Email:</strong> ${booking.customerEmail}</p>
              <p><strong>Phone:</strong> ${booking.customerPhone}</p>
              <p><strong>Coordinator:</strong> ${booking.coordinator || 'Assigned upon review'}</p>
            </div>
            <button type="button" onclick="window.print()" class="mt-5 w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF3E8] border border-[#E6D8C7] text-[#1F1A1C] font-bold text-xs transition">
              <i class="bi bi-printer me-1 text-[#D9383A]"></i> Print / Save Booking Sheet
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('bookingSwitcherSelect')?.addEventListener('change', (e) => {
      window.location.href = `booking-details.html?ref=${encodeURIComponent(e.target.value)}`;
    });
  }

  // 4. FAVORITES PAGE
  function initFavoritesPage() {
    const root = document.getElementById('custFavoritesRoot');
    if (!root) return;
    renderCustomerShell('Saved Favorites');

    const user = getActiveCustomer();
    const favs = window.PBStore.getFavorites(user.id);
    const booths = window.PBStore.getBooths().filter(b => (favs.booths || []).includes(b.id));
    const packages = window.PBStore.getPackages().filter(p => (favs.packages || []).includes(p.id));

    root.innerHTML = `
      <div class="space-y-8">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">Saved Photo Booth Styles (${booths.length})</h2>
              <p class="text-xs text-[#84727B]">Your shortlisted booths persisted in browser LocalStorage</p>
            </div>
            <a href="../booths.html" class="btn-outline-vintage !py-2 !px-4 text-xs">+ Browse More Booths</a>
          </div>
          ${booths.length === 0 ? `
            <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-10 text-center">
              <i class="bi bi-heart text-3xl text-[#D9383A]"></i>
              <p class="font-bold text-sm mt-2">No saved booth styles yet</p>
              <a href="../booths.html" class="btn-cherry text-xs mt-4">Explore Booths</a>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${booths.map(b => `
                <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] overflow-hidden flex flex-col justify-between">
                  <div>
                    <div class="relative h-48">
                      <img src="${b.image}" alt="${b.name}" class="w-full h-full object-cover">
                      <button type="button" onclick="window.PBCustomer.removeFav('booths','${b.id}')" aria-label="Remove from favorites" class="absolute top-3 end-3 w-9 h-9 rounded-full bg-white text-[#D9383A] shadow-md flex items-center justify-center hover:scale-110 transition">
                        <i class="bi bi-heart-fill"></i>
                      </button>
                    </div>
                    <div class="p-5">
                      <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#D9383A]">Starting at $${b.price}</span>
                      <h3 class="font-serif-editorial text-lg font-bold text-[#1F1A1C] mt-1">${b.name}</h3>
                      <p class="text-xs text-[#5A4B53] mt-1">${b.shortDesc}</p>
                    </div>
                  </div>
                  <div class="p-5 pt-0 flex gap-2">
                    <a href="../booth-details.html?id=${b.id}" class="btn-outline-vintage flex-1 !py-2.5 !px-2.5 text-xs whitespace-nowrap text-center justify-center">Details</a>
                    <a href="../booking.html?booth=${b.id}" class="btn-cherry flex-1 !py-2.5 !px-2.5 text-xs whitespace-nowrap text-center justify-center">Book Booth</a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div>
          <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mb-4">Saved Rental Packages (${packages.length})</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${packages.map(p => `
              <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 flex flex-col justify-between">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#2A7B76]">${p.category} Package • ${p.duration}</span>
                    <h3 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mt-1">${p.name} — $${p.price}</h3>
                    <p class="text-xs text-[#5A4B53] mt-1">${p.printsDesc} • ${p.backdropChoices}</p>
                  </div>
                  <button type="button" onclick="window.PBCustomer.removeFav('packages','${p.id}')" class="text-[#D9383A] hover:underline text-xs font-bold"><i class="bi bi-trash3 me-1"></i>Remove</button>
                </div>
                <div class="mt-4 pt-4 border-t border-[#E6D8C7] flex justify-end">
                  <a href="../booking.html?package=${p.id}" class="btn-cherry !py-2.5 !px-5 text-xs">Book This Package</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 5. PROFILE PAGE
  function initProfilePage() {
    const root = document.getElementById('custProfileRoot');
    if (!root) return;
    renderCustomerShell('Customer Profile & Preferences');

    const user = getActiveCustomer();
    const prefs = user.preferences || {};

    root.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Profile Form -->
        <div class="lg:col-span-2 surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 sm:p-8">
          <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">Personal & Event Information</h2>
          <p class="text-xs text-[#84727B] mt-1">Changes saved here automatically pre-fill your future photo booth bookings.</p>

          <form id="custProfileForm" class="space-y-4 mt-6 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="profName" class="font-bold block mb-1.5">Full Name *</label>
                <input id="profName" type="text" required value="${user.name || ''}" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label for="profEmail" class="font-bold block mb-1.5">Email Address *</label>
                <input id="profEmail" type="email" required value="${user.email || ''}" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="profPhone" class="font-bold block mb-1.5">Phone Number *</label>
                <input id="profPhone" type="tel" required value="${user.phone || ''}" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label for="profCity" class="font-bold block mb-1.5">Primary City / Metro Area</label>
                <input id="profCity" type="text" value="${user.city || 'San Francisco, CA'}" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E6D8C7]">
              <div>
                <label for="profVenue" class="font-bold block mb-1.5">Saved Event Venue</label>
                <input id="profVenue" type="text" value="${user.savedVenue || 'The Conservatory at One Sansome'}" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label for="profEventType" class="font-bold block mb-1.5">Preferred Celebration Type</label>
                <select id="profEventType" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
                  ${window.PBStore.getEvents().map(e => `<option value="${e.name}" ${prefs.favoriteEventType === e.name ? 'selected' : ''}>${e.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="pt-3">
              <button type="submit" class="btn-cherry !py-3 !px-6 text-xs">
                <i class="bi bi-check2-circle"></i> Update Profile & Preferences
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password UI -->
        <div class="surface-card bg-white rounded-3xl border border-[#E6D8C7] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 class="font-serif-editorial text-xl font-bold text-[#1F1A1C]">Security & Password</h2>
            <p class="text-xs text-[#84727B] mt-1">Manage your account credentials and security settings.</p>

            <form id="custPasswordForm" class="space-y-4 mt-6 text-xs">
              <div>
                <label for="curPass" class="font-bold block mb-1.5">Current Password *</label>
                <input id="curPass" type="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label for="newPass" class="font-bold block mb-1.5">New Password (min 6 chars) *</label>
                <input id="newPass" type="password" required minlength="6" placeholder="New password" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <div>
                <label for="confPass" class="font-bold block mb-1.5">Confirm New Password *</label>
                <input id="confPass" type="password" required minlength="6" placeholder="Confirm new password" class="w-full px-4 py-3 rounded-xl border border-[#E6D8C7]">
              </div>
              <button type="submit" class="btn-plum w-full !py-3 text-xs">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('custProfileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = window.PBStore.updateUser(user.id, {
        name: document.getElementById('profName').value.trim(),
        email: document.getElementById('profEmail').value.trim(),
        phone: document.getElementById('profPhone').value.trim(),
        city: document.getElementById('profCity').value.trim(),
        savedVenue: document.getElementById('profVenue').value.trim(),
        preferences: {
          ...prefs,
          favoriteEventType: document.getElementById('profEventType').value
        }
      });
      currentCustomer = updated;
      renderCustomerShell('Customer Profile & Preferences');
      window.PBUI.toast('Customer profile and event preferences updated!', 'success');
    });

    document.getElementById('custPasswordForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const np = document.getElementById('newPass').value;
      const cp = document.getElementById('confPass').value;
      if (np !== cp) {
        return;
      }
      window.PBStore.updateUser(user.id, {
        passwordToken: window.PBStore.demoHash(np)
      });
      e.target.reset();
    });
  }

  window.PBCustomer = {
    initOverviewPage,
    initMyBookingsPage,
    initBookingDetailsPage,
    initFavoritesPage,
    initProfilePage,
    openEditBookingModal,
    cancelCustomerBooking,
    setBookingsPage(p) {
      bookingsFilterState.page = p;
      renderMyBookingsTable();
    },
    removeFav(type, id) {
      const user = getActiveCustomer();
      window.PBStore.removeFavorite(type, id, user.id);
      window.PBUI.toast('Removed from saved favorites.', 'info');
      initFavoritesPage();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initOverviewPage();
    initMyBookingsPage();
    initBookingDetailsPage();
    initFavoritesPage();
    initProfilePage();
  });
})(window, document);
