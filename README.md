# EVENTO — Smart Multi-Vendor Event Planning & Booking Platform
**The Next-Generation "Managed Event Operating System" for Bangladesh**

---

## 🌟 Overview & Mission

**EVENTO** is a next-generation multi-vendor event planning platform designed to simplify the complete event booking lifecycle. Instead of contacting multiple vendors individually, haggling over prices, or managing disjointed contracts, customers can plan, customize, estimate, and book their entire event through a **single centralized platform**.

### What is the "Managed Event OS" Model?
Unlike traditional marketplace directories where customers are exposed to individual vendor contact details, ratings, and unverified pricing:
- 🔒 **Zero Customer Exposure:** Customers never see individual vendor names, ratings, or payout rates. All interactions are exclusively with **EVENTO Services, Curated Packages, and Service Tiers**.
- 🛡️ **Centralized Admin Dispatch:** The EVENTO Admin Coordinator evaluates customer requirements and assigns pre-vetted, high-performance background vendor teams behind the scenes.
- 🤝 **Protected Vendor Execution:** Vendors receive technical event specifications, venue addresses, and coordinator instructions without ever accessing customer phone numbers, emails, or total budget figures.

---

## 🚀 Key Platform Features

### 1. Flagship 4-Step Smart Event Calculator (`/calculator`)
- **Step 1: Zone & Event Type Selector:**
  - Dynamic pricing across all **7 Bangladesh Event Zones** (`Dhaka Metro - 1.00x Base`, `Chattogram Region - 1.10x Base`, `Sylhet Region - 1.15x Base`, `Rajshahi District - 0.95x Base`, `Khulna Metro - 0.95x Base`, `Rangpur Division - 0.90x Base`, `Barishal Coastal Area - 0.90x Base`).
  - Supports Weddings, Receptions, Gaye Holud, Birthday Parties, Corporate Summits, Seminars, Picnics, and Anniversaries.
- **Step 2: Interactive Service Grid (16 Service Categories):**
  - Toggle specialized event services: *Photography, Videography, Catering, Decoration, Stage, Lighting, Sound System, Tent/Pandal, Generator, Transportation, Security, Cake, Makeup, DJ, Live Streaming, Invitation Cards*.
- **Step 3: Dynamic Service Configurator:**
  - Configure `Basic`, `Premium`, or `Luxury` tiers for selected services.
  - Automatic scaling for guest-dependent items (e.g., Catering per-plate multiplication) and duration-based coverage.
- **Step 4: Real-Time BDT (`৳`) Live Budget Sidebar & Summary Modal:**
  - Sticky desktop sidebar and mobile drawer showing an itemized BDT cost breakdown, VAT, and advance payment requirements.

---

### 2. The 3-Sided Managed Ecosystem

```
+-----------------------------------------------------------------------------------+
|                        1. CUSTOMER EXPERIENCE (Frontend)                          |
|  • /calculator  → 4-Step Wizard with 7 Bangladesh Zones & Live Budget Estimator  |
|  • /packages    → Pre-configured Wedding/Reception packages with custom Add-ons   |
|  • /dashboard/bookings & /my-events → Tracking milestones (No vendor names shown) |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     2. ADMIN OPERATIONS CENTER (Dispatcher)                       |
|  • /dashboard/vendors  → Assigns pre-vetted vendor teams to customer bookings     |
|  • /dashboard/settings → Manages 7 Bangladesh zone multipliers & commission rules |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                      3. BACKGROUND VENDOR PORTAL (Execution)                      |
|  • /dashboard/tasks    → Views technical specs & venue (Zero customer exposure)   |
|  • /dashboard/earnings → Tracks protected escrow payouts in BDT (৳)               |
+-----------------------------------------------------------------------------------+
```

- **Customer Portal (`/dashboard/bookings`, `/dashboard/my-events`):**
  - Track booking progression stages (`Confirmed → Operational Dispatch → Execution → Completed`).
  - **Platform Review System:** Customers review and rate the **EVENTO Platform** (overall experience, calculation accuracy, support quality), not individual vendors.
- **Admin Operations Center (`/dashboard/vendors`, `/dashboard/settings`):**
  - Assign vetted background vendor teams (*Dhaka Royal Photography Studio*, *Grand Kacchi Caterers*, etc.) to customer bookings with specific coordinator instructions.
  - Manage zone multipliers, VAT, and automated customer milestone notifications.
- **Background Vendor Portal (`/dashboard/tasks`, `/dashboard/earnings`):**
  - **Zero Customer Leakage Task Board:** Vendors inspect venue addresses, coverage hours, and technical deliverables. Direct customer contact info is locked.
  - **Partner Payout Ledger:** Track cleared disbursements and pending escrow payouts in Bangladeshi Taka (**BDT `৳`**).

---

### 3. 1-Click Role-Segregated Demo Access (`/login`)
Test any of the three role portals instantly without typing credentials:
- 🧑‍💼 **Demo Customer Booking Portal** (`customer@evento.bd`) → Directs to `/dashboard/bookings`
- 🛡️ **Demo Admin Dispatcher Hub** (`admin@evento.bd`) → Directs to `/dashboard/vendors`
- 🤝 **Demo Vendor Task Workspace** (`partner@evento.bd`) → Directs to `/dashboard/tasks`

---

## 🛠️ Technology Stack & Architecture

### Frontend Application
- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- **Language:** TypeScript (`.tsx`, `.ts`)
- **State Management:** Redux Toolkit (`authSlice`, `calculatorSlice`)
- **Styling & UI:** Vanilla CSS & Tailwind CSS, Lucide Icons, Framer Motion
- **Form & Validation:** React Hook Form, Yup Validation, Sonner Notifications

### Backend API (`/backend`)
- **Runtime:** Node.js & Express.js REST API (`http://localhost:5000/api`)
- **Database:** MongoDB Atlas with Mongoose ORM
- **Security & Validation:** JSON Web Tokens (JWT) Role-based Auth, Zod Schema Validation, Helmet, CORS, Morgan Logging

---

## 💻 Getting Started & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A MongoDB Atlas connection string (or local MongoDB instance)

### 2. Clone & Install Frontend Dependencies
```bash
git clone https://github.com/your-username/ZEYO-EVENTO.git
cd ZEYO
npm install
```

### 3. Environment Variables
Check `.env` and `example.env` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the homepage, calculator, and portals.

### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Role Security & License

- **Managed Event OS Protocol:** All vendor assignments and pricing calculations adhere to strict role-segregated privacy guidelines.
- **Copyright:** © 2026 EVENTO Bangladesh. All rights reserved.
