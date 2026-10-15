/**
 * SNAPORA - Gallery Filtering, Search & Keyboard-Accessible Lightbox Engine
 */
(function (window, document) {
  'use strict';

  let currentItems = [];
  let activeCategory = 'All';
  let searchQuery = '';
  let currentLightboxIndex = 0;

  function renderGalleryGrid() {
    const grid = document.getElementById('galleryMasonryGrid');
    const countEl = document.getElementById('galleryCountLabel');
    if (!grid || !window.PBStore) return;

    const allItems = window.PBStore.getGallery();
    currentItems = allItems.filter(item => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        item.eventTag.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (countEl) {
      countEl.textContent = `Showing ${currentItems.length} of ${allItems.length} curated event captures`;
    }

    if (currentItems.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16 px-4 surface-card bg-white rounded-3xl border border-[#E6D8C7]">
          <i class="bi bi-images text-4xl text-[#D9383A]"></i>
          <h3 class="font-serif-editorial text-xl font-bold mt-3 text-[#1F1A1C]">No gallery captures match your filter</h3>
          <p class="text-xs text-[#5A4B53] mt-1">Try clearing your search keyword or switching to "All" categories.</p>
          <button type="button" onclick="window.PBGallery.filterByCategory('All')" class="btn-cherry text-xs mt-4">Reset Gallery Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = currentItems.map((item, idx) => `
      <article class="masonry-item group h-full">
        <div class="h-full flex flex-col justify-between bg-white surface-card rounded-2xl border-2 border-[#E6D8C7] overflow-hidden p-3.5 shadow-sm hover:shadow-xl hover:border-[#D9383A] transition-all duration-300 cursor-pointer" tabindex="0" role="button" aria-label="Open ${item.title} in lightbox" onclick="window.PBGallery.openLightbox(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.PBGallery.openLightbox(${idx});}">
          <div class="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#2B192E]">
            <img src="${item.image}" alt="${item.title} - ${item.caption}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1F1A1C]/90 via-[#1F1A1C]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <span class="inline-block w-fit px-2.5 py-0.5 rounded-full bg-[#D9383A] text-[10px] font-extrabold uppercase tracking-wider mb-1">${item.category}</span>
              <h3 class="font-serif-editorial text-base font-bold leading-snug text-white line-clamp-1">${item.title}</h3>
              <p class="text-[11px] text-white/90 mt-0.5 line-clamp-2">${item.caption}</p>
              <div class="mt-2.5 flex items-center justify-between text-[11px] font-bold text-[#F4C95D]">
                <span><i class="bi bi-camera-fill me-1"></i>${item.eventTag}</span>
                <span><i class="bi bi-arrows-fullscreen me-1"></i>Expand</span>
              </div>
            </div>
            <!-- Category badge in top corner for instant clarity -->
            <span class="absolute top-2.5 start-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
              ${item.category}
            </span>
          </div>
          <div class="pt-3 pb-0.5 px-1 flex-1 flex flex-col justify-between gap-1.5">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-serif-editorial text-base font-bold text-[#1F1A1C] group-hover:text-[#D9383A] transition line-clamp-1" title="${item.title}">${item.title}</h3>
              <span class="text-[10px] text-[#84727B] font-semibold whitespace-nowrap mt-0.5">${item.date}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-[#5A4B53] pt-1.5 border-t border-[#E6D8C7]/60">
              <span class="text-[11px] font-medium text-[#2A7B76] truncate max-w-[160px]"><i class="bi bi-camera me-1"></i>${item.eventTag}</span>
              <span class="text-[11px] font-extrabold text-[#D9383A] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">View <i class="bi bi-arrow-right text-[10px]"></i></span>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function ensureLightboxModal() {
    let modal = document.getElementById('galleryLightboxModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'galleryLightboxModal';
      modal.className = 'fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden flex items-center justify-center p-4';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Image Lightbox Viewer');
      document.body.appendChild(modal);
    }
    return modal;
  }

  function renderLightboxSlide() {
    const modal = ensureLightboxModal();
    const item = currentItems[currentLightboxIndex];
    if (!item) return;

    modal.innerHTML = `
      <div class="max-w-5xl w-full bg-[#1F1A1C] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/15 grid grid-cols-1 lg:grid-cols-3 relative">
        <!-- Close Button -->
        <button type="button" id="lbCloseBtn" onclick="window.PBGallery.closeLightbox()" aria-label="Close Lightbox (Esc)" class="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D9383A] text-white flex items-center justify-center transition">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Image Stage -->
        <div class="lg:col-span-2 relative bg-black flex items-center justify-center min-h-[320px] sm:min-h-[480px]">
          <img src="${item.image}" alt="${item.title} - ${item.caption}" class="max-h-[75vh] w-full object-contain">
          <button type="button" onclick="window.PBGallery.prevSlide()" aria-label="Previous Image" class="absolute start-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-[#D9383A] text-white flex items-center justify-center transition">
            <i class="bi bi-chevron-left rtl-flip text-lg"></i>
          </button>
          <button type="button" onclick="window.PBGallery.nextSlide()" aria-label="Next Image" class="absolute end-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-[#D9383A] text-white flex items-center justify-center transition">
            <i class="bi bi-chevron-right rtl-flip text-lg"></i>
          </button>
          <span class="absolute bottom-3 start-4 px-3 py-1 rounded-full bg-black/60 text-[11px] font-bold text-white/80">
            ${currentLightboxIndex + 1} / ${currentItems.length}
          </span>
        </div>

        <!-- Details & CTA -->
        <div class="p-6 sm:p-8 flex flex-col justify-between bg-white text-[#1F1A1C] dark:bg-[#2B192E] dark:text-white">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="px-3 py-1 rounded-full bg-[#D9383A] text-white text-[10px] font-extrabold uppercase tracking-wider">${item.category}</span>
              <span class="text-xs text-[#D9383A] dark:text-[#F4C95D] font-semibold">${item.date}</span>
            </div>
            <h3 class="font-serif-editorial text-2xl font-bold text-[#1F1A1C] dark:text-white">${item.title}</h3>
            <p class="text-sm text-[#5A4B53] dark:text-[#D7C8D2] mt-3 leading-relaxed">${item.caption}</p>

            <div class="mt-6 p-4 rounded-2xl bg-[#FAF3E8] dark:bg-white/5 border border-[#E6D8C7] dark:border-white/10 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-[#5A4B53] dark:text-[#D7C8D2]">Featured Setup:</span>
                <span class="font-bold text-[#D9383A] dark:text-[#F4C95D]">${item.eventTag}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[#5A4B53] dark:text-[#D7C8D2]">Print Format:</span>
                <span class="font-semibold text-[#1F1A1C] dark:text-white">Archival Matte + Instant QR</span>
              </div>
            </div>
          </div>

          <div class="pt-6 space-y-3 border-t border-[#E6D8C7] dark:border-white/10 mt-6">
            <a href="booking.html?event=${encodeURIComponent(item.category)}" class="btn-cherry w-full text-xs !py-3.5">
              <i class="bi bi-calendar2-heart-fill"></i>
              <span>Book a Similar Experience</span>
            </a>
            <div class="flex items-center justify-between text-[11px] text-[#84727B] dark:text-[#D7C8D2]">
              <span>Use ← / → keys to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('lbCloseBtn')?.focus();
  }

  function openLightbox(idx) {
    currentLightboxIndex = idx;
    const modal = ensureLightboxModal();
    renderLightboxSlide();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const modal = document.getElementById('galleryLightboxModal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function nextSlide() {
    if (!currentItems.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentItems.length;
    renderLightboxSlide();
  }

  function prevSlide() {
    if (!currentItems.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentItems.length) % currentItems.length;
    renderLightboxSlide();
  }

  function filterByCategory(category) {
    activeCategory = category;
    document.querySelectorAll('[data-gallery-cat]').forEach(btn => {
      const cat = btn.getAttribute('data-gallery-cat');
      if (cat === category) {
        btn.className = 'px-4 py-2 rounded-full text-xs font-extrabold bg-[#D9383A] text-white shadow-md transition';
      } else {
        btn.className = 'px-4 py-2 rounded-full text-xs font-bold bg-white surface-card border border-[#E6D8C7] text-[#5A4B53] hover:border-[#D9383A] transition';
      }
    });
    renderGalleryGrid();
  }

  function initGalleryPage() {
    const grid = document.getElementById('galleryMasonryGrid');
    if (!grid) return;

    const searchInput = document.getElementById('gallerySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderGalleryGrid();
      });
    }

    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('galleryLightboxModal');
      if (!modal || modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    renderGalleryGrid();
  }

  window.PBGallery = {
    initGalleryPage,
    filterByCategory,
    openLightbox,
    closeLightbox,
    nextSlide,
    prevSlide
  };

  document.addEventListener('DOMContentLoaded', initGalleryPage);
})(window, document);
