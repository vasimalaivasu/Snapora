# Snapora — Vintage Photo Booth & Event Rental Company HTML5 Template

A ThemeForest-ready, multipurpose frontend HTML5 template designed for **Photo Booth Rental Companies, Wedding Entertainment Studios, Corporate Experiential Agencies, and Multi-Location Event Rental Businesses**.

Snapora combines the playful nostalgia of mid-century analog photography (Polaroid frames, 35mm film strips, warm cream & cherry-red editorial palette) with a complete modern SaaS-style **7-Step Booking Engine**, **Customer Reservation Portal**, and **Admin Management Dashboard** powered by browser `LocalStorage`.

---

## 1. Technology Stack

- **HTML5** (Semantic markup, SEO metadata, Open Graph tags, ARIA accessibility)
- **Tailwind CSS** (via CDN configuration) + Custom Design System (`assets/css/style.css`)
- **Vanilla JavaScript (ES6+)** — Modular, zero-framework architecture (`assets/js/*.js`)
- **Bootstrap Icons 1.11** (`https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`)
- **Google Fonts** (`Fraunces` editorial serif, `Plus Jakarta Sans` UI body, `Caveat` handwritten Polaroid script)
- **Browser LocalStorage** — Complete client-side persistence & real-time synchronization between public booking flows, Customer Portal, and Admin Portal

---

## 2. Complete Page Directory (29 Pages)

```text
photo-booth-rental/
├── index.html                  # Home Page 1 – Nostalgic Photo Booth Landing Page
├── index-dashboard.html        # Home Page 2 – Modern Event Booking Platform
├── about.html                  # About Us (Brand story, timeline, team, approach)
├── booths.html                 # Photo Booth Styles Catalog (All 12 Booth Styles + filters)
├── booth-details.html          # Individual Booth Details Showcase (?id= dynamic switcher)
├── packages.html               # Packages & Pricing (12 packages across 4 event categories)
├── backdrops.html              # Backdrops (10) & Add-ons (12) Live Customizer
├── events.html                 # Events We Serve (14 celebration categories)
├── booking.html                # 7-Step Interactive Frontend Booking Studio
├── gallery.html                # Masonry Event Gallery (10 categories + Keyboard Lightbox)
├── reviews.html                # Verified Sample & Demo Customer Reviews + Submission Form
├── blog.html                   # Event Planning & Photography Blog Listing (8 categories)
├── blog-details.html           # Single Blog Article with TOC, Share & LocalStorage Comments
├── contact.html                # Contact Us, Service Areas, FAQ & Quote Form
├── login.html                  # Customer & Admin Login (with 1-Click Demo Credentials)
├── register.html               # Customer Account Registration
├── 404.html                    # Nostalgic 404 Error Page
├── coming-soon.html            # Coming Soon / Launch Page with Live JS Countdown
├── customer/
│   ├── dashboard.html          # Customer Dashboard Overview & Upcoming Event Card
│   ├── bookings.html           # My Bookings (Search, filter, sort, edit, cancel)
│   ├── booking-details.html    # 5-Stage Reservation Status Tracker & Invoice Sheet
│   ├── favorites.html          # Saved Photo Booths & Packages
│   └── profile.html            # Customer Profile, Event Preferences & Password Update
├── admin/
│   ├── dashboard.html          # Admin Executive Dashboard (9 KPIs, 4 Charts, Tables)
│   ├── bookings.html           # Admin Booking Management (Status updates, Coordinator, CSV Export)
│   ├── booths.html             # Admin Booth Inventory CRUD (Syncs with public booths.html)
│   ├── packages.html           # Admin Package CRUD (Syncs with public packages.html)
│   ├── customers.html          # Admin Customer Directory, History & Spending
│   ├── reports.html            # Analytics, Backdrops, Add-ons, Reviews & Inquiries
│   └── settings.html           # Platform Configuration & Factory Demo Data Reset
└── assets/
    ├── css/
    │   └── style.css           # Custom variables, Polaroid frames, Dark Mode, RTL support
    └── js/
        ├── storage.js          # Single source of truth for LocalStorage seed data & CRUD
        ├── auth.js             # Demo authentication, registration & route protection
        ├── main.js             # Shared Navbar, Footer, Theme/RTL toggles, Availability Modal
        ├── booking.js          # 7-step booking wizard & dynamic pricing calculator
        ├── gallery.js          # Masonry filtering, search & keyboard-operable lightbox
        ├── customer-dashboard.js
        └── admin-dashboard.js
```

---

## 3. Demo Login Credentials

> **Important Security Note:** Authentication, bookings, and pricing in this template are **frontend demonstrations powered by browser `LocalStorage`**. `LocalStorage` is local to the user's browser and is not a shared server database or production authentication mechanism. Production deployments require a backend server, database, and secure server-side password hashing.

| Portal Role | Email Address | Password | Redirect Target |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@photobooth.com` | `Admin@123` | `admin/dashboard.html` |
| **Demo Customer 1** | `claire@example.com` | `Customer@123` | `customer/dashboard.html` |
| **Demo Customer 2** | `liam@horizonmedia.io` | `Customer@123` | `customer/dashboard.html` |
| **Demo Customer 3** | `maya.lin@example.com` | `Customer@123` | `customer/dashboard.html` |

You can also register any new customer account on `register.html` or use the **1-Click Demo Fill** buttons on `login.html`.

---

## 4. Key Interactive Features

1. **12 Distinct Photo Booth Styles**: Vintage Enclosed, Open-Air, Glam Booth, 360° Video Booth, Retro Caravan, Mirror Booth, Digital Selfie, Roaming Booth, Wedding Booth, Corporate Booth, GIF & Boomerang, and Premium Studio Booth.
2. **12 Event-Specific Packages**: Organized across Wedding, Birthday, Corporate, and Private Party tiers with Weekday vs. Peak Weekend pricing toggle and mobile-friendly comparison table.
3. **10 Backdrops & 12 Add-Ons**: Interactive live calculator on `backdrops.html` and inside Step 4 of `booking.html`.
4. **7-Step Booking Engine (`booking.html`)**: Full validation, past-date prevention, live running total sidebar, duplicate submission guard, unique reference generator (`FB-2026-XXXX`), and instant synchronization with Customer and Admin dashboards.
5. **5-Stage Booking Status Tracker (`customer/booking-details.html`)**: Tracks reservations across `Booking Requested (Pending) → Under Review → Confirmed → Event Preparation → Event Completed` (plus `Cancelled`).
6. **Dark Mode & RTL Support**: Instant toggle in the header of every public and dashboard page, persisted in `LocalStorage`.
7. **Admin CSV Export & Demo Reset**: Export booking records to `.csv` in `admin/bookings.html` or restore factory default seed data anytime in `admin/settings.html`.
