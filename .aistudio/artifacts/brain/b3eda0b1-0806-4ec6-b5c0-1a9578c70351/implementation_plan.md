# Hotel Nordic Gate — Admin CMS Architecture & Implementation Plan

Dedicated Enterprise Content Management System (CMS) under `/admin` for **Hotel Nordic Gate**, delivering modular, accessible, strongly typed CRUD interfaces and reusable UI primitives while preserving 100% of the existing hotel website, booking engine, payment layer, authentication, and HMS operational system.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The admin CMS is designed as a presentation-only, strongly typed component architecture that exposes clean callback interfaces (`onCreate`, `onEdit`, `onDelete`, `onSubmit`, `onSearch`, `onPageChange`). This ensures zero friction when connecting to existing Redux Toolkit and RTK Query hooks later.
>
> **Confirmed Architecture Principles:**
> 1. **Zero Impact on Existing Features:** The public site (`/`, `/rooms`, `/booking`, `/dining`, `/bar`, `/spa`), guest portal (`/guest`), and hotel management system (`/app`) remain untouched.
> 2. **Dedicated Workspace Shell:** The admin panel runs under `/admin` with its own layout (collapsible deep navy sidebar, breadcrumbs, search, alerts, user profile) and bypasses the public navigation and footer chrome.
> 3. **Design System & Palette:** Adheres strictly to the brand palette:
>    * Deep Navy: `#0D1A26` (Sidebar, structural headers, active states)
>    * Midnight: `#02070D` (Elevated cards, backdrop scrims)
>    * Champagne Gold: `#F2C777` (Accents, focus rings, badges)
>    * Antique Gold: `#BF8641` (Primary CTAs, active highlights)
>    * Dark Gold: `#8C5F27` (Hover states)
>    * Warm Ivory: `#F8F5EF` (Content canvas background)
>    * Warm Sand: `#EDE7DC` (Card surfaces, subtle borders)
>    * Single primary font family: **Plus Jakarta Sans**

---

