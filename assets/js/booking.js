/**
 * SNAPORA - 7-Step Interactive Booking System Engine
 * Persists draft selections in LocalStorage and creates synchronized demo reservations.
 */
(function (window, document) {
  'use strict';

  const STRIP_DESIGNS = [
    { id: 'classic-ivory-2x6', name: 'Classic Ivory Serif Monogram (2×6 Strip)', tag: 'Most Popular for Weddings' },
    { id: 'editorial-bw-4x6', name: 'Editorial B&W Magazine Border (4×6 Print)', tag: 'Signature Glam Look' },
    { id: 'retro-70s-disco', name: '1970s Sunset & Disco Foil Stamp (2×6 Strip)', tag: 'Birthday & Party Favorite' },
    { id: 'corporate-step-repeat', name: 'Brand Logo & Event Hashtag Frame (4×6 Print)', tag: 'Corporate Activation' },
    { id: 'vintage-film-sprocket', name: '35mm Kodachrome Film Sprocket Border (2×6 Strip)', tag: 'Nostalgic Analog' }
  ];

  let draft = {};
  let currentStep = 1;
  let isSubmitting = false;

  function getMinDateTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  function mapEventToPackageCategory(eventType) {
    const ev = (eventType || '').toLowerCase();
    if (ev.includes('wedding') || ev.includes('engagement') || ev.includes('anniversar')) return 'Wedding';
    if (ev.includes('birthday') || ev.includes('graduation') || ev.includes('baby') || ev.includes('school')) return 'Birthday';
    if (ev.includes('corporate') || ev.includes('brand') || ev.includes('product') || ev.includes('college')) return 'Corporate';
    return 'Private Party';
  }

  function calculatePricing() {
    const booth = window.PBStore.getBoothById(draft.boothId);
    const pkg = window.PBStore.getPackageById(draft.packageId);
    const backdrop = window.PBStore.getBackdropById(draft.backdropId);
    const allAddons = window.PBStore.getAddons();

    // Base rental price uses selected package price, plus booth tier adjustment if premium booth > $850
    const pkgPrice = pkg ? Number(pkg.price) : 695;
    const boothPremiumDiff = booth && booth.price > 850 ? Math.round((booth.price - 750) * 0.5) : 0;
    const basePrice = pkgPrice + boothPremiumDiff;

    const backdropPrice = backdrop ? Number(backdrop.price || 0) : 0;
    const selectedAddons = (draft.addonIds || [])
      .map(id => allAddons.find(a => a.id === id))
      .filter(Boolean);

    const addonsPrice = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0);
    const extraHoursCount = Number(draft.extraHours || 0);
    const extraHoursCost = extraHoursCount * 175;

    const totalPrice = basePrice + backdropPrice + addonsPrice + extraHoursCost;

    return {
      booth,
      pkg,
      backdrop,
      selectedAddons,
      basePrice,
      backdropPrice,
      addonsPrice: addonsPrice + extraHoursCost,
      extraHoursCost,
      totalPrice
    };
  }

  function updateSidebarSummary() {
    const calc = calculatePricing();
    const elEvent = document.getElementById('summarySideEvent');
    const elDate = document.getElementById('summarySideDate');
    const elBooth = document.getElementById('summarySideBooth');
    const elPkg = document.getElementById('summarySidePkg');
    const elBackdrop = document.getElementById('summarySideBackdrop');
    const elAddons = document.getElementById('summarySideAddons');
    const elBase = document.getElementById('summarySideBasePrice');
    const elExtras = document.getElementById('summarySideExtrasPrice');
    const elTotal = document.getElementById('summarySideTotal');

    if (elEvent) elEvent.textContent = `${draft.eventType || 'Weddings'} (${draft.guestCount || 100} Guests)`;
    if (elDate) elDate.textContent = draft.eventDate ? `${draft.eventDate} • ${draft.startTime || '18:00'}` : 'Select Date in Step 1';
    if (elBooth) elBooth.textContent = calc.booth ? calc.booth.name : 'Not Selected';
    if (elPkg) elPkg.textContent = calc.pkg ? `${calc.pkg.name} (${calc.pkg.duration})` : 'Not Selected';
    if (elBackdrop) elBackdrop.textContent = calc.backdrop ? `${calc.backdrop.name} (${calc.backdropPrice === 0 ? 'Included' : '+$' + calc.backdropPrice})` : 'Classic White';
    if (elAddons) {
      const names = calc.selectedAddons.map(a => a.name);
      if (Number(draft.extraHours || 0) > 0) names.push(`+${draft.extraHours} Extra Hr(s)`);
      elAddons.textContent = names.length ? names.join(', ') : 'None selected';
    }
    if (elBase) elBase.textContent = `$${calc.basePrice.toLocaleString()}`;
    if (elExtras) elExtras.textContent = `+$${(calc.backdropPrice + calc.addonsPrice).toLocaleString()}`;
    if (elTotal) elTotal.textContent = `$${calc.totalPrice.toLocaleString()}`;
  }

  function renderStepIndicators() {
    document.querySelectorAll('[data-step-indicator]').forEach(ind => {
      const stepNum = parseInt(ind.getAttribute('data-step-indicator'), 10);
      const circle = ind.querySelector('.step-circle');
      const label = ind.querySelector('.step-label');

      if (stepNum < currentStep) {
        circle.className = 'step-circle w-9 h-9 rounded-full bg-[#2A7B76] text-white font-bold text-xs flex items-center justify-center shadow-sm';
        circle.innerHTML = '<i class="bi bi-check-lg text-sm"></i>';
        label.className = 'step-label text-xs font-bold text-[#2A7B76] mt-1.5 block';
      } else if (stepNum === currentStep) {
        circle.className = 'step-circle w-9 h-9 rounded-full bg-[#D9383A] text-white font-extrabold text-xs flex items-center justify-center shadow-md ring-4 ring-[#D9383A]/20';
        circle.textContent = stepNum;
        label.className = 'step-label text-xs font-extrabold text-[#D9383A] mt-1.5 block';
      } else {
        circle.className = 'step-circle w-9 h-9 rounded-full bg-[#FAF3E8] border border-[#E6D8C7] text-[#84727B] font-bold text-xs flex items-center justify-center';
        circle.textContent = stepNum;
        label.className = 'step-label text-xs font-semibold text-[#84727B] mt-1.5 block';
      }
    });

    document.querySelectorAll('.booking-step-pane').forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-step-pane'), 10);
      if (paneStep === currentStep) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    updateSidebarSummary();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  function validateStep1() {
    const eventType = document.getElementById('bkEventType').value.trim();
    const eventDate = document.getElementById('bkEventDate').value;
    const startTime = document.getElementById('bkStartTime').value;
    const duration = document.getElementById('bkDuration').value;
    const venueName = document.getElementById('bkVenueName').value.trim();
    const eventCity = document.getElementById('bkEventCity').value.trim();
    const guestCount = parseInt(document.getElementById('bkGuestCount').value, 10);

    const todayStr = new Date().toISOString().split('T')[0];
    if (!eventDate || eventDate < todayStr) {
      window.PBUI.toast('Please select a future event date (past dates are not permitted).', 'error', 'Invalid Event Date');
      document.getElementById('bkEventDate').focus();
      return false;
    }
    if (!startTime) {
      window.PBUI.toast('Please specify the event start time.', 'error');
      return false;
    }
    if (!venueName || venueName.length < 2) {
      window.PBUI.toast('Please enter your event venue name.', 'error');
      document.getElementById('bkVenueName').focus();
      return false;
    }
    if (!eventCity || eventCity.length < 2) {
      window.PBUI.toast('Please enter the event city or location.', 'error');
      document.getElementById('bkEventCity').focus();
      return false;
    }
    if (isNaN(guestCount) || guestCount < 10 || guestCount > 5000) {
      window.PBUI.toast('Please enter an estimated guest count between 10 and 5,000.', 'error');
      document.getElementById('bkGuestCount').focus();
      return false;
    }

    draft = window.PBStore.saveDraftBooking({
      eventType,
      eventDate,
      startTime,
      duration,
      venueName,
      eventCity,
      guestCount,
      step: 2
    });
    return true;
  }

  function renderStep2Booths() {
    const container = document.getElementById('bkBoothsGrid');
    const selectedBanner = document.getElementById('bkSelectedBoothBanner');
    if (!container) return;

    const booths = window.PBStore.getBooths();
    const currentBooth = window.PBStore.getBoothById(draft.boothId);

    if (selectedBanner && currentBooth) {
      selectedBanner.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${currentBooth.image}" alt="${currentBooth.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-[#D9383A]">
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Currently Selected Booth</span>
              <h4 class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">${currentBooth.name}</h4>
              <p class="text-xs text-[#5A4B53]">${currentBooth.capacity} • Footprint: ${currentBooth.footprint}</p>
            </div>
          </div>
          <div class="text-end">
            <span class="text-xs text-[#84727B] block">Base Booth Tier</span>
            <span class="font-serif-editorial text-xl font-extrabold text-[#D9383A]">$${currentBooth.price}</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = booths.map(b => {
      const isSelected = b.id === draft.boothId;
      return `
        <div class="surface-card bg-white rounded-2xl border-2 ${isSelected ? 'border-[#D9383A] ring-4 ring-[#D9383A]/15' : 'border-[#E6D8C7]'} overflow-hidden flex flex-col justify-between transition hover:shadow-lg">
          <div>
            <div class="relative h-44 overflow-hidden">
              <img src="${b.image}" alt="${b.name}" class="w-full h-full object-cover">
              <span class="absolute top-3 start-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#2B192E]/90 text-[#F4C95D] whitespace-nowrap">From $${b.price}</span>
              ${isSelected ? '<span class="absolute top-3 end-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#D9383A] text-white whitespace-nowrap"><i class="bi bi-check2-circle me-1"></i>Selected</span>' : ''}
            </div>
            <div class="p-4">
              <h4 class="font-serif-editorial font-bold text-base text-[#1F1A1C]">${b.name}</h4>
              <p class="text-xs text-[#5A4B53] mt-1 line-clamp-2">${b.shortDesc}</p>
              <ul class="mt-3 space-y-1 text-[11px] text-[#5A4B53]">
                ${b.features.slice(0, 3).map(f => `<li class="flex items-center gap-1.5"><i class="bi bi-check2 text-[#2A7B76] font-bold"></i> <span class="truncate">${f}</span></li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="p-4 pt-0">
            <button type="button" onclick="window.PBBooking.selectBooth('${b.id}')" class="w-full py-2.5 rounded-xl font-bold text-xs transition ${isSelected ? 'bg-[#D9383A] text-white' : 'bg-[#FAF3E8] text-[#1F1A1C] hover:bg-[#D9383A] hover:text-white'}">
              ${isSelected ? '<i class="bi bi-check-lg me-1"></i> Booth Selected' : 'Select This Booth'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStep3Packages(filterCat = null) {
    const container = document.getElementById('bkPackagesGrid');
    if (!container) return;

    const allPkgs = window.PBStore.getPackages(false);
    const activeCategory = filterCat || mapEventToPackageCategory(draft.eventType);

    document.querySelectorAll('[data-bk-pkg-tab]').forEach(btn => {
      const cat = btn.getAttribute('data-bk-pkg-tab');
      if (cat === activeCategory) {
        btn.className = 'px-4 py-2 rounded-xl text-xs font-extrabold bg-[#D9383A] text-white shadow-sm';
      } else {
        btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF3E8] text-[#5A4B53] hover:text-[#1F1A1C]';
      }
    });

    const filtered = activeCategory === 'All' ? allPkgs : allPkgs.filter(p => p.category === activeCategory);

    container.innerHTML = filtered.map(p => {
      const isSelected = p.id === draft.packageId;
      return `
        <div class="surface-card bg-white rounded-3xl border-2 ${isSelected ? 'border-[#D9383A] ring-4 ring-[#D9383A]/15' : p.recommended ? 'border-[#E86A58]' : 'border-[#E6D8C7]'} p-4 sm:p-6 flex flex-col justify-between relative">
          ${p.recommended ? '<span class="absolute -top-3 start-4 sm:start-6 px-3 py-0.5 rounded-full bg-[#F4C95D] text-[#1F1A1C] text-[10px] font-extrabold uppercase tracking-wider shadow-xs whitespace-nowrap">Recommended for ' + p.category + '</span>' : ''}
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#D9383A] truncate min-w-0">${p.category} Package</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#FAF3E8] text-[#5A4B53] text-xs font-bold shrink-0 whitespace-nowrap">${p.duration}</span>
            </div>
            <h4 class="font-serif-editorial text-xl font-bold text-[#1F1A1C] mt-2">${p.name}</h4>
            <div class="mt-3 flex items-baseline gap-1">
              <span class="font-serif-editorial text-3xl font-extrabold text-[#1F1A1C]">$${p.price}</span>
              <span class="text-xs text-[#84727B]">/ event base</span>
            </div>
            <p class="text-xs text-[#5A4B53] mt-2 font-medium">${p.printsDesc}</p>
            <ul class="mt-4 space-y-2 text-xs text-[#5A4B53] border-t border-[#E6D8C7] pt-4">
              ${p.features.map(f => `<li class="flex items-start gap-2"><i class="bi bi-check-circle-fill text-[#2A7B76] mt-0.5"></i> <span>${f}</span></li>`).join('')}
            </ul>
          </div>
          <button type="button" onclick="window.PBBooking.selectPackage('${p.id}', '${activeCategory}')" class="mt-6 w-full py-3 rounded-xl font-bold text-xs transition ${isSelected ? 'bg-[#D9383A] text-white shadow-md' : 'bg-[#FAF3E8] text-[#1F1A1C] border border-[#E6D8C7] hover:bg-[#D9383A] hover:text-white'}">
            ${isSelected ? '<i class="bi bi-check2-circle me-1"></i> Selected Package' : 'Choose ' + p.name}
          </button>
        </div>
      `;
    }).join('');
  }

  function renderStep4Customization() {
    const backdropsGrid = document.getElementById('bkBackdropsGrid');
    const addonsGrid = document.getElementById('bkAddonsGrid');
    const stripSelect = document.getElementById('bkStripDesign');
    const extraHoursSelect = document.getElementById('bkExtraHours');

    if (stripSelect) {
      stripSelect.innerHTML = STRIP_DESIGNS.map(s =>
        `<option value="${s.name}" ${draft.stripDesign === s.name ? 'selected' : ''}>${s.name} — ${s.tag}</option>`
      ).join('');
      stripSelect.onchange = () => {
        draft = window.PBStore.saveDraftBooking({ stripDesign: stripSelect.value });
        updateSidebarSummary();
      };
    }

    if (extraHoursSelect) {
      extraHoursSelect.value = String(draft.extraHours || 0);
      extraHoursSelect.onchange = () => {
        draft = window.PBStore.saveDraftBooking({ extraHours: Number(extraHoursSelect.value) });
        updateSidebarSummary();
      };
    }

    if (backdropsGrid) {
      const backdrops = window.PBStore.getBackdrops();
      backdropsGrid.innerHTML = backdrops.map(b => {
        const isSelected = b.id === draft.backdropId;
        return `
          <div onclick="window.PBBooking.selectBackdrop('${b.id}')" class="cursor-pointer surface-card bg-white rounded-2xl border-2 ${isSelected ? 'border-[#D9383A] ring-2 ring-[#D9383A]/20' : 'border-[#E6D8C7]'} p-3 flex items-center gap-3 hover:border-[#D9383A] transition">
            <img src="${b.image}" alt="${b.name}" class="w-16 h-16 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <h5 class="font-bold text-xs text-[#1F1A1C] truncate">${b.name}</h5>
                <span class="text-[11px] font-extrabold ${b.price === 0 ? 'text-[#2A7B76]' : 'text-[#D9383A]'}">${b.price === 0 ? 'Included' : '+$' + b.price}</span>
              </div>
              <p class="text-[11px] text-[#84727B] line-clamp-2 mt-0.5">${b.description}</p>
            </div>
            <i class="bi ${isSelected ? 'bi-record-circle-fill text-[#D9383A]' : 'bi-circle text-[#84727B]'} text-lg"></i>
          </div>
        `;
      }).join('');
    }

    if (addonsGrid) {
      const addons = window.PBStore.getAddons();
      const selectedIds = draft.addonIds || [];
      addonsGrid.innerHTML = addons.map(a => {
        const checked = selectedIds.includes(a.id) || a.includedInStandard;
        return `
          <div onclick="window.PBBooking.toggleAddon('${a.id}')" class="cursor-pointer surface-card bg-white rounded-2xl border-2 ${checked ? 'border-[#2A7B76] bg-[#2A7B76]/5' : 'border-[#E6D8C7]'} p-4 flex items-start gap-3 transition">
            <div class="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#D9383A] flex items-center justify-center shrink-0 text-lg">
              <i class="bi ${a.icon}"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2">
                <h5 class="font-bold text-xs text-[#1F1A1C]">${a.name}</h5>
                <span class="text-xs font-extrabold ${a.price === 0 ? 'text-[#2A7B76]' : 'text-[#1F1A1C]'}">${a.price === 0 ? 'Included' : '+$' + a.price}</span>
              </div>
              <p class="text-[11px] text-[#5A4B53] mt-1 leading-relaxed">${a.description}</p>
            </div>
            <input type="checkbox" aria-label="${a.name}" ${checked ? 'checked' : ''} ${a.includedInStandard ? 'disabled' : ''} class="mt-1 w-4 h-4 accent-[#D9383A] pointer-events-none">
          </div>
        `;
      }).join('');
    }
  }

  function validateStep5() {
    const customerName = document.getElementById('bkCustomerName').value.trim();
    const customerEmail = document.getElementById('bkCustomerEmail').value.trim();
    const customerPhone = document.getElementById('bkCustomerPhone').value.trim();
    const eventContact = document.getElementById('bkEventContact').value.trim();
    const instructions = document.getElementById('bkInstructions').value.trim();

    if (!customerName || customerName.length < 2) {
      window.PBUI.toast('Please enter your full name.', 'error');
      document.getElementById('bkCustomerName').focus();
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      window.PBUI.toast('Please enter a valid email address for your booking confirmation.', 'error');
      document.getElementById('bkCustomerEmail').focus();
      return false;
    }
    if (!customerPhone || customerPhone.length < 7) {
      window.PBUI.toast('Please enter a valid mobile phone number.', 'error');
      document.getElementById('bkCustomerPhone').focus();
      return false;
    }

    draft = window.PBStore.saveDraftBooking({
      customerName,
      customerEmail,
      customerPhone,
      eventContact,
      instructions,
      step: 6
    });
    return true;
  }

  function renderStep6Summary() {
    const box = document.getElementById('bkFullReviewContainer');
    if (!box) return;
    const calc = calculatePricing();
    const addonListHtml = calc.selectedAddons.length
      ? calc.selectedAddons.map(a => `<span class="px-2.5 py-1 rounded-lg bg-[#FAF3E8] border border-[#E6D8C7] text-xs font-semibold">${a.name} ($${a.price})</span>`).join(' ')
      : '<span class="text-xs text-[#84727B]">Standard included props & digital gallery</span>';

    box.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-5 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Event Details</span>
            <button type="button" onclick="window.PBBooking.goToStep(1)" class="text-xs font-bold text-[#D9383A] hover:underline"><i class="bi bi-pencil-square me-1"></i>Edit</button>
          </div>
          <p class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">${draft.eventType} (${draft.guestCount} Guests)</p>
          <p class="text-xs text-[#5A4B53]"><i class="bi bi-calendar-event me-1"></i> ${draft.eventDate} • Start: ${draft.startTime} (${draft.duration})</p>
          <p class="text-xs text-[#5A4B53]"><i class="bi bi-geo-alt me-1"></i> ${draft.venueName}, ${draft.eventCity}</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Selected Booth & Package</span>
            <button type="button" onclick="window.PBBooking.goToStep(2)" class="text-xs font-bold text-[#D9383A] hover:underline"><i class="bi bi-pencil-square me-1"></i>Edit</button>
          </div>
          <p class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">${calc.booth.name}</p>
          <p class="text-xs font-semibold text-[#2A7B76]">${calc.pkg.name} Package (${calc.pkg.duration})</p>
          <p class="text-xs text-[#5A4B53]">Backdrop: <strong>${calc.backdrop.name}</strong> • Strip: <strong>${draft.stripDesign}</strong></p>
        </div>
      </div>

      <div class="mt-6 p-5 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">Selected Add-Ons & Client Contact</span>
          <button type="button" onclick="window.PBBooking.goToStep(4)" class="text-xs font-bold text-[#D9383A] hover:underline"><i class="bi bi-pencil-square me-1"></i>Customize</button>
        </div>
        <div class="flex flex-wrap gap-2">${addonListHtml}</div>
        <div class="pt-3 border-t border-[#E6D8C7] text-xs text-[#5A4B53] grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div><strong>Client:</strong> ${draft.customerName}</div>
          <div><strong>Email:</strong> ${draft.customerEmail}</div>
          <div><strong>Phone:</strong> ${draft.customerPhone}</div>
        </div>
        ${draft.instructions ? `<p class="text-xs text-[#5A4B53] italic"><strong>Notes:</strong> "${draft.instructions}"</p>` : ''}
      </div>

      <div class="mt-6 p-6 rounded-2xl bg-[#FAF3E8] border border-[#E6D8C7] text-[#1F1A1C] space-y-2">
        <div class="flex justify-between text-xs text-[#5A4B53]">
          <span>Base Package &amp; Booth Rental (${calc.pkg.name})</span>
          <span class="font-bold text-[#1F1A1C]">$${calc.basePrice.toLocaleString()}</span>
        </div>
        <div class="flex justify-between text-xs text-[#5A4B53]">
          <span>Backdrop Selection (${calc.backdrop.name})</span>
          <span class="font-bold text-[#1F1A1C]">+$${calc.backdropPrice.toLocaleString()}</span>
        </div>
        <div class="flex justify-between text-xs text-[#5A4B53]">
          <span>Custom Add-Ons &amp; Extra Hours</span>
          <span class="font-bold text-[#1F1A1C]">+$${calc.addonsPrice.toLocaleString()}</span>
        </div>
        <div class="border-t border-[#E6D8C7] pt-3 flex justify-between items-baseline">
          <div>
            <span class="font-serif-editorial text-lg font-bold text-[#1F1A1C]">Estimated Demo Booking Total</span>
            <span class="block text-[11px] text-[#D9383A] font-bold">Demo Reservation — No Real Payment Charged</span>
          </div>
          <span class="font-serif-editorial text-3xl font-extrabold text-[#D9383A]">$${calc.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  function confirmBookingSubmission() {
    if (isSubmitting) return;
    isSubmitting = true;

    const calc = calculatePricing();
    const session = window.PBStore.getSession();

    const created = window.PBStore.createBooking({
      customerId: session ? session.id : 'usr-cust-1',
      customerName: draft.customerName,
      customerEmail: draft.customerEmail,
      customerPhone: draft.customerPhone,
      eventType: draft.eventType,
      eventDate: draft.eventDate,
      startTime: draft.startTime,
      endTime: draft.endTime || '22:00',
      duration: calc.pkg ? calc.pkg.duration : draft.duration,
      venueName: draft.venueName,
      eventCity: draft.eventCity,
      guestCount: draft.guestCount,
      boothId: calc.booth.id,
      boothName: calc.booth.name,
      packageId: calc.pkg.id,
      packageName: calc.pkg.name,
      backdropId: calc.backdrop.id,
      backdropName: calc.backdrop.name,
      stripDesign: draft.stripDesign,
      addonIds: calc.selectedAddons.map(a => a.id),
      addonNames: calc.selectedAddons.map(a => a.name),
      basePrice: calc.basePrice,
      backdropPrice: calc.backdropPrice,
      addonsPrice: calc.addonsPrice,
      totalPrice: calc.totalPrice,
      instructions: draft.instructions
    });

    window.PBStore.clearDraftBooking();

    const confirmPane = document.getElementById('bkConfirmationContent');
    if (confirmPane) {
      confirmPane.innerHTML = `
        <div class="text-center max-w-2xl mx-auto py-6">
          <div class="w-20 h-20 rounded-full bg-[#2A7B76]/15 text-[#2A7B76] flex items-center justify-center mx-auto text-4xl mb-4 shadow-inner">
            <i class="bi bi-check2-all"></i>
          </div>
          <span class="status-badge status-pending mb-3"><i class="bi bi-hourglass-split"></i> Initial Status: Pending</span>
          <h2 class="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1F1A1C]">Demo Reservation Requested!</h2>
          <p class="text-sm text-[#5A4B53] mt-2">
            Thank you, <strong>${created.customerName}</strong>! Your reservation has been saved to browser LocalStorage and is immediately visible in both the Customer Dashboard and Admin Dashboard.
          </p>

          <div class="my-8 p-6 rounded-3xl bg-[#FAF3E8] border-2 border-dashed border-[#D9383A] text-start space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6D8C7] pb-3">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B] block">Unique Booking Reference</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#D9383A]">${created.reference}</span>
              </div>
              <div class="text-end">
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#84727B] block">Estimated Total</span>
                <span class="font-serif-editorial text-2xl font-extrabold text-[#1F1A1C]">$${created.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A4B53]">
              <div><strong>Booth Style:</strong> ${created.boothName}</div>
              <div><strong>Package:</strong> ${created.packageName} (${created.duration})</div>
              <div><strong>Event Date:</strong> ${created.eventDate} at ${created.startTime}</div>
              <div><strong>Venue:</strong> ${created.venueName}, ${created.eventCity}</div>
              <div><strong>Backdrop:</strong> ${created.backdropName}</div>
              <div><strong>Add-Ons:</strong> ${created.addonNames.length ? created.addonNames.join(', ') : 'Standard Included'}</div>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#5A4B53] mb-6">
            <i class="bi bi-info-circle-fill text-amber-600 me-1"></i>
            <strong>Frontend Demo Notice:</strong> This is a demonstration booking stored in LocalStorage. No real payment or server email has been processed.
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="customer/booking-details.html?ref=${encodeURIComponent(created.reference)}" class="btn-cherry w-full sm:w-auto">
              <i class="bi bi-eye-fill"></i>
              <span>View My Booking & Track Status</span>
            </a>
            <a href="customer/dashboard.html" class="btn-outline-vintage w-full sm:w-auto">
              <i class="bi bi-speedometer2"></i>
              <span>Go to Customer Dashboard</span>
            </a>
          </div>
        </div>
      `;
    }

    currentStep = 7;
    renderStepIndicators();
    window.PBUI.toast(`Booking ${created.reference} saved to LocalStorage!`, 'success', 'Booking Confirmed (Demo)');
    setTimeout(() => { isSubmitting = false; }, 1500);
  }

  function initBookingPage() {
    const wizardRoot = document.getElementById('bookingWizardRoot');
    if (!wizardRoot) return;

    draft = window.PBStore.getDraftBooking();
    const params = new URLSearchParams(window.location.search);

    if (params.get('booth')) draft.boothId = params.get('booth');
    if (params.get('package')) draft.packageId = params.get('package');
    if (params.get('backdrop')) draft.backdropId = params.get('backdrop');
    if (params.get('event')) draft.eventType = params.get('event');
    if (params.get('date')) draft.eventDate = params.get('date');
    if (params.get('guests')) draft.guestCount = Number(params.get('guests'));

    const minDate = getMinDateTomorrow();
    if (!draft.eventDate || draft.eventDate < minDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      draft.eventDate = defaultDate.toISOString().split('T')[0];
    }

    // Pre-fill customer details from active session if available
    const session = window.PBStore.getSession();
    if (session && !draft.customerEmail) {
      draft.customerName = session.name;
      draft.customerEmail = session.email;
      draft.customerPhone = session.phone || '(555) 384-9201';
    } else if (!draft.customerName) {
      draft.customerName = 'Claire Bennett';
      draft.customerEmail = 'claire@example.com';
      draft.customerPhone = '(555) 384-9201';
    }

    window.PBStore.saveDraftBooking(draft);

    // Populate Step 1 Inputs
    const evSelect = document.getElementById('bkEventType');
    if (evSelect) {
      const events = window.PBStore.getEvents();
      evSelect.innerHTML = events.map(ev =>
        `<option value="${ev.name}" ${ev.name.toLowerCase() === (draft.eventType || '').toLowerCase() ? 'selected' : ''}>${ev.name}</option>`
      ).join('');
    }

    const dateInput = document.getElementById('bkEventDate');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.value = draft.eventDate;
    }

    if (document.getElementById('bkStartTime')) document.getElementById('bkStartTime').value = draft.startTime || '18:00';
    if (document.getElementById('bkDuration')) document.getElementById('bkDuration').value = draft.duration || '4 Hours';
    if (document.getElementById('bkVenueName')) document.getElementById('bkVenueName').value = draft.venueName || 'The Conservatory Ballroom';
    if (document.getElementById('bkEventCity')) document.getElementById('bkEventCity').value = draft.eventCity || 'San Francisco, CA';
    if (document.getElementById('bkGuestCount')) document.getElementById('bkGuestCount').value = draft.guestCount || 120;

    // Populate Step 5 Inputs
    if (document.getElementById('bkCustomerName')) document.getElementById('bkCustomerName').value = draft.customerName || '';
    if (document.getElementById('bkCustomerEmail')) document.getElementById('bkCustomerEmail').value = draft.customerEmail || '';
    if (document.getElementById('bkCustomerPhone')) document.getElementById('bkCustomerPhone').value = draft.customerPhone || '';
    if (document.getElementById('bkEventContact')) document.getElementById('bkEventContact').value = draft.eventContact || 'On-Site Wedding Planner / Venue Host';
    if (document.getElementById('bkInstructions')) document.getElementById('bkInstructions').value = draft.instructions || '';

    renderStep2Booths();
    renderStep3Packages();
    renderStep4Customization();
    renderStepIndicators();
  }

  window.PBBooking = {
    initBookingPage,
    goToStep(targetStep) {
      if (targetStep > 1 && currentStep === 1) {
        if (!validateStep1()) return;
      }
      if (targetStep === 6) {
        if (!validateStep5()) return;
        renderStep6Summary();
      }
      currentStep = targetStep;
      if (currentStep === 2) renderStep2Booths();
      if (currentStep === 3) renderStep3Packages();
      if (currentStep === 4) renderStep4Customization();
      if (currentStep === 6) renderStep6Summary();
      renderStepIndicators();
    },
    nextStep() {
      this.goToStep(currentStep + 1);
    },
    prevStep() {
      if (currentStep > 1) {
        currentStep -= 1;
        renderStepIndicators();
      }
    },
    selectBooth(boothId) {
      draft = window.PBStore.saveDraftBooking({ boothId });
      renderStep2Booths();
      updateSidebarSummary();
      window.PBUI.toast('Photo booth selection updated!', 'info');
    },
    filterPackages(category) {
      renderStep3Packages(category);
    },
    selectPackage(packageId, activeCat) {
      const pkg = window.PBStore.getPackageById(packageId);
      draft = window.PBStore.saveDraftBooking({
        packageId,
        duration: pkg ? pkg.duration : draft.duration
      });
      renderStep3Packages(activeCat);
      updateSidebarSummary();
      window.PBUI.toast(`${pkg.name} package selected!`, 'info');
    },
    selectBackdrop(backdropId) {
      draft = window.PBStore.saveDraftBooking({ backdropId });
      renderStep4Customization();
      updateSidebarSummary();
    },
    toggleAddon(addonId) {
      const addon = window.PBStore.getAddonById(addonId);
      if (!addon || addon.includedInStandard) return;
      const list = Array.isArray(draft.addonIds) ? [...draft.addonIds] : [];
      const idx = list.indexOf(addonId);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(addonId);
      }
      draft = window.PBStore.saveDraftBooking({ addonIds: list });
      renderStep4Customization();
      updateSidebarSummary();
    },
    confirmBookingSubmission
  };

  document.addEventListener('DOMContentLoaded', initBookingPage);
})(window, document);
