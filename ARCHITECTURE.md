# Architecture - Jammi Pharmaceuticals Website

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (Strictly no green, Base: #FDF9F0)
- **Icons**: Lucide React
- **State Management**: React Context / Zustand (for cart, chatbot state, auth state)

## Core Structure
- **`/app`**: Next.js App Router root
  - `/(public)`: All customer-facing pages
    - `/page.tsx` (Homepage)
    - `/pharmacy/page.tsx` (Shop/E-Commerce)
    - `/consultation/page.tsx` (Booking)
    - `/founders/page.tsx` (Founders Info)
    - `/partner/page.tsx` (Partner Intake)
  - `/(admin)`: Admin Panel
    - `/admin/page.tsx` (Dashboard)
  - `/api`: Next.js intermediate API routes for chatbot, mock database, orders.
- **`/components`**: Reusable UI parts
  - `/ui`: Buttons, Inputs, Cards
  - `/layout`: Header, Footer, Chatbot UI
  - `/shop`: Product Card, Cart Slideover, Bundle Suggestions
  - `/admin`: Sidebar, Data Tables

## State & Data
Since we are building the frontend first, we will heavily rely on mock data or a local JSON store for the Admin to mutate data (or local storage for persistence across reloads during dev).
- **Products**: Loaded from local constants/json, mapping to `/public/images`.
- **Cart**: LocalStorage + Context. Includes logic for 2-3% bundle discounts based on categories.
- **Admin**: Protected via simple React Context login `Jammi@1234Jam`.

## Chatbot (Charak)
- A context-aware chatbot interface that matches user input against a predefined list of Ayurvedic intents and product recommendations. 
- Integrated on all public pages via a generic floating button.