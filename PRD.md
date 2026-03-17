# PRD — Jammi Pharmaceuticals Website
Version: 1.0
Stack: Next.js (migrated from React + Vite)
Brand Color: #FDF9F0 (warm cream — NO green anywhere)

1. What Is This Website?
Jammi Pharmaceuticals is a 127-year-old Ayurvedic pharmaceutical company blending traditional Indian medicine with modern molecular science. The website serves as:
- A digital storefront for Ayurvedic products (e-commerce/pharmacy page)
- A patient-facing consultation platform (book appointments online or offline)
- A brand identity hub showcasing founders, company history, and science-backed Ayurveda
- A knowledge gateway powered by an AI chatbot (Charak) trained on Ayurvedic knowledge and the full product catalog
- A partner intake portal with admin approval workflow

2. What the Website IS
| Area | Description |
| --- | --- |
| Homepage | Brand story, Indian doctor imagery, warm cream (#FDF9F0) palette, Charak chatbot, "Know More" CTA |
| Pharmacy / E-Commerce | Product catalog with real product images, bundle suggestions, cart, checkout |
| Book Consultation | Online (calendar slots Mon–Sat 9am–6pm, payment, shareable confirmation) + Offline (direct WhatsApp) |
| Founders Page | Dr. Narasimham Jammi + Dr. Anitha Balachander profiles with LinkedIn links |
| Admin Panel | Hidden login via footer logo tap → full CMS, order mgmt, inventory, marketing tools |
| Charak Chatbot | AI chatbot on homepage; answers Ayurveda + product questions, recommends products with images |
| Partner With Us | Form-only intake page; submissions go to admin panel as requests |

3. What the Website Is NOT
- ❌ NOT a general healthcare portal (No diagnosis, no prescription generation, no medical records)
- ❌ NOT a telemedicine platform (Consultation booking only; video call is external)
- ❌ NOT a marketplace (Only Jammi Pharmaceuticals products; no third-party sellers)
- ❌ NOT a blog/content platform (No user-generated posts; only admin-controlled content)
- ❌ NOT a subscription service (No recurring billing or memberships)
- ❌ NOT an allopathic/generic pharma site (Strictly Ayurvedic; no competing medicine systems featured)
- ❌ NOT a B2B wholesale portal (Partner With Us is intake only, not a wholesale ordering system)
- ❌ NOT green-themed (No green color anywhere in the UI)
- ❌ NOT US-centric (All imagery, doctor photos, and cultural references must be Indian)

4. Target Users
- Patients / Customers — looking for Ayurvedic remedies, booking consultations
- Curious visitors — learning about Ayurveda, company history
- Partners — clinics, distributors submitting partnership requests
- Admin (internal) — managing products, orders, content, appointments

5. Core Pages
5.1 Homepage
- Color: #FDF9F0 throughout; no green
- Two Indian doctor images (replace US-looking images)
- Charak chatbot button ("Know More") fixed on screen
- Hero section, about section, product highlights, testimonials

5.2 Pharmacy / E-Commerce Page
- Real product images from /public/images
- Mahanarayana Tailam UI: white footer (not green), 3–4 angle images per product
- Bundle suggestions: products in same health category shown together in cart with 2–3% discount
- Admin can: add/remove/edit products, set prices, apply offers, mark stock status

5.3 Book Consultation
- Online: Date/time picker (Mon–Sat, 9am–6pm slots), payment gateway, shareable confirmation page (screenshot-friendly for WhatsApp)
- Offline: "Chat on WhatsApp" button → opens https://wa.me/919043020764
- Remove "Partner With Us" button from this page

5.4 Founders Page (NEW)
- Dr. Narasimham Jammi — full bio, LinkedIn: https://www.linkedin.com/in/narasimham-jammi/
- Dr. Anitha Balachander — full bio, LinkedIn: https://www.linkedin.com/in/anitha-balachander-2ab7132/
- Warm, editorial design; Indian aesthetic

5.5 Partner With Us Page
- Simple form (name, company, email, phone, message)
- On submit → request appears in Admin Panel
- No "Partner With Us" nav button linking out elsewhere

5.6 Admin Panel (Hidden)
- Access: Tap footer logo → modal → JammiPharma / Jammi@1234Jam
- Sections: Homepage content editor, hyperlink manager, product catalog, order management, inventory, customer data, sales reports, marketing/promotions, partner requests, order details view
- Credentials changeable from within admin panel

5.7 Charak Chatbot
- Floating button on homepage labeled "Know More"
- Named "Charak"
- Knowledge base: entire website content + full Ayurvedic knowledge + all product details
- If user describes symptoms → Charak suggests relevant products with image + buy link

6. Key UX Rules
- No green anywhere (existing green replaced with cream/gold/earth tones)
- All imagery: Indian context (doctors, patients, lifestyle)
- Product pages: minimum 3 image angles per product
- Bundle discount: 2–3% off when buying related products together
- Appointment confirmation: full-page shareable card (WhatsApp-friendly)
- Admin panel: accessible only via hidden footer logo interaction