## 1. Admin Panel Layout Specification

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP HEADER (Sticky, h-16, bg-white/95 border-b border-[#EDE7DC])                      │
│ [Collapse Toggle]  [Breadcrumbs: Admin > Content > FAQs]    [Search...] [Alerts] [User] │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR (w-64 / w-20)    │ MAIN WORKSPACE CANVAS (bg-[#F8F5EF] p-6 lg:p-8)             │
│                          │                                                             │
│ Hotel Nordic Gate        │ ┌─────────────────────────────────────────────────────────┐ │
│ CMS · Portal Admin       │ │ PageHeader (Title, Description, Primary Action Button)   │ │
│                          │ └─────────────────────────────────────────────────────────┘ │
│ OVERVIEW                 │ ┌─────────────────────────────────────────────────────────┐ │
│ • Dashboard              │ │ TableToolbar (Search, Category Filters, Density, Export)│ │
│                          │ ├─────────────────────────────────────────────────────────┤ │
│ WEBSITE CONTENT          │ │ AdminDataTable (Sortable headers, row actions, status)  │ │
│ • Rooms & Suites         │ │ - Item 1 ... [Edit] [Delete]                            │ │
│ • FAQs                   │ │ - Item 2 ... [Edit] [Delete]                            │ │
│ • Testimonials           │ ├─────────────────────────────────────────────────────────┤ │
│ • Facilities & Amenities │ │ Pagination (Showing 1-10 of 48 items, page buttons)     │ │
│ • Restaurant & Dining    │ └─────────────────────────────────────────────────────────┘ │
│ • Bar & Drinks           │                                                             │
│ • Offers & Packages      │ [Slide-Over FormDrawer / Modal for Create & Edit Workflows] │
│ • Gallery & Media        │ [ConfirmationDialog for Delete & Status Changes]            │
│ • Policies & Info        │                                                             │
│                          │                                                             │
│ ADMINISTRATION           │                                                             │
│ • Website Settings       │                                                             │
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

### Key Layout Features:
1. **Collapsible Deep Navy Sidebar (`AdminSidebar`):**
   * Two states: Expanded ($256\text{px}$) with labels and section groups; Compact ($80\text{px}$) icon-rail with tooltips for maximum workspace productivity.
   * Mobile responsive slide-over drawer with backdrop overlay and swipe/close touch gesture ($< 1024\text{px}$).
   * Keyboard accessible with full `Tab`, `ArrowDown/Up`, and `Escape` support.
2. **Top Header Bar (`AdminHeader`):**
   * Dynamic breadcrumbs (`AdminBreadcrumbs`) indicating module nesting.
   * Global quick-jump search input (`Ctrl+K` / `Cmd+K` keyboard shortcut).
   * Notification center dropdown icon with badge.
   * User profile chip with authenticated staff role (`Astrid Lindqvist · Super Admin`) and quick link back to public site or HMS.
3. **Workspace Canvas (`AdminContentArea`):**
   * Padded responsive layout ($1440\text{px}$ baseline max-width with fluid downscaling).
   * Visual hierarchy: `AdminPageHeader` $\to$ `TableToolbar` $\to$ `AdminDataTable` $\to$ `Pagination`.
   * Floating slide-over `FormDrawer` or `Modal` for non-intrusive creation and editing without losing table context.

---

## 2. Navigation Organization & Module Taxonomy

```
• Overview
  └── Dashboard (/admin)
      - Content freshness metrics, published item counters, quick actions

• Website Content
  ├── Homepage Content (/admin/homepage)
  │   - Hero slides, highlights strip, feature teasers
  ├── Rooms & Suites (/admin/rooms)
  │   - 5 reference categories, beds, dimensions, amenities, images, pricing display
  ├── FAQs (/admin/faqs)
  │   - Bilingual Q&A, categories (Booking, Check-in, Facilities, Dining, Transport)
  ├── Testimonials (/admin/testimonials)
  │   - Guest reviews, ratings, verified stay dates, room tags
  ├── Facilities & Amenities (/admin/facilities)
  │   - Pool, sauna, dining, parking, pet policies, Wi-Fi
  ├── Restaurant & Dining (/admin/dining)
  │   - Breakfast buffet items, evening bistro dishes, dietary tags, prices
  ├── Bar & Drinks (/admin/bar)
  │   - Cocktails, wines, craft beers, spirits, mocktails, bar snacks
  ├── Spa & Wellness (/admin/spa)
  │   - Pool hours, sauna rituals, hot tub details, wellness guidelines
  ├── Offers & Packages (/admin/offers)
  │   - Seasonal deals, stay & dine, weekend specials
  ├── Gallery & Media (/admin/media)
  │   - Asset browser, alt tags, dimensions, upload simulation
  ├── About Hotel (/admin/about)
  │   - Heritage narrative, Gothenburg story, architectural highlights
  ├── Contact & Hotel Information (/admin/contact)
  │   - Address, coordinates, transport details, reception phone & email
  └── Hotel Policies (/admin/policies)
      - Check-in/out hours, age limits, cancellation, pet policies

• Administration
  └── Website Settings (/admin/settings)
      - General metadata, multilingual defaults (SV/EN), SEO defaults
```

---

## 3. Reusable Component Architecture

The component library is divided into two distinct, strongly typed layers:

### A. Core UI Primitives (`src/components/ui/`)
Self-contained, framework-agnostic design system primitives with zero admin business logic:
* `Button`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner state, icon slots.
* `TextField` & `Textarea`: Accessible labels, helper text, inline icons, error message states, character count.
* `Select`: Native and custom dropdown with accessible keyboard navigation.
* `Checkbox`, `Switch`, `RadioGroup`: Semantic form controls with focus rings and descriptions.
* `FormField` & `FormSection`: Layout wrappers enforcing uniform spacing and visual hierarchy.
* `Modal` & `ConfirmationDialog`: Accessible portal dialogs with focus trapping, backdrop blur, and destructive action styling.
* `Drawer`: Slide-over panel from right with smooth transition (`motion` or CSS).
* `StatusBadge`: Clean, unboxed or subtle rounded status indicators (`Published`, `Draft`, `Archived`).
* `Tabs`: Accessible tab navigation with keyboard arrows.
* `LoadingSkeleton`: Shimmering placeholder blocks for tables, text, and cards.
* `EmptyState`: Empty illustration/icon, title, explanation, and action button.
* `ErrorState`: Error banner with retry callback.
* `Toast`: Temporary feedback notifications (`success`, `error`, `info`).

### B. Shared Admin Pattern Components (`src/components/admin/`)
Enterprise CMS components composed of the UI primitives:
* `AdminSidebar`: Multi-level collapsible menu with active route highlighting.
* `AdminHeader`: Top application bar with breadcrumbs, quick search, and profile menu.
* `AdminPageHeader`: Standardized title, description, badge, and primary action bar.
* `AdminBreadcrumbs`: Hierarchical trail with click handlers.
* `AdminDataTable<T>`: Generic, strongly typed data table with:
  - Column definitions (`key`, `header`, `render`, `sortable`, `width`)
  - Row selection checkbox support
  - Inline action buttons (`Edit`, `Delete`, `Duplicate`, `Preview`)
* `TableToolbar`: Search input, category filter dropdowns, status filter pills, clear filters button.
* `Pagination`: Page index, page size selector ($10, 25, 50$), total item count, next/previous buttons.
* `FormDrawer`: Right-side flyout for editing/creating content without leaving table view.
* `DeleteConfirmation`: Specialized modal with resource title verification before deletion.
* `LocaleTabs`: Tab switcher for bilingual editing (**Svenska** / **English**).

---

## 4. Recommended Folder Structure

```
src/
├── components/
│   ├── ui/                          # Core reusable design primitives
│   │   ├── Button.tsx
│   │   ├── TextField.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Switch.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Tabs.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── Toast.tsx
│   ├── admin/                       # Shared Admin CMS layout & table components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── AdminPageHeader.tsx
│   │   ├── AdminBreadcrumbs.tsx
│   │   ├── AdminDataTable.tsx
│   │   ├── TableToolbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── FormDrawer.tsx
│   │   ├── LocaleTabs.tsx
│   │   └── DeleteConfirmation.tsx
│   ├── booking/                     # Existing booking components (untouched)
│   ├── layout/                      # Existing public Navbar & Footer (untouched)
│   └── property/                    # Existing property cards (untouched)
├── features/
│   └── admin/                       # Module-specific forms & CRUD views
│       ├── dashboard/
│       │   └── AdminDashboardView.tsx
│       ├── faqs/
│       │   ├── FaqListView.tsx
│       │   ├── FaqForm.tsx
│       │   └── faqTypes.ts
│       ├── rooms/
│       │   ├── RoomListView.tsx
│       │   ├── RoomForm.tsx
│       │   └── roomAdminTypes.ts
│       ├── dining/
│       │   ├── DiningAdminView.tsx
│       │   └── DiningItemForm.tsx
│       └── testimonials/
│           ├── TestimonialListView.tsx
│           └── TestimonialForm.tsx
├── context/
│   └── HotelContext.tsx             # Routes updated to mount /admin routes
├── data/                            # Realistic local mock data stores for demo CRUD
│   ├── adminFaqData.ts
│   └── ...
└── types/                           # Strongly typed domain models
```

---

## 5. Phased Implementation Roadmap

### Phase 1: Layout, Shell & Route Wiring
* Wire `/admin` and sub-routes in `src/App.tsx` and `HotelContext.tsx`.
* Construct `AdminLayout`, `AdminSidebar`, `AdminHeader`, `AdminBreadcrumbs`.
* Build responsive collapsible toggle (desktop 256px / 80px, mobile slide-over drawer).
* Verify zero regression on existing public site, login, and `/app` HMS dashboard.

### Phase 2: Core UI Primitives & Generic Data Table
* Implement core components in `src/components/ui/` (`Button`, `TextField`, `Select`, `Modal`, `Drawer`, `StatusBadge`).
* Build `AdminDataTable<T>`, `TableToolbar`, and `Pagination` with sorting, filtering, and empty/loading states.

### Phase 3: Reference CRUD Implementation — FAQ Management
* Complete feature-rich FAQ CRUD screen (`FaqListView`, `FaqForm`, `DeleteConfirmation`).
* Bilingual editing in Swedish and English (`LocaleTabs`).
* Category filtering (`Bokning`, `Incheckning`, `Faciliteter`, `Restaurang`).
* Typed callback actions (`onCreate`, `onEdit`, `onDelete`, `onSearch`).

### Phase 4: Expansion to Core Modules
* Rooms & Suites management with image preview, amenities checklist, and display pricing.
* Dining & Bar content management with dish/drink categories and pricing.
* Testimonials management with star ratings and verified stay attributes.

### Phase 5: Verification & Polish
* Verify desktop ($1440\text{px}$), tablet ($768\text{px}$), and mobile ($390\text{px}$) viewports.
* Confirm keyboard accessibility, focus rings, and zero broken links.
* Run automated test suites to ensure 100% logic integrity.
