/**
 * SNAPORA - LocalStorage Data & State Engine
 * Frontend Demonstration Storage Layer (Local to Browser)
 */
(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    INITIALIZED: 'fb_studio_v1_init',
    THEME: 'fb_studio_theme',
    RTL: 'fb_studio_rtl',
    SESSION: 'fb_studio_session',
    USERS: 'fb_studio_users',
    BOOTHS: 'fb_studio_booths',
    PACKAGES: 'fb_studio_packages',
    BACKDROPS: 'fb_studio_backdrops',
    ADDONS: 'fb_studio_addons',
    EVENTS: 'fb_studio_events',
    BOOKINGS: 'fb_studio_bookings',
    FAVORITES: 'fb_studio_favorites',
    REVIEWS: 'fb_studio_reviews',
    MESSAGES: 'fb_studio_messages',
    NOTIFICATIONS: 'fb_studio_notifications',
    DRAFT_BOOKING: 'fb_studio_draft_booking',
    BLOGS: 'fb_studio_blogs',
    GALLERY: 'fb_studio_gallery',
    NEWSLETTER: 'fb_studio_newsletter'
  };

  // Simple demo-only non-plaintext hash helper (Never use LocalStorage for real production auth)
  function demoHash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 'demo_hash_' + (h >>> 0).toString(16);
  }

  const DEFAULT_BOOTHS = [
    {
      id: 'vintage-enclosed',
      name: 'Vintage Enclosed Photo Booth',
      category: 'Vintage Enclosed Photo Booth',
      tagline: 'Authentic 1960s Velvet Curtain & Warm Analog-Style Flash',
      shortDesc: 'Step behind the crimson velvet curtain for intimate, candid 4-frame photo strips with warm editorial lighting.',
      description: 'Handcrafted from solid mahogany and brushed brass, our flagship Vintage Enclosed Photo Booth recreates the magic of mid-century boardwalk photography. Guests step behind heavy velvet curtains for private, uninhibited fun while a studio-grade DSLR and lab-quality dye-sublimation printer deliver classic vertical strips in 8 seconds flat.',
      price: 750,
      duration: '3 Hours Base Rental',
      capacity: 'Up to 4 guests inside at once (ideal for 50–250 total guests)',
      footprint: '6 ft × 4 ft × 6.8 ft (Indoor level surface)',
      powerReq: 'Standard 110V/120V dedicated outlet within 25 ft',
      availability: 'Available',
      featured: true,
      popularRank: 1,
      suitableEvents: ['Weddings', 'Anniversaries', 'Retro Parties', 'Engagements', 'Holiday Parties'],
      features: [
        'Solid walnut & brass mid-century enclosure',
        'Instant 2×6 archival matte or glossy strips',
        'Velvet privacy curtains in Cherry or Plum',
        'Full DSLR optical glass & warm tungsten-balanced flash',
        'Instant SMS, Email & AirDrop digital copies'
      ],
      printOptions: 'Classic 2×6 vertical 4-pose strips (2 copies printed automatically per session) with custom vintage typography.',
      digitalSharing: 'QR code instant phone download, SMS link, email delivery, and full online high-res album.',
      attendantService: 'Includes 1 dressed vintage booth concierge for setup, guest assistance, and guestbook curation.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'open-air',
      name: 'Open-Air Photo Booth',
      category: 'Open-Air Photo Booth',
      tagline: 'Big Group Energy with Custom Artisan Backdrops',
      shortDesc: 'Our versatile open-concept studio fits up to 12 guests in a single frame against any statement backdrop.',
      description: 'Designed for high-energy celebrations where everyone wants to jump in the frame. Our Open-Air Photo Booth pairs a sleek tripod-mounted oak camera housing with professional beauty-dish strobe lighting and your choice of our 8×8 ft artisan backdrops.',
      price: 550,
      duration: '3 Hours Base Rental',
      capacity: 'Up to 12 guests per shot (ideal for 40–300+ total guests)',
      footprint: '8 ft × 8 ft × 8 ft space recommended',
      powerReq: 'Standard 110V outlet within 30 ft',
      availability: 'Available',
      featured: true,
      popularRank: 2,
      suitableEvents: ['Birthday Parties', 'Weddings', 'Graduation Parties', 'School Events', 'Community Events'],
      features: [
        'Fits large group shots of 10–12 guests effortlessly',
        'Choice of any 8×8 ft artisan backdrop',
        'Studio beauty-dish flash diffuser',
        '2×6 strips or 4×6 postcard prints',
        'Live touch-screen countdown & boomerang mode'
      ],
      printOptions: 'Choice of classic 2×6 strips or 4×6 portrait/landscape prints with custom event artwork.',
      digitalSharing: 'Instant SMS, Email, QR code download, and live event gallery.',
      attendantService: 'Includes on-site attendant, prop table styling, and 60-minute complimentary setup prior to start.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'glam-booth',
      name: 'Glam Booth',
      category: 'Glam Booth',
      tagline: 'Editorial Black & White Skin-Smoothing Red Carpet Portraits',
      shortDesc: 'Hollywood-inspired monochrome & warm-lux skin-smoothing portraits with signature crisp white backdrops.',
      description: 'Inspired by celebrity award-show portraits, our Glam Booth uses a specialized parabolic modifier and custom real-time skin-retouching LUTs to produce breathtaking, magazine-worthy black-and-white or warm editorial portraits on thick 4×6 matte cardstock.',
      price: 850,
      duration: '3 Hours Base Rental',
      capacity: '1–8 guests per frame (ideal for luxury weddings & galas)',
      footprint: '8 ft × 8 ft × 8 ft',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: true,
      popularRank: 3,
      suitableEvents: ['Weddings', 'Engagements', 'Corporate Events', 'Private Celebrations', 'Anniversaries'],
      features: [
        'Real-time luxury skin-smoothing & blemish softening',
        'High-contrast editorial Black & White + Warm Color modes',
        'Thick 4×6 fine-art matte border prints',
        'Custom minimalist monogram overlay',
        'Pure arctic white or velvet tension backdrop'
      ],
      printOptions: 'Luxury 4×6 matte portrait prints with minimalist editorial border and custom foil-style digital crest.',
      digitalSharing: 'Instant AirDrop, SMS, and private password-protected luxury online gallery.',
      attendantService: 'Includes white-glove portrait director to guide guest posing and lighting.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: '360-video-booth',
      name: '360-Degree Video Booth',
      category: '360-Degree Video Booth',
      tagline: 'Slow-Motion Orbiting Cinema Platform for High-Energy Events',
      shortDesc: 'Step onto the illuminated platform as a high-speed cinema arm orbits 360 degrees for instant slow-mo reels.',
      description: 'Turn every guest into the star of a music video. Our 360-Degree Video Booth features a heavy-duty glass platform, RGB perimeter tube lighting, and a motorized rotating camera arm that captures 120fps slow-motion video with automatic beat-synced edits and custom overlays.',
      price: 950,
      duration: '3 Hours Base Rental',
      capacity: 'Up to 5 guests on platform at once',
      footprint: '10 ft × 10 ft safety perimeter required',
      powerReq: '110V outlet (battery pack available for outdoor)',
      availability: 'Available',
      featured: true,
      popularRank: 4,
      suitableEvents: ['Birthday Parties', 'Corporate Events', 'Brand Activations', 'College Festivals', 'Product Launches'],
      features: [
        'Motorized silent 360° cinema arm with 120fps slow-motion',
        '4-person tempered glass LED platform',
        '4 wireless RGB studio tube lights & red carpet stanchions',
        'Instant cloud rendering with custom music & motion graphics',
        'Dedicated sharing kiosk with QR & AirDrop'
      ],
      printOptions: 'Digital-first cinema experience (optional still-frame 4×6 print station add-on available).',
      digitalSharing: 'Instant iPad sharing station with QR code, AirDrop, SMS, and TikTok/Reels-ready MP4 export.',
      attendantService: 'Includes 2 technical operators: one platform director and one sharing-station specialist.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'retro-caravan',
      name: 'Retro Caravan Booth',
      category: 'Retro Caravan Booth',
      tagline: '1972 Restored Pastel Camper Trailer Photo Lounge',
      shortDesc: 'An unforgettable outdoor centerpiece—our restored vintage caravan houses a cozy velvet booth inside.',
      description: 'Meet "Clementine," our lovingly restored 1972 vintage travel trailer finished in warm cream and coral pastel. Parked at your outdoor wedding, vineyard, or festival, guests climb aboard onto tufted velvet banquettes for the ultimate nostalgic photo session.',
      price: 1250,
      duration: '4 Hours Base Rental',
      capacity: 'Up to 6 guests inside lounge banquette',
      footprint: '16 ft × 9 ft outdoor flat parking access',
      powerReq: '110V outlet within 50 ft or whisper-quiet onboard inverter',
      availability: 'Limited',
      featured: true,
      popularRank: 5,
      suitableEvents: ['Weddings', 'Engagements', 'Brand Activations', 'Community Events', 'College Festivals'],
      features: [
        'Authentic 1972 restored vintage caravan trailer',
        'Built-in hidden DSLR studio & instant exterior print slot',
        'Bistro string lights, awning & rattan outdoor lounge furniture',
        'Custom wooden welcome chalkboard & floral bumper styling',
        'Self-sufficient battery inverter option for remote estates'
      ],
      printOptions: 'Unlimited 2×6 vintage film strips + 4×6 keepsake postcards dispensed from the retro exterior slot.',
      digitalSharing: 'Instant SMS & QR download + full online wedding/event gallery.',
      attendantService: 'Includes 2 attendants for towing, exterior lounge styling, and guest hosting.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'mirror-booth',
      name: 'Mirror Photo Booth',
      category: 'Mirror Photo Booth',
      tagline: 'Full-Length Interactive Touch Mirror with On-Glass Signature',
      shortDesc: 'A 65-inch ornate gold or sleek frameless full-length mirror with interactive animations and digital signing.',
      description: 'Guests see their full outfit from head to toe in a 65-inch interactive two-way vanity mirror while animated neon voice prompts guide them through poses. Before printing, guests can sign their name or draw hearts directly on the mirror glass!',
      price: 790,
      duration: '3 Hours Base Rental',
      capacity: '1–10 guests full-length portrait framing',
      footprint: '7 ft × 7 ft × 6.5 ft',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: false,
      popularRank: 6,
      suitableEvents: ['Weddings', 'Birthday Parties', 'Baby Showers', 'Graduation Parties', 'Holiday Parties'],
      features: [
        '65-inch full-length capacitive touch mirror glass',
        'Sign & draw neon messages directly onto your photo',
        'Choice of Vintage Baroque Gold or Modern Matte Frame',
        'Hidden studio DSLR behind two-way optical mirror',
        'Instant prints & animated GIF exports'
      ],
      printOptions: 'Full-body 4×6 portrait prints or 2×6 strips showing guest handwritten signatures.',
      digitalSharing: 'SMS, Email, and QR code instant download.',
      attendantService: 'Includes full-time mirror attendant and curated prop collection.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'digital-selfie',
      name: 'Digital Selfie Booth',
      category: 'Digital Selfie Booth',
      tagline: 'Compact All-Day Drop-Off Halo Ring-Light Kiosk',
      shortDesc: 'Sleek, modern, and budget-friendly digital station for instant Boomerangs, GIFs, and social sharing.',
      description: 'Perfect for intimate parties, bars, baby showers, and all-day events. Our Digital Selfie Booth combines a studio halo ring light with an ultra-crisp tablet interface for unlimited photos, GIFs, Boomerangs, and digital filters—with zero bulky footprint.',
      price: 450,
      duration: '4 Hours or Full-Evening Drop-Off',
      capacity: '1–6 guests per frame',
      footprint: '4 ft × 4 ft minimal footprint',
      powerReq: '110V outlet or 8-hour internal battery option',
      availability: 'Available',
      featured: false,
      popularRank: 7,
      suitableEvents: ['Birthday Parties', 'Baby Showers', 'Graduation Parties', 'Private Celebrations', 'School Events'],
      features: [
        'Bicolor studio LED halo ring light',
        'Photos, Boomerangs, GIFs & virtual digital props',
        'Instant SMS, Email, AirDrop & QR sharing',
        'Small 4×4 ft footprint fits any venue corner',
        'Optional wireless print pack upgrade'
      ],
      printOptions: 'Digital-only package by default (Physical printer add-on available for +$120).',
      digitalSharing: 'Unlimited SMS, Email, QR code, and live cloud gallery.',
      attendantService: 'Self-serve drop-off setup included (Dedicated attendant optional).',
      image: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'roaming-booth',
      name: 'Roaming Photo Booth',
      category: 'Roaming Photo Booth',
      tagline: 'Handheld Ring-Light Photographer Bringing the Booth to the Dance Floor',
      shortDesc: 'Our energetic roaming ambassador mingles through cocktail hour and the dance floor capturing guests anywhere.',
      description: 'Why wait in line when the photo booth can come to you? Our Roaming Photo Booth features a wireless handheld ring-light rig operated by a charismatic event host who circulates through cocktail hour, VIP tables, and the dance floor—texting photos and GIFs on the spot.',
      price: 600,
      duration: '3 Hours Active Roaming',
      capacity: 'Unlimited crowd coverage across the entire venue',
      footprint: 'Zero floor footprint — 100% mobile wireless',
      powerReq: '100% battery powered',
      availability: 'Available',
      featured: false,
      popularRank: 8,
      suitableEvents: ['Corporate Events', 'Cocktail Hours', 'Product Launches', 'Holiday Parties', 'Weddings'],
      features: [
        '100% wireless handheld studio ring-light rig',
        'Captures guests on the dance floor & cocktail lounges',
        'Instant on-screen SMS & QR code delivery',
        'Optional wireless belt/base-station printing',
        'Branded overlays and animated Boomerangs'
      ],
      printOptions: 'Digital instant delivery + optional base-station print pickup table.',
      digitalSharing: 'Immediate SMS & QR scan right from the handheld screen.',
      attendantService: 'Operated continuously by 1 energetic roaming photo ambassador.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'wedding-booth',
      name: 'Wedding Photo Booth',
      category: 'Wedding Photo Booth',
      tagline: 'White-Oak Heirloom Camera Tower & Keepsake Audio-Visual Guestbook',
      shortDesc: 'Crafted specifically for romantic receptions with white-oak woodwork, floral styling, and linen guestbook service.',
      description: 'Tailored from the ground up for weddings, our Heirloom White-Oak Booth blends effortlessly into luxury ballroom and garden receptions. Every session prints two copies—one for your guests and one mounted directly into a gold-foil linen guestbook alongside handwritten wishes.',
      price: 890,
      duration: '4 Hours Reception Package',
      capacity: 'Up to 10 guests per frame',
      footprint: '8 ft × 8 ft',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: true,
      popularRank: 9,
      suitableEvents: ['Weddings', 'Engagements', 'Anniversaries'],
      features: [
        'Hand-finished white-oak camera tower & brass tripod',
        'Complimentary linen wedding guestbook & metallic pens',
        'Bespoke monogram matched to your wedding invitations',
        'Idle hours support during dinner speeches',
        'Romantic warm-film or classic ivory color grading'
      ],
      printOptions: 'Double prints every session (one for guest, one for couple’s guestbook) on archival matte paper.',
      digitalSharing: 'Full online wedding gallery + downloadable zip archive of all prints and originals.',
      attendantService: 'Formal-attire wedding booth concierge dedicated to assembling your guestbook all night.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'corporate-booth',
      name: 'Corporate Event Booth',
      category: 'Corporate Event Booth',
      tagline: 'Full-Wrap Branded Activation Kiosk with Lead Capture & Analytics',
      shortDesc: 'Turn event attendees into brand advocates with custom vinyl booth wraps, branded microsites, and data capture.',
      description: 'Engineered for brand activations, conferences, and product launches. We customize every touchpoint—from exterior vinyl hardware wraps and custom UI welcome screens to branded email delivery, GDPR-compliant lead capture surveys, and post-event impression analytics.',
      price: 990,
      duration: '4 Hours Activation (Multi-Day Available)',
      capacity: 'High-throughput 90+ sessions per hour',
      footprint: '8 ft × 8 ft or custom trade-show booth fit',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: false,
      popularRank: 10,
      suitableEvents: ['Corporate Events', 'Brand Activations', 'Product Launches', 'Holiday Parties'],
      features: [
        'Custom branded UI welcome screen & step-and-repeat overlay',
        'Optional exterior vinyl hardware wrap with company logo',
        'Custom survey / email lead capture & CSV export',
        'AI background removal (Green-screen-free digital backgrounds)',
        'Post-event social reach & engagement report'
      ],
      printOptions: 'High-speed 6-second 4×6 branded prints or multi-frame strips.',
      digitalSharing: 'Branded HTML email template, custom SMS copy, and branded micro-gallery.',
      attendantService: 'Brand-trained activation specialist in professional attire.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'gif-boomerang',
      name: 'GIF and Boomerang Booth',
      category: 'GIF and Boomerang Booth',
      tagline: 'Animated Loop Studio with Neon Stickers & Instant Social Exports',
      shortDesc: 'Built for non-stop movement—create looping Boomerangs, stop-motion GIFs, and retro VHS-filter clips.',
      description: 'Static photos are just the beginning. Our GIF & Boomerang Studio captures rapid burst sequences and stitches them into smooth, looping animations complete with animated frame borders, retro date stamps, and digital sticker overlays ready for Instagram Stories and TikTok.',
      price: 590,
      duration: '3 Hours Base Rental',
      capacity: '1–8 guests per animation',
      footprint: '6 ft × 6 ft',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: false,
      popularRank: 11,
      suitableEvents: ['Birthday Parties', 'College Festivals', 'Graduation Parties', 'Holiday Parties', 'Private Celebrations'],
      features: [
        'Burst Boomerangs, 4-frame speed GIFs & still photos',
        'Animated neon & retro film-burn overlay templates',
        'Instant AirDrop, SMS & QR code phone transfer',
        'Live slideshow projection feed output (HDMI/Wireless)',
        'Optional print station upgrade'
      ],
      printOptions: 'Includes 2×6 still strip prints of the 4 GIF frames + animated digital file.',
      digitalSharing: 'Instant MP4 & GIF download optimized for vertical 9:16 social stories.',
      attendantService: 'Includes hype-host attendant to choreograph fun group Boomerangs.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 'premium-studio',
      name: 'Premium Studio Booth',
      category: 'Premium Studio Booth',
      tagline: 'Multi-Light Editorial Portrait Set with Live Photographer & Tethering',
      shortDesc: 'A full fashion-magazine portrait set at your event with a live portrait photographer and 5×7 fine-art prints.',
      description: 'Elevate your gala, wedding, or milestone event into a Vanity Fair-style portrait lounge. Instead of a fixed kiosk, our Premium Studio Booth brings a 3-point Profoto studio lighting setup, hand-painted canvas backdrop, live portrait photographer, and instant tethered 5×7 fine-art prints.',
      price: 1150,
      duration: '3 Hours Studio Set',
      capacity: '1–15 guests (couples, families, or large VIP groups)',
      footprint: '10 ft × 12 ft studio lounge area',
      powerReq: 'Standard 110V outlet',
      availability: 'Available',
      featured: true,
      popularRank: 12,
      suitableEvents: ['Weddings', 'Corporate Events', 'Anniversaries', 'Private Celebrations', 'Brand Activations'],
      features: [
        '3-point Profoto studio strobes & parabolic softboxes',
        'Live editorial portrait photographer directing every shot',
        'Tethered iPad review station & instant retouching',
        '5×7 fine-art prints in embossed cardboard folio frames',
        'Hand-painted canvas or velvet drapery backdrop'
      ],
      printOptions: '5×7 thick archival portrait prints presented inside keepsake cardstock folios.',
      digitalSharing: 'Instant tethered station delivery + full editorial online gallery.',
      attendantService: 'Includes 1 Lead Portrait Photographer + 1 Print & Digital Editor.',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80'
      ]
    }
  ];

  const DEFAULT_PACKAGES = [
    // WEDDING PACKAGES
    {
      id: 'wedding-essentials',
      name: 'Wedding Essentials',
      category: 'Wedding',
      price: 695,
      weekendPrice: 745,
      duration: '3 Hours',
      hours: 3,
      boothType: 'Open-Air Photo Booth or Wedding Photo Booth',
      printsDesc: 'Unlimited 2×6 Double Photo Strips',
      backdropChoices: 'Choice of 1 Standard or Shimmer Backdrop',
      digitalSharing: 'Instant SMS, Email & Online Gallery',
      stripCustomization: 'Custom Monogram & Wedding Date Template',
      attendant: '1 Dedicated Formal Booth Concierge',
      setupInfo: 'Complimentary Setup & Breakdown (60 mins prior)',
      recommended: false,
      active: true,
      features: [
        '3 Hours of Active Reception Booth Time',
        'Unlimited 2×6 Archival Photo Strips',
        'Curated Wedding Props Collection',
        'Instant SMS & QR Code Digital Sharing',
        'High-Resolution Online Wedding Gallery'
      ]
    },
    {
      id: 'wedding-memories',
      name: 'Wedding Memories',
      category: 'Wedding',
      price: 995,
      weekendPrice: 1050,
      duration: '4 Hours',
      hours: 4,
      boothType: 'Vintage Enclosed, Glam Booth, or Wedding Oak Booth',
      printsDesc: 'Unlimited 2×6 Strips OR 4×6 Editorial Prints',
      backdropChoices: 'Any Floral, Velvet, or Champagne Shimmer Backdrop',
      digitalSharing: 'SMS, AirDrop, Boomerangs & Private Cloud ZIP',
      stripCustomization: 'Bespoke Invitation-Matched Artwork & Foil Stamp Look',
      attendant: '1 White-Glove Concierge + Guestbook Host',
      setupInfo: 'Early Afternoon Setup + 1 Idle Hour Included',
      recommended: true,
      active: true,
      features: [
        '4 Hours of Active Reception Coverage',
        'Choice of Vintage Enclosed, Glam, or Heirloom Oak Booth',
        'Linen Keepsake Guestbook Station Included ($110 Value)',
        'Unlimited Prints for Every Guest in the Frame',
        'Bespoke Monogram & Custom Welcome Screen',
        '1 Complimentary Idle Hour During Dinner/Speeches'
      ]
    },
    {
      id: 'wedding-celebration',
      name: 'Wedding Celebration',
      category: 'Wedding',
      price: 1395,
      weekendPrice: 1495,
      duration: '5 Hours',
      hours: 5,
      boothType: 'Any Booth Style (Includes Retro Caravan or Premium Studio)',
      printsDesc: 'Unlimited 4×6 Fine-Art Prints + 2×6 Classic Strips',
      backdropChoices: 'Custom Printed Monogram or Luxury 3D Floral Wall',
      digitalSharing: 'Full Digital Suite + GIFs + Live Reception Slideshow',
      stripCustomization: 'Multi-Layout Custom Suite + Personalized Welcome UI',
      attendant: '2 Dedicated Event Concierges',
      setupInfo: 'Morning/Early Setup + 2 Idle Hours Included',
      recommended: false,
      active: true,
      features: [
        '5 Hours of Full Reception & Cocktail Coverage',
        'Select ANY Booth (Including Retro Caravan or Studio Set)',
        'Deluxe Linen Guestbook + Wooden Keepsake Photo Box',
        'Red Carpet VIP Stanchions & Artisan Props Trunk',
        '2 Complimentary Idle Hours for Seamless Timeline',
        'Same-Night Digital Album & USB Keepsake Drive'
      ]
    },

    // BIRTHDAY PACKAGES
    {
      id: 'birthday-fun',
      name: 'Birthday Fun',
      category: 'Birthday',
      price: 495,
      weekendPrice: 545,
      duration: '2 Hours',
      hours: 2,
      boothType: 'Digital Selfie Booth or Open-Air Booth',
      printsDesc: 'Digital Unlimited + 100 Instant 2×6 Strip Prints',
      backdropChoices: 'Classic White or Colorful Birthday Backdrop',
      digitalSharing: 'Instant SMS, QR Code & Boomerangs',
      stripCustomization: 'Playful Birthday Name & Age Overlay',
      attendant: '1 Party Booth Host',
      setupInfo: '45-Minute Setup & Breakdown Included',
      recommended: false,
      active: true,
      features: [
        '2 Hours of High-Energy Party Fun',
        '100 Instant 2×6 Photo Strips + Unlimited Digital Captures',
        'Boomerangs, GIFs & Birthday Sticker Filters',
        'Fun Party Props Box (Neon Signs, Glasses, Hats)',
        'Instant Phone Download via QR & SMS'
      ]
    },
    {
      id: 'party-plus',
      name: 'Party Plus',
      category: 'Birthday',
      price: 745,
      weekendPrice: 795,
      duration: '3 Hours',
      hours: 3,
      boothType: 'Open-Air, Mirror Booth, or GIF & Boomerang Booth',
      printsDesc: 'Unlimited 2×6 Strips or 4×6 Postcards',
      backdropChoices: 'Any Shimmer, Retro Disco, or Colorful Backdrop',
      digitalSharing: 'Unlimited Photos, Boomerangs, GIFs & Online Album',
      stripCustomization: 'Custom Theme Design + Personalized Touch Screen',
      attendant: '1 Energetic Party Host',
      setupInfo: '60-Minute Setup & Breakdown Included',
      recommended: true,
      active: true,
      features: [
        '3 Hours of Unlimited Photo & Boomerang Sessions',
        'Unlimited Prints for Every Party Guest',
        'Choice of Retro Disco, Shimmer, or Velvet Backdrop',
        'Deluxe Milestone Birthday Props & Custom Handheld Signs',
        'Custom Animated Welcome Screen with Guest of Honor Photo'
      ]
    },
    {
      id: 'ultimate-birthday',
      name: 'Ultimate Birthday Experience',
      category: 'Birthday',
      price: 1095,
      weekendPrice: 1175,
      duration: '4 Hours',
      hours: 4,
      boothType: '360-Degree Video Booth OR Glam Booth + Roaming',
      printsDesc: 'Unlimited 4×6 Glam Prints + 360 Slow-Mo Reels',
      backdropChoices: 'LED Tube Enclosure or Custom Neon Backdrop Wall',
      digitalSharing: 'Instant Sharing Kiosk + AirDrop + TikTok-Ready Reels',
      stripCustomization: 'Custom Motion Graphics & Music Beat-Sync Overlay',
      attendant: '2 VIP Event Operators',
      setupInfo: 'Full VIP Red Carpet & LED Lighting Rig Setup',
      recommended: false,
      active: true,
      features: [
        '4 Hours with 360° Video Booth OR Glam Booth',
        'Red Carpet Runway, Velvet Stanchions & RGB Tube Lights',
        'Custom Music Track & Animated Video Intro/Outro',
        'Unlimited Instant 4×6 Prints & Keep-Sake Memory Book',
        'Dedicated Sharing iPad Kiosk for Zero Wait Times'
      ]
    },

    // CORPORATE PACKAGES
    {
      id: 'corporate-essentials',
      name: 'Corporate Essentials',
      category: 'Corporate',
      price: 795,
      weekendPrice: 845,
      duration: '3 Hours',
      hours: 3,
      boothType: 'Open-Air Booth or Roaming Photo Booth',
      printsDesc: 'Unlimited Branded 2×6 or 4×6 Prints',
      backdropChoices: 'Solid Brand Color, Shimmer, or Classic White',
      digitalSharing: 'Branded SMS & Email Delivery + Cloud Gallery',
      stripCustomization: 'Company Logo, Hashtag & Brand Color Frame',
      attendant: '1 Professional Brand Ambassador',
      setupInfo: 'Certificate of Insurance (COI) & Early Setup Included',
      recommended: false,
      active: true,
      features: [
        '3 Hours of Corporate Mixer or Holiday Party Coverage',
        'Custom Company Logo & Event Hashtag Print Overlay',
        'Branded SMS & Email Sharing Links',
        'Curated Corporate-Friendly Props & Custom Speech Bubbles',
        'Venue Certificate of Insurance (COI) Provided'
      ]
    },
    {
      id: 'brand-experience',
      name: 'Brand Experience',
      category: 'Corporate',
      price: 1295,
      weekendPrice: 1395,
      duration: '4 Hours',
      hours: 4,
      boothType: 'Corporate Event Booth, Glam Booth, or 360 Video Booth',
      printsDesc: 'Unlimited High-Speed 4×6 Branded Prints + Boomerangs',
      backdropChoices: 'Custom Printed 8×8 Step-and-Repeat Backdrop Included',
      digitalSharing: 'Branded Microsite, Lead Capture & Real-Time Analytics',
      stripCustomization: 'Full Brand UI Welcome Screen + 3 Overlay Choices',
      attendant: '2 Brand-Trained Activation Specialists',
      setupInfo: 'Early Load-In, COI & Post-Event Data Report',
      recommended: true,
      active: true,
      features: [
        '4 Hours of High-Throughput Brand Activation',
        'Custom Printed 8×8 ft Step-and-Repeat Backdrop Included',
        'Branded Touch-Screen UI & Custom Email Microsite',
        'Optional Guest Survey / Marketing Opt-In Lead Capture',
        'Post-Event Analytics Report (Impressions, Shares, Emails)'
      ]
    },
    {
      id: 'corporate-premium',
      name: 'Corporate Premium',
      category: 'Corporate',
      price: 1895,
      weekendPrice: 1995,
      duration: '6 Hours (Full Day / Gala)',
      hours: 6,
      boothType: 'Full Vinyl-Wrapped Booth + Roaming Booth Combo',
      printsDesc: 'Unlimited 5×7 Folio Prints or 4×6 + 360 Video Reels',
      backdropChoices: 'Custom 10×8 Fabric Tension Wall + AI Virtual Backgrounds',
      digitalSharing: 'Enterprise Lead API, Live Event Mosaic Wall & AirDrop',
      stripCustomization: 'Complete Custom Exterior Hardware Wrap + UI Suite',
      attendant: '2 On-Site Technicians + 1 Roaming Ambassador',
      setupInfo: 'Day-Before or Early AM Setup + Dedicated Account Manager',
      recommended: false,
      active: true,
      features: [
        '6 Hours of Full-Scale Conference, Launch, or Gala Activation',
        'Custom Exterior Vinyl Wrap on Photo Booth Hardware',
        'Includes Secondary Wireless Roaming Booth for VIP Cocktail Hour',
        'AI Background Removal with 4 Custom Branded Scenes',
        'Full CSV Lead Export & Executive Summary Deck'
      ]
    },

    // PRIVATE PARTY PACKAGES
    {
      id: 'classic-party',
      name: 'Classic Party',
      category: 'Private Party',
      price: 545,
      weekendPrice: 595,
      duration: '3 Hours',
      hours: 3,
      boothType: 'Open-Air Booth or Digital Selfie Booth',
      printsDesc: 'Unlimited 2×6 Retro Photo Strips',
      backdropChoices: 'Choice of 6 Curated Party Backdrops',
      digitalSharing: 'Instant SMS, QR Code & Online Album',
      stripCustomization: 'Custom Retro Typography & Date Stamp',
      attendant: '1 Friendly Booth Host',
      setupInfo: 'Standard 60-Minute Setup & Breakdown',
      recommended: false,
      active: true,
      features: [
        '3 Hours of Non-Stop Celebration Captures',
        'Unlimited 2×6 Classic Photo Strips',
        'Choice of Shimmer, Velvet, or Classic Backdrop',
        'Handpicked Artisan Props & Retro Sunglasses',
        'Full Digital Gallery Link Within 24 Hours'
      ]
    },
    {
      id: 'retro-party',
      name: 'Retro Party',
      category: 'Private Party',
      price: 795,
      weekendPrice: 850,
      duration: '4 Hours',
      hours: 4,
      boothType: 'Vintage Enclosed Booth or Mirror Photo Booth',
      printsDesc: 'Unlimited 2×6 Warm-Film Strips + 4×6 Keepsakes',
      backdropChoices: 'Retro Disco, Velvet Glam, or Vintage Curtain',
      digitalSharing: 'Photos, GIFs, Boomerangs & Instant AirDrop',
      stripCustomization: '70s/90s Nostalgic Film Strip Artwork & Custom Stickers',
      attendant: '1 Vintage-Styled Event Host',
      setupInfo: 'Complimentary Setup + Prop Styling Table',
      recommended: true,
      active: true,
      features: [
        '4 Hours with Authentic Vintage Enclosed or Mirror Booth',
        'Signature Warm-Analog Film Filter + Classic B&W Option',
        'Unlimited Archival Prints + Magnetic Strip Sleeves',
        'Retro Disco Ball Props, Vintage Telephones & Neon Signs',
        'Complimentary Scrapbook Station for Guests'
      ]
    },
    {
      id: 'all-night-celebration',
      name: 'All-Night Celebration',
      category: 'Private Party',
      price: 1195,
      weekendPrice: 1295,
      duration: '5 Hours',
      hours: 5,
      boothType: 'Any Booth Style (Including Retro Caravan or 360 Booth)',
      printsDesc: 'Unlimited Multi-Format Prints + Slow-Mo Video Reels',
      backdropChoices: 'Any Premium Backdrop + Red Carpet Entrance',
      digitalSharing: 'Instant Kiosk Sharing + Live TV Slideshow Feed',
      stripCustomization: 'Bespoke Event Branding + Custom Prop Cutouts',
      attendant: '2 Dedicated Event Hosts',
      setupInfo: 'Flexible Early Setup + Late-Night Strike Included',
      recommended: false,
      active: true,
      features: [
        '5 Hours of All-Night Party Entertainment',
        'Choice of Any Flagship Booth (Retro Caravan, 360, or Glam)',
        '5 Custom Big-Head or Branded Prop Cutouts Included',
        'VIP Red Carpet Setup & Champagne Shimmer Wall',
        'Unlimited Prints, GIFs, Boomerangs & Keepsake Guestbook'
      ]
    }
  ];

  const DEFAULT_BACKDROPS = [
    {
      id: 'classic-white',
      name: 'Classic White',
      category: 'Classic White',
      price: 0,
      included: true,
      dimensions: '8 ft × 8 ft Matte Tension Fabric',
      description: 'Crisp, seamless studio arctic white—essential for Kardashians-style Black & White Glam portraits and clean editorial shots.',
      suitableFor: ['Weddings', 'Glam Booth', 'Corporate Events'],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'floral-garden',
      name: 'Floral Garden',
      category: 'Floral Garden',
      price: 120,
      included: false,
      dimensions: '8 ft × 8 ft 3D Silk Botanical Wall',
      description: 'Lush hand-arranged ivory roses, dusty pink peonies, and eucalyptus foliage creating a romantic garden sanctuary.',
      suitableFor: ['Weddings', 'Bridal Showers', 'Baby Showers', 'Engagements'],
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'champagne-shimmer',
      name: 'Champagne Shimmer',
      category: 'Champagne Shimmer',
      price: 95,
      included: false,
      dimensions: '8 ft × 8 ft Kinetic Sequin Panel Wall',
      description: 'Thousands of individual champagne-gold kinetic sequins that catch the studio strobe and shimmer in every Boomerang.',
      suitableFor: ['Weddings', 'Birthday Parties', 'New Year Parties', 'Anniversaries'],
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'retro-disco',
      name: 'Retro Disco',
      category: 'Retro Disco',
      price: 110,
      included: false,
      dimensions: '8 ft × 8 ft Holographic Silver & Mirror-Ball Accent',
      description: 'Studio 54 nostalgia featuring holographic silver fringe, warm sunset gradients, and cluster mirror-ball floor accents.',
      suitableFor: ['Birthday Parties', 'Private Parties', 'Holiday Parties', 'College Festivals'],
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'velvet-glam',
      name: 'Velvet Glam',
      category: 'Velvet Glam',
      price: 130,
      included: false,
      dimensions: '8 ft × 8 ft Heavy Pleated Theatre Velvet',
      description: 'Sumptuous pleated cherry-crimson or deep plum stage velvet that absorbs stray light for rich, moody vintage portraits.',
      suitableFor: ['Weddings', 'Galas', 'Private Celebrations', 'Anniversaries'],
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'colorful-birthday',
      name: 'Colorful Birthday',
      category: 'Colorful Birthday',
      price: 85,
      included: false,
      dimensions: '8 ft × 8 ft Pastel Arch & Confetti Motif',
      description: 'Vibrant butter yellow, coral, and retro teal color-block arches ready to pair with milestone numbers and balloon garlands.',
      suitableFor: ['Birthday Parties', 'Graduation Parties', 'Baby Showers', 'School Events'],
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'wedding-elegance',
      name: 'Wedding Elegance',
      category: 'Wedding Elegance',
      price: 140,
      included: false,
      dimensions: '8 ft × 8 ft Warm Ivory Silk & Brass Arch',
      description: 'Timeless warm ivory silk drapery paired with a minimalist brushed-brass botanical arch and warm fairy uplighting.',
      suitableFor: ['Weddings', 'Engagements', 'Anniversaries'],
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'corporate-branding',
      name: 'Corporate Branding',
      category: 'Corporate Branding',
      price: 195,
      included: false,
      dimensions: '8 ft × 8 ft or 10 ft × 8 ft Matte Pillowcase Step & Repeat',
      description: 'Non-glare dye-sublimated fabric tension wall printed with your company logos, event title, or sponsor grid.',
      suitableFor: ['Corporate Events', 'Brand Activations', 'Product Launches'],
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'seasonal-themes',
      name: 'Seasonal Themes',
      category: 'Seasonal Themes',
      price: 90,
      included: false,
      dimensions: '8 ft × 8 ft Curated Holiday & Seasonal Sets',
      description: 'From Winter Evergreen & Gold Velvet to Autumn Harvest Terracotta and Summer Tropical Palm sets.',
      suitableFor: ['Holiday Parties', 'Community Events', 'School Events'],
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'custom-printed',
      name: 'Custom Printed Backdrops',
      category: 'Custom Printed Backdrops',
      price: 250,
      included: false,
      dimensions: '8 ft × 8 ft Bespoke Graphic or Illustrated Scene',
      description: 'Work 1-on-1 with our in-house illustrator to design and print a one-of-a-kind backdrop that you keep after the event.',
      suitableFor: ['Weddings', 'Brand Activations', 'Milestone Birthdays', 'Product Launches'],
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80'
    }
  ];

  const DEFAULT_ADDONS = [
    {
      id: 'premium-prints',
      name: 'Premium Photo Prints',
      category: 'Print Upgrade',
      price: 120,
      includedInStandard: false,
      icon: 'bi-printer-fill',
      description: 'Upgrade to unlimited 4×6 luxury metallic-pearl finish prints + protective acrylic magnetic frames for every guest.'
    },
    {
      id: 'custom-strip-design',
      name: 'Custom Photo Strip Design',
      category: 'Design',
      price: 75,
      includedInStandard: false,
      icon: 'bi-palette2',
      description: 'Bespoke hand-lettered crest, custom illustration, or exact match to your event stationery by our design studio.'
    },
    {
      id: 'extra-hour',
      name: 'Extra Rental Hour',
      category: 'Time Extension',
      price: 175,
      includedInStandard: false,
      icon: 'bi-clock-history',
      description: 'Keep the flash popping for an additional 60 minutes of active booth operation, prints, and attendant service.'
    },
    {
      id: 'guestbook-station',
      name: 'Guestbook Station',
      category: 'Keepsake',
      price: 110,
      includedInStandard: false,
      icon: 'bi-journal-album',
      description: 'Heirloom linen-bound album, archival photo-safe mounting corners, gold/silver metallic pens, and attendant curation.'
    },
    {
      id: 'props-collection',
      name: 'Artisan Props Collection',
      category: 'Styling',
      price: 65,
      includedInStandard: false,
      icon: 'bi-sunglasses',
      description: 'Expanded trunk of vintage cameras, velvet hats, custom laser-cut wood signs, and retro frames (Standard props included free).'
    },
    {
      id: 'red-carpet',
      name: 'Red Carpet Setup',
      category: 'VIP Experience',
      price: 135,
      includedInStandard: false,
      icon: 'bi-stars',
      description: '10 ft plush crimson or black velvet runway with 4 polished brass stanchions and velvet ropes.'
    },
    {
      id: 'digital-gallery',
      name: 'Digital Cloud Gallery',
      category: 'Digital',
      price: 0,
      includedInStandard: true,
      icon: 'bi-cloud-arrow-down-fill',
      description: 'Included with all bookings: private high-resolution online gallery with 1-click ZIP download and guest sharing.'
    },
    {
      id: 'gif-boomerang-addon',
      name: 'GIF and Boomerang Sharing',
      category: 'Digital Upgrade',
      price: 85,
      includedInStandard: false,
      icon: 'bi-film',
      description: 'Add animated looping Boomerangs and 4-frame GIF exports with custom animated sticker overlays to any print booth.'
    },
    {
      id: 'welcome-screen',
      name: 'Personalized Welcome Screen',
      category: 'Customization',
      price: 60,
      includedInStandard: false,
      icon: 'bi-display',
      description: 'Custom animated touch-to-start welcome video or portrait slideshow displayed on the booth screen between sessions.'
    },
    {
      id: 'branded-overlays',
      name: 'Branded Photo Overlays',
      category: 'Corporate',
      price: 145,
      includedInStandard: false,
      icon: 'bi-badge-ad-fill',
      description: 'Multi-choice branded watermarks, sponsor logos, and custom SMS/Email marketing copy with lead capture.'
    },
    {
      id: 'dedicated-attendant',
      name: 'Dedicated Booth Attendant',
      category: 'Service',
      price: 150,
      includedInStandard: false,
      icon: 'bi-person-badge-fill',
      description: 'Add a second on-site booth host for 200+ guest count events or add a dedicated attendant to a Digital Selfie Booth.'
    },
    {
      id: 'custom-backdrop-addon',
      name: 'Custom Backdrop Design',
      category: 'Backdrop Upgrade',
      price: 240,
      includedInStandard: false,
      icon: 'bi-easel2-fill',
      description: 'Custom-printed 8×8 ft matte fabric backdrop featuring your monogram, brand pattern, or illustrated mural.'
    }
  ];

  const DEFAULT_EVENTS = [
    {
      id: 'weddings',
      name: 'Weddings',
      icon: 'bi-heart-fill',
      shortDesc: 'Timeless reception entertainment with heirloom linen guestbooks, custom monograms, and romantic lighting.',
      recommendedBooths: ['Wedding Photo Booth', 'Glam Booth', 'Vintage Enclosed Photo Booth', 'Retro Caravan Booth'],
      suitablePackages: ['Wedding Memories', 'Wedding Celebration', 'Wedding Essentials'],
      suggestedBackdrops: ['Wedding Elegance', 'Floral Garden', 'Classic White'],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'engagements',
      name: 'Engagements',
      icon: 'bi-gem',
      shortDesc: 'Celebrate saying "Yes!" with custom save-the-date photo strips and champagne shimmer backdrops.',
      recommendedBooths: ['Glam Booth', 'Open-Air Photo Booth', 'Mirror Photo Booth'],
      suitablePackages: ['Wedding Essentials', 'Retro Party'],
      suggestedBackdrops: ['Champagne Shimmer', 'Floral Garden', 'Classic White'],
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'birthday-parties',
      name: 'Birthday Parties',
      icon: 'bi-balloon-heart-fill',
      shortDesc: 'From Sweet 16s and 21sts to milestone 30th, 40th, and 50th bashes—capture every laugh and Boomerang.',
      recommendedBooths: ['360-Degree Video Booth', 'Open-Air Photo Booth', 'Mirror Photo Booth', 'GIF and Boomerang Booth'],
      suitablePackages: ['Party Plus', 'Ultimate Birthday Experience', 'Birthday Fun'],
      suggestedBackdrops: ['Colorful Birthday', 'Retro Disco', 'Champagne Shimmer'],
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'anniversaries',
      name: 'Anniversaries',
      icon: 'bi-award-fill',
      shortDesc: 'Honor decades of love with nostalgic analog-toned photo strips and multi-generational family portraits.',
      recommendedBooths: ['Vintage Enclosed Photo Booth', 'Premium Studio Booth', 'Wedding Photo Booth'],
      suitablePackages: ['Wedding Memories', 'Retro Party'],
      suggestedBackdrops: ['Velvet Glam', 'Champagne Shimmer', 'Wedding Elegance'],
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'graduation-parties',
      name: 'Graduation Parties',
      icon: 'bi-mortarboard-fill',
      shortDesc: 'Toss the cap and celebrate the grad with custom school-color strips, Boomerangs, and oversized prop cutouts.',
      recommendedBooths: ['Open-Air Photo Booth', 'GIF and Boomerang Booth', '360-Degree Video Booth'],
      suitablePackages: ['Party Plus', 'Classic Party'],
      suggestedBackdrops: ['Colorful Birthday', 'Champagne Shimmer', 'Custom Printed Backdrops'],
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'baby-showers',
      name: 'Baby Showers',
      icon: 'bi-stars',
      shortDesc: 'Sweet pastel backdrops, floral arches, and keepsake ultrasound-style photo strips for parents-to-be.',
      recommendedBooths: ['Open-Air Photo Booth', 'Digital Selfie Booth', 'Mirror Photo Booth'],
      suitablePackages: ['Classic Party', 'Birthday Fun'],
      suggestedBackdrops: ['Floral Garden', 'Colorful Birthday', 'Classic White'],
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'corporate-events',
      name: 'Corporate Events',
      icon: 'bi-briefcase-fill',
      shortDesc: 'Elevate company galas, summits, and team retreats with branded prints and studio-grade executive portraits.',
      recommendedBooths: ['Corporate Event Booth', 'Premium Studio Booth', 'Roaming Photo Booth'],
      suitablePackages: ['Corporate Essentials', 'Brand Experience', 'Corporate Premium'],
      suggestedBackdrops: ['Corporate Branding', 'Classic White', 'Velvet Glam'],
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'brand-activations',
      name: 'Brand Activations',
      icon: 'bi-megaphone-fill',
      shortDesc: 'Turn foot traffic into viral social content with full vinyl booth wraps, custom microsites, and lead capture.',
      recommendedBooths: ['Corporate Event Booth', '360-Degree Video Booth', 'Retro Caravan Booth'],
      suitablePackages: ['Brand Experience', 'Corporate Premium'],
      suggestedBackdrops: ['Corporate Branding', 'Custom Printed Backdrops'],
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'product-launches',
      name: 'Product Launches',
      icon: 'bi-rocket-takeoff-fill',
      shortDesc: 'Make your launch night unforgettable with influencer-ready 360 slow-mo videos and custom branded overlays.',
      recommendedBooths: ['360-Degree Video Booth', 'Glam Booth', 'Roaming Photo Booth'],
      suitablePackages: ['Brand Experience', 'Corporate Premium'],
      suggestedBackdrops: ['Custom Printed Backdrops', 'Corporate Branding', 'Retro Disco'],
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'school-events',
      name: 'School Events',
      icon: 'bi-building',
      shortDesc: 'Proms, homecomings, and fundraisers—high-speed printing so every group of friends leaves with a strip.',
      recommendedBooths: ['Open-Air Photo Booth', 'Mirror Photo Booth', 'Digital Selfie Booth'],
      suitablePackages: ['Party Plus', 'Classic Party'],
      suggestedBackdrops: ['Retro Disco', 'Champagne Shimmer', 'Seasonal Themes'],
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'college-festivals',
      name: 'College Festivals',
      icon: 'bi-music-note-beamed',
      shortDesc: 'Campusfests, Greek formals, and tailgate activations with instant AirDrop and TikTok-ready Boomerangs.',
      recommendedBooths: ['360-Degree Video Booth', 'GIF and Boomerang Booth', 'Retro Caravan Booth'],
      suitablePackages: ['Ultimate Birthday Experience', 'All-Night Celebration'],
      suggestedBackdrops: ['Retro Disco', 'Colorful Birthday', 'Custom Printed Backdrops'],
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'holiday-parties',
      name: 'Holiday Parties',
      icon: 'bi-snow2',
      shortDesc: 'Festive winter wonderland sets, velvet curtains, and holiday card prints for office and family celebrations.',
      recommendedBooths: ['Vintage Enclosed Photo Booth', 'Open-Air Photo Booth', 'Roaming Photo Booth'],
      suitablePackages: ['Retro Party', 'Corporate Essentials', 'All-Night Celebration'],
      suggestedBackdrops: ['Seasonal Themes', 'Velvet Glam', 'Champagne Shimmer'],
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'private-celebrations',
      name: 'Private Celebrations',
      icon: 'bi-cup-straw',
      shortDesc: 'Dinner soirées, housewarmings, Bar/Bat Mitzvahs, and backyard garden parties styled to perfection.',
      recommendedBooths: ['Vintage Enclosed Photo Booth', 'Glam Booth', 'Digital Selfie Booth'],
      suitablePackages: ['Classic Party', 'Retro Party', 'All-Night Celebration'],
      suggestedBackdrops: ['Velvet Glam', 'Floral Garden', 'Retro Disco'],
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'community-events',
      name: 'Community Events',
      icon: 'bi-people-fill',
      shortDesc: 'Charity galas, street fairs, block parties, and cultural festivals with high-capacity guest flow.',
      recommendedBooths: ['Open-Air Photo Booth', 'Retro Caravan Booth', 'Roaming Photo Booth'],
      suitablePackages: ['Classic Party', 'Corporate Essentials'],
      suggestedBackdrops: ['Colorful Birthday', 'Seasonal Themes', 'Custom Printed Backdrops'],
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const DEFAULT_GALLERY = [
    {
      id: 'gal-1',
      title: 'Elena & Marcus Candlelight Reception',
      category: 'Weddings',
      eventTag: 'Wedding Photo Booth',
      date: 'September 2026',
      caption: 'Black-and-white editorial prints and linen guestbook station at The Conservatory.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-2',
      title: 'Chloe’s Disco 30th Soirée',
      category: 'Birthdays',
      eventTag: 'Open-Air Photo Booth',
      date: 'August 2026',
      caption: 'Holographic silver fringe and neon props kept the dance floor glowing until 1 AM.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-3',
      title: 'Vogue & Velvet Annual Tech Gala',
      category: 'Corporate Events',
      eventTag: 'Corporate Event Booth',
      date: 'October 2026',
      caption: 'Custom vinyl-wrapped booth with instant step-and-repeat portrait printing for 450 attendees.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-4',
      title: 'Mid-Century Rooftop Cocktail Night',
      category: 'Private Parties',
      eventTag: 'Vintage Enclosed Photo Booth',
      date: 'July 2026',
      caption: 'Guests piled behind the cherry velvet curtain for classic 4-frame vertical analog strips.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-5',
      title: 'Clementine 1972 Caravan Vineyard Tour',
      category: 'Retro Themes',
      eventTag: 'Retro Caravan Booth',
      date: 'June 2026',
      caption: 'Our pastel 1972 camper lounge parked beneath string lights at Sonoma Estates.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-6',
      title: 'Monochrome Red Carpet Editorial Lounge',
      category: 'Glam Booths',
      eventTag: 'Glam Booth',
      date: 'September 2026',
      caption: 'Flawless skin-smoothing B&W portraits on thick 4×6 fine-art matte cardstock.',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-7',
      title: 'Neon Orbit 360° Launch Party',
      category: '360 Video Booths',
      eventTag: '360-Degree Video Booth',
      date: 'October 2026',
      caption: '120fps slow-motion video reels surrounded by wireless RGB pixel tubes.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-8',
      title: 'Hand-Arranged Peony & Rose Botanical Wall',
      category: 'Backdrops',
      eventTag: 'Floral Garden Backdrop',
      date: 'August 2026',
      caption: 'Our 8×8 ft silk floral installation paired with warm brass uplighting.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-9',
      title: 'Bespoke Foil-Stamped Keepsake Strips',
      category: 'Photo Strips',
      eventTag: 'Custom Strip Artwork',
      date: 'September 2026',
      caption: 'Archival 2×6 vertical strips with custom typography and linen guestbook mounting.',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-10',
      title: 'Curated Vintage Cameras & Neon Signs',
      category: 'Props and Setups',
      eventTag: 'Artisan Props Collection',
      date: 'October 2026',
      caption: 'No flimsy paper sticks—only curated retro eyewear, velvet hats, and custom acrylic signs.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-11',
      title: 'Garden Estate Champagne Reception',
      category: 'Weddings',
      eventTag: 'Mirror Photo Booth',
      date: 'July 2026',
      caption: 'Full-length vanity mirror booth with personalized guest signatures drawn on glass.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'gal-12',
      title: 'Midnight Confetti New Year Countdown',
      category: 'Private Parties',
      eventTag: 'GIF and Boomerang Booth',
      date: 'September 2026',
      caption: 'Burst Boomerangs and golden confetti cannon moments captured at 60 frames per second.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const DEFAULT_REVIEWS = [
    {
      id: 'rev-1',
      name: 'Clara & Julian Vance',
      role: 'Bride & Groom',
      eventType: 'Weddings',
      boothUsed: 'Vintage Enclosed Photo Booth',
      rating: 5,
      date: '2026-09-28',
      verifiedSample: true,
      featured: true,
      comment: 'The mahogany Vintage Enclosed Booth was the undisputed star of our wedding reception! Even our 82-year-old grandmother squeezed behind the velvet curtain three times. The linen guestbook they assembled for us that night is our favorite wedding keepsake.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rev-2',
      name: 'Marcus Sterling',
      role: 'VP of Experiential Marketing',
      eventType: 'Corporate Events',
      boothUsed: 'Corporate Event Booth',
      rating: 5,
      date: '2026-09-14',
      verifiedSample: true,
      featured: true,
      comment: 'We booked the Brand Experience package for our 600-person product launch. Snapora wrapped the hardware in our brand colors, built a custom lead-capture flow, and delivered 1,400+ branded social shares in 4 hours.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rev-3',
      name: 'Sienna Morales',
      role: '30th Birthday Host',
      eventType: 'Birthday Parties',
      boothUsed: '360-Degree Video Booth',
      rating: 5,
      date: '2026-08-22',
      verifiedSample: true,
      featured: true,
      comment: 'Our guests could NOT get enough of the 360 Video Booth and the Retro Disco backdrop! The instant AirDrop kiosk meant everyone had their slow-mo videos posted to Instagram Stories before the cake even came out.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rev-4',
      name: 'Hannah & Devon Brooks',
      role: 'Engagement Party Hosts',
      eventType: 'Weddings',
      boothUsed: 'Glam Booth',
      rating: 5,
      date: '2026-08-05',
      verifiedSample: true,
      featured: false,
      comment: 'The Black & White Glam Booth portraits look like they were shot by a celebrity portrait photographer. The skin-smoothing filter is subtle, flattering, and the 4×6 matte prints feel so luxurious.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rev-5',
      name: 'David & Priya Nair',
      role: '25th Anniversary Hosts',
      eventType: 'Private Parties',
      boothUsed: 'Retro Caravan Booth',
      rating: 5,
      date: '2026-07-19',
      verifiedSample: true,
      featured: false,
      comment: 'Having Clementine the 1972 Retro Caravan parked in our garden made the entire evening feel like a vintage film set. The attendants were warm, punctual, and so patient with the kids and grandparents.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rev-6',
      name: 'Olivia Chen',
      role: 'University Events Director',
      eventType: 'Corporate Events',
      boothUsed: 'GIF and Boomerang Booth',
      rating: 5,
      date: '2026-06-30',
      verifiedSample: true,
      featured: false,
      comment: 'Booking through the online portal was effortless. We tracked our reservation from Under Review to Event Preparation right in the dashboard, and the booth ran non-stop for 500 students!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      eventImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const DEFAULT_BLOGS = [
    {
      id: 'blog-1',
      title: 'Vintage Enclosed vs. Open-Air Photo Booths: Which Fits Your Wedding Vibe?',
      category: 'Wedding Planning',
      author: 'Eleanor Vance, Creative Director',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      date: 'October 4, 2026',
      readTime: '6 min read',
      featured: true,
      tags: ['Weddings', 'Vintage Booth', 'Open-Air', 'Reception Ideas'],
      excerpt: 'Torn between the intimate nostalgia of a velvet-curtained analog booth and the big-group energy of an open-air setup? Here is how to match your booth to your venue layout and guest list.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      content: [
        'Choosing the right photo booth for your wedding reception is about more than just a camera in the corner—it shapes how your guests interact, mingle, and remember the night.',
        'An authentic Vintage Enclosed Photo Booth creates a private little sanctuary. When two to four guests pull the crimson velvet curtain closed, inhibitions vanish. The result? Unscripted laughter, romantic candid kisses, and iconic 2×6 vertical photo strips that feel straight out of a 1960s cinema lobby.',
        'On the other hand, an Open-Air Photo Booth shines when your wedding party loves big group energy. With an 8×8 ft floral or champagne shimmer backdrop and a studio beauty-dish flash, up to 12 college friends or cousins can pile into a single frame.',
        'Our top planning tip: Place your photo booth near the bar or dance floor—never tucked away in a separate hallway. Sightlines drive participation, and a bustling booth next to cocktail tables guarantees your linen guestbook will be overflowing by the last dance.'
      ]
    },
    {
      id: 'blog-2',
      title: '7 Milestone Birthday Themes That Pair Perfectly with a 360° Video Booth',
      category: 'Birthday Party Ideas',
      author: 'Julian Mercer, Lead Lighting Tech',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      date: 'September 26, 2026',
      readTime: '5 min read',
      featured: false,
      tags: ['Birthday Parties', '360 Video Booth', 'Party Themes', 'Disco'],
      excerpt: 'From Studio 54 Disco Fever to Neon Y2K Cyber Lounges, discover how kinetic backdrops and RGB tube lighting make 120fps slow-motion videos pop.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
      content: [
        'A 360-Degree Video Booth thrives on movement, texture, and dynamic lighting. When the camera arm orbits at 120 frames per second, outfits and props with kinetic motion look extraordinary.',
        '1. Studio 54 Holographic Disco: Pair silver fringe backdrops with mirror balls and feather boas.',
        '2. Old Hollywood Black-Tie: Combine velvet rope stanchions with confetti poppers and champagne flutes.',
        '3. Pastel Retro Diner: Use butter yellow and cherry red signage for playful vintage vibes.'
      ]
    },
    {
      id: 'blog-3',
      title: 'How Branded Photo Booth Activations Drive 4x Higher Event Social Reach',
      category: 'Corporate Events',
      author: 'Marcus Sterling, Brand Strategist',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
      date: 'September 18, 2026',
      readTime: '7 min read',
      featured: false,
      tags: ['Corporate Events', 'Brand Activations', 'ROI', 'Lead Capture'],
      excerpt: 'Why modern experiential marketers are swapping static step-and-repeats for interactive AI background removal, custom vinyl wraps, and instant SMS microsites.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      content: [
        'At conferences and product launches, attendees only share content when it makes them look incredible. By combining studio-grade lighting with subtle brand overlays and instant AirDrop/SMS delivery, guests organically post their portraits within 90 seconds of stepping off the carpet.',
        'With customizable GDPR-compliant data capture and post-event CSV analytics, your photo booth transitions from an entertainment expense into a measurable lead-generation engine.'
      ]
    },
    {
      id: 'blog-4',
      title: 'The Secret Behind Celebrity-Style Black & White Glam Booth Portraits',
      category: 'Photo Booth Tips',
      author: 'Eleanor Vance, Creative Director',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      date: 'September 10, 2026',
      readTime: '4 min read',
      featured: false,
      tags: ['Glam Booth', 'Lighting', 'Portraits', 'Weddings'],
      excerpt: 'How parabolic studio modifiers, arctic-white tension backdrops, and custom tonal curves create effortless magazine-cover skin tones.',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
      content: [
        'What separates a true Glam Booth from a basic black-and-white filter? Optical glass and large-source diffused flash. We use a 38-inch parabolic beauty dish positioned right along the lens axis to eliminate harsh under-eye shadows before our subtle skin-softening LUT is even applied.'
      ]
    },
    {
      id: 'blog-5',
      title: '10 Statement Photo Booth Backdrops Trending for 2026–2027 Celebrations',
      category: 'Backdrop Inspiration',
      author: 'Clara Lin, Set Stylist',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
      date: 'August 29, 2026',
      readTime: '5 min read',
      featured: false,
      tags: ['Backdrops', 'Velvet', 'Floral Walls', 'Design Trends'],
      excerpt: 'Heavy pleated theatre velvet, kinetic champagne sequins, and bespoke hand-illustrated murals are replacing flat vinyl banners.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
      content: [
        'Texture is everything on camera. Heavy pleated cherry and plum velvet absorbs flash reflections for rich editorial depth, while kinetic champagne sequin walls bring movement to Boomerangs and GIFs.'
      ]
    },
    {
      id: 'blog-6',
      title: 'Designing the Ultimate Retro 1970s Garden Party with a Vintage Caravan Booth',
      category: 'Party Themes',
      author: 'Clara Lin, Set Stylist',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
      date: 'August 15, 2026',
      readTime: '6 min read',
      featured: false,
      tags: ['Retro Caravan', 'Outdoor Events', 'Party Themes', 'Nostalgia'],
      excerpt: 'How to style an outdoor estate or vineyard celebration around our restored 1972 pastel camper photo lounge.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80',
      content: [
        'Nothing anchors an outdoor cocktail lawn quite like a restored 1972 travel trailer. Surround the caravan awning with rattan peacock chairs, bistro string lighting, and a vintage vinyl DJ setup for an immersive nostalgic experience.'
      ]
    },
    {
      id: 'blog-7',
      title: 'Why Audio & Photo Guestbooks Are Replacing Traditional Sign-In Books',
      category: 'Event Entertainment',
      author: 'Julian Mercer, Lead Lighting Tech',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      date: 'August 2, 2026',
      readTime: '4 min read',
      featured: false,
      tags: ['Guestbooks', 'Weddings', 'Keepsakes', 'Photo Strips'],
      excerpt: 'Give your guests a metallic pen, archival photo tape, and an extra printed strip—and watch your guestbook turn into a hilarious work of art.',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80',
      content: [
        'A traditional lined sign-in book rarely gets opened after the wedding. A linen photo-strip album filled with candid 4-pose strips and late-night handwritten notes becomes a coffee-table heirloom you will flip through every anniversary.'
      ]
    },
    {
      id: 'blog-8',
      title: 'Analog Warmth Meets Instant Cloud Delivery: Photography Trends in 2026',
      category: 'Photography Trends',
      author: 'Eleanor Vance, Creative Director',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      date: 'July 21, 2026',
      readTime: '5 min read',
      featured: false,
      tags: ['Photography Trends', 'Film Aesthetics', 'Instant Print', 'Digital Sharing'],
      excerpt: 'Guests want tactile archival paper strips to put on their fridge AND a 4K Boomerang on their phone before they walk back to their table.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
      content: [
        'The magic of modern photo booth experiences lies in pairing tactile nostalgia with frictionless technology. Our custom color science replicates warm Kodak Portra skin tones on physical archival paper while delivering instant QR/AirDrop files to every guest.'
      ]
    }
  ];

  const DEFAULT_USERS = [
    {
      id: 'usr-admin-1',
      name: 'Elena Wright',
      email: 'admin@photobooth.com',
      phone: '(555) 019-2830',
      role: 'admin',
      passwordToken: demoHash('Admin@123'),
      status: 'Active',
      joinedDate: '2025-01-10',
      city: 'Los Angeles, CA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      preferences: {
        favoriteEventType: 'Weddings',
        preferredContact: 'Email & SMS',
        newsletter: true
      }
    },
    {
      id: 'usr-cust-1',
      name: 'Claire Bennett',
      email: 'claire@example.com',
      phone: '(555) 384-9201',
      role: 'customer',
      passwordToken: demoHash('Customer@123'),
      status: 'Active',
      joinedDate: '2026-04-12',
      city: 'San Francisco, CA',
      savedVenue: 'The Conservatory at One Sansome',
      savedEventDate: '2026-11-14',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      preferences: {
        favoriteEventType: 'Weddings',
        preferredStyle: 'Vintage Enclosed Photo Booth',
        preferredContact: 'Email & SMS',
        newsletter: true
      }
    },
    {
      id: 'usr-cust-2',
      name: 'Liam O’Connor',
      email: 'liam@horizonmedia.io',
      phone: '(555) 741-8820',
      role: 'customer',
      passwordToken: demoHash('Customer@123'),
      status: 'Active',
      joinedDate: '2026-06-02',
      city: 'Austin, TX',
      savedVenue: 'The Fairmont Grand Ballroom',
      savedEventDate: '2026-11-28',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      preferences: {
        favoriteEventType: 'Corporate Events',
        preferredStyle: 'Corporate Event Booth',
        preferredContact: 'Email',
        newsletter: true
      }
    },
    {
      id: 'usr-cust-3',
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      phone: '(555) 619-4402',
      role: 'customer',
      passwordToken: demoHash('Customer@123'),
      status: 'Active',
      joinedDate: '2026-07-18',
      city: 'Seattle, WA',
      savedVenue: 'Founders Club Loft',
      savedEventDate: '2026-10-24',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      preferences: {
        favoriteEventType: 'Birthday Parties',
        preferredStyle: '360-Degree Video Booth',
        preferredContact: 'SMS',
        newsletter: false
      }
    }
  ];

  const DEFAULT_BOOKINGS = [
    {
      id: 'FB-2026-8491',
      reference: 'FB-2026-8491',
      customerId: 'usr-cust-1',
      customerName: 'Claire Bennett',
      customerEmail: 'claire@example.com',
      customerPhone: '(555) 384-9201',
      eventType: 'Weddings',
      eventDate: '2026-11-14',
      startTime: '18:00',
      endTime: '22:00',
      duration: '4 Hours',
      venueName: 'The Conservatory at One Sansome',
      eventCity: 'San Francisco, CA',
      guestCount: 165,
      boothId: 'vintage-enclosed',
      boothName: 'Vintage Enclosed Photo Booth',
      packageId: 'wedding-memories',
      packageName: 'Wedding Memories',
      backdropId: 'floral-garden',
      backdropName: 'Floral Garden',
      stripDesign: 'Classic Ivory Serif Monogram (2×6)',
      addonIds: ['guestbook-station', 'custom-strip-design'],
      addonNames: ['Guestbook Station', 'Custom Photo Strip Design'],
      basePrice: 995,
      backdropPrice: 120,
      addonsPrice: 185,
      totalPrice: 1300,
      status: 'Confirmed',
      coordinator: 'Eleanor Vance',
      instructions: 'Load-in via service elevator on Pine St at 4:15 PM. Match strip crest to gold foil invitation suite.',
      internalNotes: 'COI sent to venue manager on Oct 5. Linen guestbook in ivory reserved.',
      createdAt: '2026-09-20T14:30:00Z',
      updatedAt: '2026-10-02T11:15:00Z'
    },
    {
      id: 'FB-2026-8514',
      reference: 'FB-2026-8514',
      customerId: 'usr-cust-1',
      customerName: 'Claire Bennett',
      customerEmail: 'claire@example.com',
      customerPhone: '(555) 384-9201',
      eventType: 'Engagements',
      eventDate: '2026-12-05',
      startTime: '19:00',
      endTime: '22:00',
      duration: '3 Hours',
      venueName: 'Bix Supper Club Mezzanine',
      eventCity: 'San Francisco, CA',
      guestCount: 75,
      boothId: 'glam-booth',
      boothName: 'Glam Booth',
      packageId: 'wedding-essentials',
      packageName: 'Wedding Essentials',
      backdropId: 'classic-white',
      backdropName: 'Classic White',
      stripDesign: 'Editorial B&W 4×6 Portrait Border',
      addonIds: ['premium-prints'],
      addonNames: ['Premium Photo Prints'],
      basePrice: 695,
      backdropPrice: 0,
      addonsPrice: 120,
      totalPrice: 815,
      status: 'Pending',
      coordinator: 'Unassigned',
      instructions: 'Post-wedding holiday cocktail party for close friends. Prefer high-contrast B&W Glam filter.',
      internalNotes: 'Awaiting coordinator assignment.',
      createdAt: '2026-10-11T09:20:00Z',
      updatedAt: '2026-10-11T09:20:00Z'
    },
    {
      id: 'FB-2026-8302',
      reference: 'FB-2026-8302',
      customerId: 'usr-cust-3',
      customerName: 'Maya Lin',
      customerEmail: 'maya.lin@example.com',
      customerPhone: '(555) 619-4402',
      eventType: 'Birthday Parties',
      eventDate: '2026-10-24',
      startTime: '20:00',
      endTime: '23:00',
      duration: '3 Hours',
      venueName: 'Founders Club Loft',
      eventCity: 'Seattle, WA',
      guestCount: 90,
      boothId: '360-video-booth',
      boothName: '360-Degree Video Booth',
      packageId: 'party-plus',
      packageName: 'Party Plus',
      backdropId: 'retro-disco',
      backdropName: 'Retro Disco',
      stripDesign: 'Neon 70s Disco Frame',
      addonIds: ['red-carpet', 'props-collection'],
      addonNames: ['Red Carpet Setup', 'Artisan Props Collection'],
      basePrice: 745,
      backdropPrice: 110,
      addonsPrice: 200,
      totalPrice: 1055,
      status: 'Event Preparation',
      coordinator: 'Julian Mercer',
      instructions: '30th Birthday Disco theme! Please bring mirror ball props and set RGB tubes to warm amber/magenta.',
      internalNotes: '360 arm calibrated, custom music track approved by client.',
      createdAt: '2026-09-12T16:40:00Z',
      updatedAt: '2026-10-10T15:00:00Z'
    },
    {
      id: 'FB-2026-8610',
      reference: 'FB-2026-8610',
      customerId: 'usr-cust-2',
      customerName: 'Liam O’Connor',
      customerEmail: 'liam@horizonmedia.io',
      customerPhone: '(555) 741-8820',
      eventType: 'Corporate Events',
      eventDate: '2026-11-28',
      startTime: '17:30',
      endTime: '21:30',
      duration: '4 Hours',
      venueName: 'The Fairmont Grand Ballroom',
      eventCity: 'Austin, TX',
      guestCount: 350,
      boothId: 'corporate-booth',
      boothName: 'Corporate Event Booth',
      packageId: 'brand-experience',
      packageName: 'Brand Experience',
      backdropId: 'corporate-branding',
      backdropName: 'Corporate Branding',
      stripDesign: 'Horizon Annual Summit 4×6 Step-and-Repeat',
      addonIds: ['branded-overlays', 'dedicated-attendant'],
      addonNames: ['Branded Photo Overlays', 'Dedicated Booth Attendant'],
      basePrice: 1295,
      backdropPrice: 195,
      addonsPrice: 295,
      totalPrice: 1785,
      status: 'Under Review',
      coordinator: 'Marcus Sterling',
      instructions: 'Need vector EPS logo applied to welcome screen and 8×8 fabric step-and-repeat.',
      internalNotes: 'Reviewing vector artwork proofs with client marketing team.',
      createdAt: '2026-10-08T10:05:00Z',
      updatedAt: '2026-10-12T13:10:00Z'
    },
    {
      id: 'FB-2026-7940',
      reference: 'FB-2026-7940',
      customerId: 'usr-cust-1',
      customerName: 'Claire Bennett',
      customerEmail: 'claire@example.com',
      customerPhone: '(555) 384-9201',
      eventType: 'Private Celebrations',
      eventDate: '2026-08-18',
      startTime: '16:00',
      endTime: '19:00',
      duration: '3 Hours',
      venueName: 'Sausalito Yacht Club Terrace',
      eventCity: 'Sausalito, CA',
      guestCount: 60,
      boothId: 'open-air',
      boothName: 'Open-Air Photo Booth',
      packageId: 'classic-party',
      packageName: 'Classic Party',
      backdropId: 'champagne-shimmer',
      backdropName: 'Champagne Shimmer',
      stripDesign: 'Coastal Summer 2×6 Strip',
      addonIds: ['digital-gallery'],
      addonNames: ['Digital Cloud Gallery'],
      basePrice: 545,
      backdropPrice: 95,
      addonsPrice: 0,
      totalPrice: 640,
      status: 'Event Completed',
      coordinator: 'Clara Lin',
      instructions: 'Bridal shower on the covered terrace.',
      internalNotes: 'Completed successfully. Online gallery delivered Aug 19.',
      createdAt: '2026-07-15T12:00:00Z',
      updatedAt: '2026-08-19T09:30:00Z'
    },
    {
      id: 'FB-2026-8105',
      reference: 'FB-2026-8105',
      customerId: 'usr-cust-2',
      customerName: 'Liam O’Connor',
      customerEmail: 'liam@horizonmedia.io',
      customerPhone: '(555) 741-8820',
      eventType: 'Product Launches',
      eventDate: '2026-10-13',
      startTime: '18:00',
      endTime: '22:00',
      duration: '4 Hours',
      venueName: 'South Congress Atelier',
      eventCity: 'Austin, TX',
      guestCount: 220,
      boothId: 'roaming-booth',
      boothName: 'Roaming Photo Booth',
      packageId: 'brand-experience',
      packageName: 'Brand Experience',
      backdropId: 'classic-white',
      backdropName: 'Classic White',
      stripDesign: 'Animated Neon Launch Overlay',
      addonIds: ['gif-boomerang-addon'],
      addonNames: ['GIF and Boomerang Sharing'],
      basePrice: 1295,
      backdropPrice: 0,
      addonsPrice: 85,
      totalPrice: 1380,
      status: 'Confirmed',
      coordinator: 'Julian Mercer',
      instructions: 'Today’s VIP launch event! Roaming ambassador should focus on rooftop lounge from 6–8 PM.',
      internalNotes: 'Batteries charged 100%, custom SMS link tested.',
      createdAt: '2026-09-25T11:00:00Z',
      updatedAt: '2026-10-12T18:00:00Z'
    },
    {
      id: 'FB-2026-7712',
      reference: 'FB-2026-7712',
      customerId: 'usr-cust-3',
      customerName: 'Maya Lin',
      customerEmail: 'maya.lin@example.com',
      customerPhone: '(555) 619-4402',
      eventType: 'Holiday Parties',
      eventDate: '2026-12-19',
      startTime: '19:00',
      endTime: '22:00',
      duration: '3 Hours',
      venueName: 'Olympic Sculpture Pavilion',
      eventCity: 'Seattle, WA',
      guestCount: 110,
      boothId: 'mirror-booth',
      boothName: 'Mirror Photo Booth',
      packageId: 'retro-party',
      packageName: 'Retro Party',
      backdropId: 'velvet-glam',
      backdropName: 'Velvet Glam',
      stripDesign: 'Winter Velvet Gold Crest',
      addonIds: [],
      addonNames: [],
      basePrice: 795,
      backdropPrice: 130,
      addonsPrice: 0,
      totalPrice: 925,
      status: 'Cancelled',
      coordinator: 'Unassigned',
      instructions: 'Venue date moved to January; cancelled to rebook later.',
      internalNotes: 'Cancelled by customer via dashboard.',
      createdAt: '2026-09-01T08:15:00Z',
      updatedAt: '2026-09-10T14:20:00Z'
    }
  ];

  const DEFAULT_MESSAGES = [
    {
      id: 'msg-1',
      name: 'Sophia & Ethan Sterling',
      email: 'sophia.sterling@example.com',
      phone: '(555) 239-8104',
      eventType: 'Weddings',
      eventDate: '2027-05-22',
      message: 'We are hosting a 180-guest vineyard wedding in Napa and would love a custom quote for both the Retro Caravan Booth during cocktail hour and the Glam Booth inside the barn reception!',
      status: 'Unread',
      createdAt: '2026-10-12T17:45:00Z'
    },
    {
      id: 'msg-2',
      name: 'Jordan Vance (Apex Creative)',
      email: 'jordan@apexcreative.co',
      phone: '(555) 892-1130',
      eventType: 'Brand Activations',
      eventDate: '2026-11-19',
      message: 'Looking for 3 Corporate Event Booths simultaneously across our 2-day conference with custom vinyl wraps and CSV survey capture.',
      status: 'Replied',
      createdAt: '2026-10-09T11:20:00Z'
    }
  ];

  const DEFAULT_FAVORITES = {
    'usr-cust-1': {
      booths: ['vintage-enclosed', 'glam-booth', 'retro-caravan'],
      packages: ['wedding-memories', 'retro-party']
    },
    'guest': {
      booths: ['vintage-enclosed', '360-video-booth'],
      packages: ['wedding-memories']
    }
  };

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif-1',
      targetRole: 'customer',
      userId: 'usr-cust-1',
      title: 'Booking #FB-2026-8491 Confirmed!',
      text: 'Your Vintage Enclosed Photo Booth for Nov 14, 2026 has been confirmed and assigned to coordinator Eleanor Vance.',
      time: '2 hours ago',
      read: false,
      link: 'booking-details.html?ref=FB-2026-8491'
    },
    {
      id: 'notif-2',
      targetRole: 'customer',
      userId: 'usr-cust-1',
      title: 'Custom Monogram Proof Ready',
      text: 'Our studio uploaded the ivory & gold photo strip layout for your upcoming wedding reception.',
      time: 'Yesterday',
      read: false,
      link: 'bookings.html'
    },
    {
      id: 'notif-3',
      targetRole: 'admin',
      userId: 'usr-admin-1',
      title: 'New Booking Request #FB-2026-8514',
      text: 'Claire Bennett requested Glam Booth for Dec 5, 2026 ($815 Estimated Total).',
      time: '1 hour ago',
      read: false,
      link: 'bookings.html'
    },
    {
      id: 'notif-4',
      targetRole: 'admin',
      userId: 'usr-admin-1',
      title: 'New Custom Quote Inquiry',
      text: 'Sophia & Ethan Sterling sent a multi-booth vineyard wedding inquiry for May 2027.',
      time: '5 hours ago',
      read: false,
      link: 'reports.html'
    }
  ];

  function safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      console.warn('LocalStorage parse warning for key:', key, e);
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorage write error for key:', key, e);
      return false;
    }
  }

  function initStore(forceReset = false) {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit || forceReset) {
      localStorage.removeItem(STORAGE_KEYS.SESSION); // No account signed in initially
      safeSet(STORAGE_KEYS.USERS, DEFAULT_USERS);
      safeSet(STORAGE_KEYS.BOOTHS, DEFAULT_BOOTHS);
      safeSet(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
      safeSet(STORAGE_KEYS.BACKDROPS, DEFAULT_BACKDROPS);
      safeSet(STORAGE_KEYS.ADDONS, DEFAULT_ADDONS);
      safeSet(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
      safeSet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
      safeSet(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
      safeSet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
      safeSet(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
      safeSet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      safeSet(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
      safeSet(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Ensure no missing collections if upgraded
      if (!localStorage.getItem(STORAGE_KEYS.BOOTHS)) safeSet(STORAGE_KEYS.BOOTHS, DEFAULT_BOOTHS);
      if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) safeSet(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
      if (!localStorage.getItem(STORAGE_KEYS.BACKDROPS)) safeSet(STORAGE_KEYS.BACKDROPS, DEFAULT_BACKDROPS);
      if (!localStorage.getItem(STORAGE_KEYS.ADDONS)) safeSet(STORAGE_KEYS.ADDONS, DEFAULT_ADDONS);
      if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) safeSet(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
      if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) safeSet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) safeSet(STORAGE_KEYS.USERS, DEFAULT_USERS);
      if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) safeSet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
      if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) safeSet(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
      if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) safeSet(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
      if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) safeSet(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
      if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) safeSet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) safeSet(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
    }
  }

  // Ensure that no demo account is automatically signed in initially
  const GUEST_INIT_KEY = 'fb_studio_guest_init_v1';
  if (!localStorage.getItem(GUEST_INIT_KEY)) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.setItem(GUEST_INIT_KEY, 'true');
  }

  // Auto-migrate any existing cached demo records in localStorage to Snapora brand
  try {
    const SNAPORA_MIGRATION_KEY = 'snapora_brand_migrated_v1';
    if (!localStorage.getItem(SNAPORA_MIGRATION_KEY)) {
      Object.values(STORAGE_KEYS).forEach(key => {
        const raw = localStorage.getItem(key);
        if (raw && /flashback/i.test(raw)) {
          const updated = raw
            .replace(/Flashback Studio/gi, 'Snapora')
            .replace(/Flashback/gi, 'Snapora')
            .replace(/FLASHBACK/g, 'SNAPORA');
          localStorage.setItem(key, updated);
        }
      });
      localStorage.setItem(SNAPORA_MIGRATION_KEY, 'true');
    }
  } catch (err) {
    // Silent fallback if storage is restricted
  }

  // Initialize immediately
  initStore(false);

  const PBStore = {
    KEYS: STORAGE_KEYS,
    demoHash,

    resetAllDemoData() {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      const rtl = localStorage.getItem(STORAGE_KEYS.RTL);
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      initStore(true);
      if (theme) localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (rtl) localStorage.setItem(STORAGE_KEYS.RTL, rtl);
      if (session) localStorage.setItem(STORAGE_KEYS.SESSION, session);
      return true;
    },

    // --- BOOTHS ---
    getBooths() {
      return safeGet(STORAGE_KEYS.BOOTHS, DEFAULT_BOOTHS);
    },
    getBoothById(id) {
      const booths = this.getBooths();
      return booths.find(b => b.id === id) || booths[0];
    },
    saveBooth(boothData) {
      const booths = this.getBooths();
      const idx = booths.findIndex(b => b.id === boothData.id);
      if (idx > -1) {
        booths[idx] = { ...booths[idx], ...boothData };
      } else {
        const newId = boothData.id || ('booth-' + Date.now());
        booths.unshift({
          ...boothData,
          id: newId,
          gallery: boothData.gallery || [boothData.image],
          features: Array.isArray(boothData.features) ? boothData.features : (boothData.features || '').split(',').map(s => s.trim()).filter(Boolean),
          suitableEvents: Array.isArray(boothData.suitableEvents) ? boothData.suitableEvents : ['Weddings', 'Birthday Parties', 'Corporate Events']
        });
      }
      safeSet(STORAGE_KEYS.BOOTHS, booths);
      return booths;
    },
    deleteBooth(id) {
      const booths = this.getBooths().filter(b => b.id !== id);
      safeSet(STORAGE_KEYS.BOOTHS, booths);
      return booths;
    },

    // --- PACKAGES ---
    getPackages(includeInactive = false) {
      const pkgs = safeGet(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
      return includeInactive ? pkgs : pkgs.filter(p => p.active !== false);
    },
    getPackageById(id) {
      const pkgs = this.getPackages(true);
      return pkgs.find(p => p.id === id) || pkgs[0];
    },
    savePackage(pkgData) {
      const pkgs = this.getPackages(true);
      const idx = pkgs.findIndex(p => p.id === pkgData.id);
      if (idx > -1) {
        pkgs[idx] = { ...pkgs[idx], ...pkgData };
      } else {
        const newId = pkgData.id || ('pkg-' + Date.now());
        pkgs.push({
          ...pkgData,
          id: newId,
          weekendPrice: Number(pkgData.price || 595) + 60,
          active: pkgData.active !== undefined ? pkgData.active : true,
          features: Array.isArray(pkgData.features) ? pkgData.features : (pkgData.features || '').split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      safeSet(STORAGE_KEYS.PACKAGES, pkgs);
      return pkgs;
    },
    deletePackage(id) {
      const pkgs = this.getPackages(true).filter(p => p.id !== id);
      safeSet(STORAGE_KEYS.PACKAGES, pkgs);
      return pkgs;
    },

    // --- BACKDROPS & ADDONS & EVENTS ---
    getBackdrops() {
      return safeGet(STORAGE_KEYS.BACKDROPS, DEFAULT_BACKDROPS);
    },
    getBackdropById(id) {
      return this.getBackdrops().find(b => b.id === id) || this.getBackdrops()[0];
    },
    getAddons() {
      return safeGet(STORAGE_KEYS.ADDONS, DEFAULT_ADDONS);
    },
    getAddonById(id) {
      return this.getAddons().find(a => a.id === id);
    },
    getEvents() {
      return safeGet(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    },
    getGallery() {
      return safeGet(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    },
    getBlogs() {
      return safeGet(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
    },
    getBlogById(id) {
      const blogs = this.getBlogs();
      return blogs.find(b => b.id === id) || blogs[0];
    },

    // --- BOOKINGS ---
    getBookings() {
      return safeGet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    },
    getBookingByRef(ref) {
      const bookings = this.getBookings();
      return bookings.find(b => b.reference === ref || b.id === ref) || bookings[0];
    },
    getCustomerBookings(userOrEmail) {
      const bookings = this.getBookings();
      if (!userOrEmail) return bookings;
      const email = (typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email || '').toLowerCase();
      const userId = typeof userOrEmail === 'object' ? userOrEmail.id : null;
      return bookings.filter(b =>
        (b.customerEmail && b.customerEmail.toLowerCase() === email) ||
        (userId && b.customerId === userId)
      );
    },
    createBooking(bookingPayload) {
      const bookings = this.getBookings();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const ref = bookingPayload.reference || `FB-2026-${randomNum}`;

      // Prevent accidental rapid duplicate submission within 10 seconds
      const duplicate = bookings.find(b =>
        b.customerEmail?.toLowerCase() === bookingPayload.customerEmail?.toLowerCase() &&
        b.eventDate === bookingPayload.eventDate &&
        b.boothId === bookingPayload.boothId &&
        (Date.now() - new Date(b.createdAt).getTime() < 10000)
      );
      if (duplicate) return duplicate;

      const newBooking = {
        id: ref,
        reference: ref,
        customerId: bookingPayload.customerId || 'usr-cust-1',
        customerName: bookingPayload.customerName,
        customerEmail: bookingPayload.customerEmail,
        customerPhone: bookingPayload.customerPhone,
        eventType: bookingPayload.eventType || 'Weddings',
        eventDate: bookingPayload.eventDate,
        startTime: bookingPayload.startTime || '18:00',
        endTime: bookingPayload.endTime || '22:00',
        duration: bookingPayload.duration || '4 Hours',
        venueName: bookingPayload.venueName,
        eventCity: bookingPayload.eventCity,
        guestCount: Number(bookingPayload.guestCount || 100),
        boothId: bookingPayload.boothId,
        boothName: bookingPayload.boothName,
        packageId: bookingPayload.packageId,
        packageName: bookingPayload.packageName,
        backdropId: bookingPayload.backdropId,
        backdropName: bookingPayload.backdropName,
        stripDesign: bookingPayload.stripDesign || 'Classic Editorial 2×6 Strip',
        addonIds: bookingPayload.addonIds || [],
        addonNames: bookingPayload.addonNames || [],
        basePrice: Number(bookingPayload.basePrice || 0),
        backdropPrice: Number(bookingPayload.backdropPrice || 0),
        addonsPrice: Number(bookingPayload.addonsPrice || 0),
        totalPrice: Number(bookingPayload.totalPrice || 0),
        status: 'Pending',
        coordinator: 'Unassigned',
        instructions: bookingPayload.instructions || '',
        internalNotes: 'Submitted via online booking studio.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      bookings.unshift(newBooking);
      safeSet(STORAGE_KEYS.BOOKINGS, bookings);

      // Ensure customer record exists without duplicating by email
      this.ensureCustomerFromBooking(newBooking);

      // Add notifications for both customer and admin
      this.addNotification({
        targetRole: 'customer',
        userId: newBooking.customerId,
        title: `Booking Request ${ref} Received`,
        text: `Your ${newBooking.boothName} request for ${newBooking.eventDate} is now Pending review.`,
        link: `booking-details.html?ref=${ref}`
      });
      this.addNotification({
        targetRole: 'admin',
        userId: 'usr-admin-1',
        title: `New Booking ${ref}`,
        text: `${newBooking.customerName} booked ${newBooking.boothName} for ${newBooking.eventDate} ($${newBooking.totalPrice.toLocaleString()}).`,
        link: 'bookings.html'
      });

      return newBooking;
    },
    updateBooking(ref, updates) {
      const bookings = this.getBookings();
      const idx = bookings.findIndex(b => b.reference === ref || b.id === ref);
      if (idx === -1) return null;
      const oldStatus = bookings[idx].status;
      bookings[idx] = {
        ...bookings[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      safeSet(STORAGE_KEYS.BOOKINGS, bookings);

      if (updates.status && updates.status !== oldStatus) {
        this.addNotification({
          targetRole: 'customer',
          userId: bookings[idx].customerId,
          title: `Booking ${ref} Status: ${updates.status}`,
          text: `Your reservation for ${bookings[idx].eventDate} (${bookings[idx].boothName}) is now "${updates.status}".`,
          link: `booking-details.html?ref=${ref}`
        });
      }
      return bookings[idx];
    },

    // --- DRAFT BOOKING (Preserves Multi-Step State) ---
    getDraftBooking() {
      return safeGet(STORAGE_KEYS.DRAFT_BOOKING, {
        step: 1,
        eventType: 'Weddings',
        eventDate: '',
        startTime: '18:00',
        endTime: '22:00',
        duration: '4 Hours',
        venueName: '',
        eventCity: '',
        guestCount: 120,
        boothId: 'vintage-enclosed',
        packageId: 'wedding-memories',
        backdropId: 'champagne-shimmer',
        stripDesign: 'Classic Ivory Monogram 2×6 Strip',
        addonIds: ['guestbook-station'],
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        eventContact: '',
        instructions: ''
      });
    },
    saveDraftBooking(draftUpdates) {
      const current = this.getDraftBooking();
      const updated = { ...current, ...draftUpdates };
      safeSet(STORAGE_KEYS.DRAFT_BOOKING, updated);
      return updated;
    },
    clearDraftBooking() {
      localStorage.removeItem(STORAGE_KEYS.DRAFT_BOOKING);
    },

    // --- USERS & CUSTOMERS ---
    getUsers() {
      return safeGet(STORAGE_KEYS.USERS, DEFAULT_USERS);
    },
    getCustomersWithStats() {
      const users = this.getUsers().filter(u => u.role === 'customer');
      const bookings = this.getBookings();
      const today = new Date().toISOString().split('T')[0];

      return users.map(u => {
        const userBookings = bookings.filter(b =>
          b.customerEmail?.toLowerCase() === u.email?.toLowerCase() || b.customerId === u.id
        );
        const upcoming = userBookings.filter(b => b.eventDate >= today && b.status !== 'Cancelled' && b.status !== 'Event Completed');
        const completed = userBookings.filter(b => b.status === 'Event Completed');
        const spending = userBookings
          .filter(b => b.status !== 'Cancelled')
          .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

        return {
          ...u,
          bookingsCount: userBookings.length,
          upcomingCount: upcoming.length,
          completedCount: completed.length,
          estimatedSpending: spending,
          bookingHistory: userBookings
        };
      });
    },
    ensureCustomerFromBooking(booking) {
      if (!booking || !booking.customerEmail) return;
      const users = this.getUsers();
      const emailLower = booking.customerEmail.toLowerCase();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === emailLower);
      if (existingIdx === -1) {
        users.push({
          id: booking.customerId || ('usr-cust-' + Date.now()),
          name: booking.customerName || 'Event Client',
          email: booking.customerEmail,
          phone: booking.customerPhone || '(555) 010-9900',
          role: 'customer',
          passwordToken: demoHash('Customer@123'),
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          city: booking.eventCity || 'San Francisco, CA',
          savedVenue: booking.venueName || '',
          savedEventDate: booking.eventDate || '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          preferences: {
            favoriteEventType: booking.eventType || 'Weddings',
            preferredStyle: booking.boothName || 'Vintage Enclosed Photo Booth',
            preferredContact: 'Email & SMS',
            newsletter: true
          }
        });
        safeSet(STORAGE_KEYS.USERS, users);
      }
    },
    updateUser(userId, updates) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...updates };
      safeSet(STORAGE_KEYS.USERS, users);
      const session = this.getSession();
      if (session && session.id === userId) {
        this.setSession({ ...session, ...updates });
      }
      return users[idx];
    },

    // --- SESSION ---
    getSession() {
      return safeGet(STORAGE_KEYS.SESSION, null);
    },
    setSession(userObj) {
      if (!userObj) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return null;
      }
      const cleanSession = {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone || '(555) 384-9201',
        role: userObj.role || 'customer',
        avatar: userObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        city: userObj.city || 'San Francisco, CA',
        loginTime: new Date().toISOString()
      };
      safeSet(STORAGE_KEYS.SESSION, cleanSession);
      return cleanSession;
    },
    clearSession() {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    // --- FAVORITES ---
    getFavorites(userId) {
      const uid = userId || (this.getSession()?.id) || 'usr-cust-1';
      const allFavs = safeGet(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
      if (!allFavs[uid]) {
        allFavs[uid] = DEFAULT_FAVORITES[uid]
          ? JSON.parse(JSON.stringify(DEFAULT_FAVORITES[uid]))
          : { booths: ['vintage-enclosed', 'glam-booth'], packages: ['wedding-memories'] };
        safeSet(STORAGE_KEYS.FAVORITES, allFavs);
      }
      return allFavs[uid];
    },
    toggleFavorite(type, itemId, userId) {
      const uid = userId || (this.getSession()?.id) || 'usr-cust-1';
      const allFavs = safeGet(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
      if (!allFavs[uid]) {
        allFavs[uid] = DEFAULT_FAVORITES[uid]
          ? JSON.parse(JSON.stringify(DEFAULT_FAVORITES[uid]))
          : { booths: ['vintage-enclosed', 'glam-booth'], packages: ['wedding-memories'] };
      }
      if (!Array.isArray(allFavs[uid][type])) {
        allFavs[uid][type] = [];
      }
      const list = allFavs[uid][type];
      const idx = list.indexOf(itemId);
      let added = false;
      if (idx > -1) {
        list.splice(idx, 1);
        added = false;
      } else {
        list.push(itemId);
        added = true;
      }
      allFavs[uid][type] = list;
      safeSet(STORAGE_KEYS.FAVORITES, allFavs);
      return { added, list };
    },
    removeFavorite(type, itemId, userId) {
      const uid = userId || (this.getSession()?.id) || 'usr-cust-1';
      const allFavs = safeGet(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
      if (!allFavs[uid]) {
        allFavs[uid] = DEFAULT_FAVORITES[uid]
          ? JSON.parse(JSON.stringify(DEFAULT_FAVORITES[uid]))
          : { booths: ['vintage-enclosed', 'glam-booth'], packages: ['wedding-memories'] };
      }
      if (!Array.isArray(allFavs[uid][type])) {
        allFavs[uid][type] = [];
      }
      allFavs[uid][type] = allFavs[uid][type].filter(id => id !== itemId);
      safeSet(STORAGE_KEYS.FAVORITES, allFavs);
      return { added: false, list: allFavs[uid][type] };
    },

    // --- REVIEWS ---
    getReviews() {
      return safeGet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    },
    addReview(reviewData) {
      const reviews = this.getReviews();
      const newRev = {
        id: 'rev-' + Date.now(),
        name: reviewData.name,
        role: reviewData.role || 'Event Host (Demo Submission)',
        eventType: reviewData.eventType || 'Weddings',
        boothUsed: reviewData.boothUsed || 'Vintage Enclosed Photo Booth',
        rating: Number(reviewData.rating || 5),
        date: new Date().toISOString().split('T')[0],
        verifiedSample: false,
        featured: false,
        comment: reviewData.comment,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        eventImage: reviewData.eventImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
      };
      reviews.unshift(newRev);
      safeSet(STORAGE_KEYS.REVIEWS, reviews);
      return newRev;
    },

    // --- CONTACT MESSAGES ---
    getMessages() {
      return safeGet(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    },
    addMessage(msgData) {
      const msgs = this.getMessages();
      const newMsg = {
        id: 'msg-' + Date.now(),
        name: msgData.name,
        email: msgData.email,
        phone: msgData.phone,
        eventType: msgData.eventType,
        eventDate: msgData.eventDate,
        message: msgData.message,
        status: 'Unread',
        createdAt: new Date().toISOString()
      };
      msgs.unshift(newMsg);
      safeSet(STORAGE_KEYS.MESSAGES, msgs);
      this.addNotification({
        targetRole: 'admin',
        userId: 'usr-admin-1',
        title: `New Inquiry from ${msgData.name}`,
        text: `${msgData.eventType} inquiry for ${msgData.eventDate}.`,
        link: 'reports.html'
      });
      return newMsg;
    },

    // --- NOTIFICATIONS ---
    getNotifications(role = 'customer') {
      const all = safeGet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      return all.filter(n => n.targetRole === role);
    },
    addNotification(notif) {
      const all = safeGet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      all.unshift({
        id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 100),
        targetRole: notif.targetRole || 'customer',
        userId: notif.userId || 'usr-cust-1',
        title: notif.title,
        text: notif.text,
        time: 'Just now',
        read: false,
        link: notif.link || '#'
      });
      safeSet(STORAGE_KEYS.NOTIFICATIONS, all.slice(0, 30));
    },
    markNotificationsRead(role = 'customer') {
      const all = safeGet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS).map(n =>
        n.targetRole === role ? { ...n, read: true } : n
      );
      safeSet(STORAGE_KEYS.NOTIFICATIONS, all);
    },

    // --- DASHBOARD ANALYTICS CALCULATOR ---
    getAdminStatistics() {
      const bookings = this.getBookings();
      const customers = this.getUsers().filter(u => u.role === 'customer');
      const today = '2026-10-13'; // matches current metadata date or ISO date

      const totalCustomers = customers.length;
      const totalBookings = bookings.length;
      const todaysEvents = bookings.filter(b => b.eventDate === today && b.status !== 'Cancelled').length;
      const upcomingEvents = bookings.filter(b => b.eventDate >= today && b.status !== 'Cancelled' && b.status !== 'Event Completed').length;
      const pendingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Booking Requested' || b.status === 'Under Review').length;
      const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Event Preparation').length;
      const completedEvents = bookings.filter(b => b.status === 'Event Completed').length;
      const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
      const estimatedRevenue = bookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((acc, b) => acc + Number(b.totalPrice || 0), 0);

      return {
        totalCustomers,
        totalBookings,
        todaysEvents,
        upcomingEvents,
        pendingBookings,
        confirmedBookings,
        completedEvents,
        cancelledBookings,
        estimatedRevenue
      };
    }
  };

  window.PBStore = PBStore;
})(window);
