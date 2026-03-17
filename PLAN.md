# Jammi Pharmaceuticals Website - Plan

## Phase 1: Foundation (Migration & Setup)
- Terminate the currently running Vite + React setup.
- Initialize Next.js (App Router).
- Install and configure Tailwind CSS.
- Configure brand colors: Primary background `#FDF9F0` (warm cream). Strictly remove any green from standard configs.
- Setup global layout, custom header, and custom footer (with hidden admin login hook).

## Phase 2: Core Pages Development
- **Homepage**: Develop Hero, Brand Story, Testimonials, and insert Indian doctor imagery. Add floating Charak chatbot button.
- **Founders Page**: Add biographies and LinkedIn links for Dr. Narasimham Jammi & Dr. Anitha Balachander.
- **Partner Intake**: Develop a form submission page that saves requests.
- **Consultation**: Configure the booking UI (Mon-Sat, 9am-6pm) and WhatsApp offline redirect.

## Phase 3: E-Commerce & Pharmacy
- **Product Catalog**: Scaffold products with real images (from `/public/images`). At least 3 angles per product.
- **Shopping Cart**: Implement state management for the cart.
- **Bundle Logic**: Calculate 2-3% discount for products in the same health category.

## Phase 4: Autonomous Features (Admin & Chatbot)
- **Hidden Admin Panel**: Access via footer logo tap. Requires login (`JammiPharma / Jammi@1234Jam`). Build basic CMS, Orders, and Partner request management.
- **Charak Chatbot**: Implement AI conversational UI, trained to recommend products and answer Ayurvedic questions.