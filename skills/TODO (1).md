# Antigravity E-Commerce Platform — Firebase Migration & Performance TODO

> **Instructions for AI Agent**: Work through each task sequentially. Complete and verify each task before moving to the next. Mark each task `[x]` when done. Never skip a task.

---

## PHASE 0 — Project Audit & Setup

### Task 0.1 — Audit Existing Codebase
- [ ] List all frontend pages: Shop, Product Detail, Cart, Checkout, Admin (Products, Categories, Orders, Customers, Payments, Coupons, Shipping, Reviews, Reports, Bundles)
- [ ] Identify all existing data fetching methods (REST, mock data, localStorage, etc.)
- [ ] List all Razorpay integration points
- [ ] Document current routing setup (Next.js/React Router/etc.)
- [ ] Note which pages have confirmed slow load issues post-deployment

### Task 0.2 — Install Firebase SDK & Dependencies
```bash
npm install firebase
npm install firebase-admin        # for server-side/API routes
npm install react-hot-toast       # for real-time feedback UI
npm install @tanstack/react-query # for client-side caching + data sync
```

### Task 0.3 — Firebase Project Setup
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable **Firestore** (Native mode, region: `asia-south1` for India)
- [ ] Enable **Firebase Storage** (for product images)
- [ ] Enable **Authentication** (Email/Password + Anonymous for guest reviews)
- [ ] Enable **Realtime Database** (optional for presence/live order tracking)
- [ ] Copy Firebase config to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Task 0.4 — Initialize Firebase Client
Create `/lib/firebase.ts`:
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = { /* from env */ };
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Enable offline persistence for instant loads
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch(console.error);
}
```

---

## PHASE 1 — Firestore Schema Design

### Task 1.1 — Define Firestore Collections
Create the following collections with exact field names:

```
/products/{productId}
  - id: string
  - name: string
  - description: string
  - price: number
  - originalPrice: number
  - discount: number           // percentage
  - images: string[]           // Firebase Storage URLs
  - categoryId: string
  - categoryName: string
  - stock: number
  - tags: string[]
  - averageRating: number      // auto-computed
  - reviewCount: number        // auto-computed
  - active: boolean
  - createdAt: Timestamp
  - updatedAt: Timestamp

/categories/{categoryId}
  - id: string
  - name: string
  - description: string
  - image: string
  - productCount: number
  - active: boolean
  - createdAt: Timestamp

/reviews/{reviewId}
  - productId: string
  - customerName: string
  - customerId: string          // anonymous or auth UID
  - rating: number              // 1-5
  - review: string
  - status: 'approved' | 'pending' | 'rejected'
  - helpful: number
  - createdAt: Timestamp

/orders/{orderId}
  - orderId: string             // Razorpay order ID
  - razorpayPaymentId: string
  - customerName: string
  - customerEmail: string
  - customerPhone: string
  - shippingAddress: object
  - items: array[{productId, name, quantity, price, image}]
  - subtotal: number
  - discount: number
  - total: number
  - couponCode: string
  - paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  - orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  - createdAt: Timestamp

/customers/{customerId}
  - name: string
  - email: string
  - phone: string
  - totalOrders: number
  - totalSpent: number
  - status: 'active' | 'blocked'
  - joinedAt: Timestamp

/payments/{paymentId}
  - transactionId: string       // Razorpay payment ID
  - customerId: string
  - customerName: string
  - orderId: string
  - amount: number
  - method: string              // card, upi, netbanking
  - status: 'success' | 'failed' | 'refunded'
  - createdAt: Timestamp

/coupons/{couponId}
  - code: string                // uppercase, e.g. SAVE10
  - type: 'percentage' | 'fixed'
  - value: number
  - minOrderValue: number
  - maxUses: number
  - usedCount: number
  - expiresAt: Timestamp
  - active: boolean

/shipping/{shipmentId}
  - orderId: string
  - customerName: string
  - address: object
  - courierName: string
  - trackingId: string
  - status: 'pending' | 'picked' | 'in_transit' | 'delivered'
  - updatedAt: Timestamp

/bundles/{bundleId}
  - name: string
  - productIds: string[]        // exactly 3 products
  - discountPercent: number     // e.g. 5
  - active: boolean
  - createdAt: Timestamp
```

### Task 1.2 — Create Firestore Security Rules
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: public read, admin write only
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    // Categories: public read
    match /categories/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    // Reviews: public read, authenticated write (with rate limit)
    match /reviews/{id} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null;
      allow update, delete: if request.auth.token.admin == true;
    }
    // Orders: user can read own, admin reads all
    match /orders/{id} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.customerId || request.auth.token.admin == true);
      allow create: if true; // created server-side after payment
      allow update: if request.auth.token.admin == true;
    }
    // Admin-only collections
    match /customers/{id} { allow read, write: if request.auth.token.admin == true; }
    match /payments/{id} { allow read, write: if request.auth.token.admin == true; }
    match /coupons/{id} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    match /shipping/{id} { allow read, write: if request.auth.token.admin == true; }
    match /bundles/{id} { allow read: if true; allow write: if request.auth.token.admin == true; }
  }
}
```

### Task 1.3 — Create Firestore Composite Indexes
In Firebase Console → Firestore → Indexes, add:
- `products` — `categoryId ASC, active ASC, createdAt DESC`
- `products` — `active ASC, price ASC`
- `reviews` — `productId ASC, status ASC, createdAt DESC`
- `orders` — `customerId ASC, createdAt DESC`
- `orders` — `orderStatus ASC, createdAt DESC`
- `payments` — `customerId ASC, createdAt DESC`

---

## PHASE 2 — Seed Firebase with All Products

### Task 2.1 — Create Product Seed Script
Create `/scripts/seedProducts.ts`:
```typescript
import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const products = [
  // ADD ALL YOUR EXISTING PRODUCTS HERE
  // Copy from your current mock data / JSON / database dump
  {
    id: 'prod_001',
    name: 'Product Name',
    price: 999,
    // ... all fields from schema
  }
];

async function seed() {
  for (const product of products) {
    await setDoc(doc(db, 'products', product.id), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true,
      averageRating: 0,
      reviewCount: 0,
    });
    console.log(`Seeded: ${product.name}`);
  }
  console.log('All products seeded!');
}

seed();
```

### Task 2.2 — Run Seed Script
```bash
npx ts-node scripts/seedProducts.ts
```
Verify in Firebase Console that all products appear in the `products` collection.

### Task 2.3 — Upload Product Images to Firebase Storage
- [ ] Upload all product images to Firebase Storage under `/products/{productId}/`
- [ ] Update each product document's `images` field with the public download URLs
- [ ] Enable Storage CDN caching: Set Cache-Control header to `public, max-age=31536000`

---

## PHASE 3 — Product Page Performance

### Task 3.1 — Create Firebase Data Hooks
Create `/hooks/useProducts.ts`:
```typescript
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';

// Real-time all products (for shop page)
export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'products'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }

    // onSnapshot = real-time listener, fires immediately from IndexedDB cache
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub; // cleanup
  }, [categoryId]);

  return { products, loading };
}

// Single product
export function useProduct(productId: string) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'products', productId), (snap) => {
      setProduct(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return unsub;
  }, [productId]);

  return { product, loading };
}
```

### Task 3.2 — Update Shop Page to Use Firebase Hook
Replace all existing data-fetching in `pages/shop.tsx` (or equivalent):
```typescript
import { useProducts } from '../hooks/useProducts';

export default function ShopPage() {
  const { products, loading } = useProducts();

  if (loading) return <ProductSkeleton count={12} />;  // skeleton, not spinner

  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### Task 3.3 — Update Product Detail Page
Replace all data-fetching in `pages/product/[id].tsx`:
```typescript
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';

export default function ProductPage({ params }) {
  const { product, loading } = useProduct(params.id);
  const { reviews } = useReviews(params.id);
  // ...
}
```

### Task 3.4 — Add Skeleton Loaders (Not Spinners)
Create `/components/ProductSkeleton.tsx` — animated grey placeholder cards that match the exact dimensions of the product card. This gives the perception of instant loading.

### Task 3.5 — Add Next.js Image Optimization (if using Next.js)
In `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```
Replace all `<img>` tags with `<Image>` from `next/image` with `priority` on above-fold images.

---

## PHASE 4 — Review System

### Task 4.1 — Create Reviews Hook
Create `/hooks/useReviews.ts`:
```typescript
export function useReviews(productId: string) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [productId]);

  return { reviews };
}
```

### Task 4.2 — Create Review Submission Component
Create `/components/ReviewForm.tsx`:
- Input: Customer Name (required), Star Rating (1–5, required), Review Text (required)
- POST button: disabled until all fields filled
- On submit: call `addDoc(collection(db, 'reviews'), { ...reviewData, status: 'pending', createdAt: serverTimestamp() })`
- Show success toast after submission
- Show "Your review is pending approval" message

### Task 4.3 — Create Review Display Component
Create `/components/ReviewSection.tsx`:
- Show average rating (e.g. ⭐ 4.3 / 5 based on 42 reviews)
- Show rating distribution bar chart (5★ 60%, 4★ 20%, etc.)
- Show top 3 reviews by helpful count first (like Amazon/Flipkart)
- Show "Load more reviews" button
- Customer name + first letter avatar (no profile image needed)

### Task 4.4 — Auto-Update averageRating on Review Approval
Create a Firestore Cloud Function (or API route) that triggers when a review's `status` is updated to `'approved'`:
- Recalculate average rating across all approved reviews for that product
- Update `products/{productId}.averageRating` and `reviewCount`

---

## PHASE 5 — Admin Panel — Products Section

### Task 5.1 — Admin Product List Page
- [ ] Fetch products using `onSnapshot` (real-time)
- [ ] Show: Image, Name, Price, Category, Stock, Status toggle, Edit/Delete buttons
- [ ] Implement search/filter by category, price range, stock status

### Task 5.2 — Add New Product Form
Fields: Name, Description, Price, Original Price, Discount %, Category (dropdown from /categories), Stock, Images (multi-upload), Tags, Active toggle

On Save:
```typescript
const imageUrls = await uploadImages(files); // upload to Firebase Storage
await addDoc(collection(db, 'products'), {
  ...formData,
  images: imageUrls,
  active: true,
  averageRating: 0,
  reviewCount: 0,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
// Shop page updates INSTANTLY via onSnapshot
```

### Task 5.3 — Edit Product
- [ ] Load product into form via `getDoc`
- [ ] On save: `updateDoc(doc(db, 'products', id), { ...changes, updatedAt: serverTimestamp() })`
- [ ] Price change → shop page updates in <2 seconds
- [ ] Photo change → upload new image → update URL → shop page updates immediately

### Task 5.4 — Delete Product
- [ ] Soft delete: set `active: false` (product disappears from shop, data preserved)
- [ ] Hard delete option for admins: `deleteDoc` + delete images from Storage

---

## PHASE 6 — Admin Panel — Categories Section

### Task 6.1 — Category List with Products
- [ ] Fetch all categories via `onSnapshot`
- [ ] For each category, show product count
- [ ] Expandable row showing product names in that category

### Task 6.2 — Create New Category
- [ ] Form: Name, Description, Image
- [ ] Auto-generate `categoryId` (slugified name)
- [ ] Save to `/categories/{categoryId}`

### Task 6.3 — Add Products to Category
- [ ] In category detail view, show a searchable product picker
- [ ] On adding product: update `products/{productId}.categoryId` and `categoryName`
- [ ] Category page in shop auto-updates via `onSnapshot`

---

## PHASE 7 — Admin Panel — Orders Section

### Task 7.1 — Real-Time Orders Feed
```typescript
const q = query(
  collection(db, 'orders'),
  orderBy('createdAt', 'desc'),
  limit(50)
);
onSnapshot(q, snap => setOrders(snap.docs.map(d => d.data())));
```

### Task 7.2 — Orders Table
Columns: Order ID, Customer Name, Date, Items (count), Total, Payment Status, Order Status, Actions

### Task 7.3 — Connect Razorpay Webhook to Firestore
Create `/api/razorpay-webhook.ts`:
```typescript
export default async function handler(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify signature
  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) return res.status(400).json({ error: 'Invalid signature' });

  // Update order in Firestore
  const q = query(collection(db, 'orders'), where('razorpayOrderId', '==', razorpay_order_id));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, {
      paymentStatus: 'paid',
      razorpayPaymentId: razorpay_payment_id,
    });

    // Create payment record
    await addDoc(collection(db, 'payments'), {
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      // ... other fields
      status: 'success',
      createdAt: serverTimestamp(),
    });
  }

  res.status(200).json({ ok: true });
}
```

### Task 7.4 — Pre-fill Order Data from Checkout Form
In checkout form, capture: customerName, customerEmail, customerPhone, shippingAddress. Before calling Razorpay, create the order doc in Firestore with `paymentStatus: 'pending'`.

---

## PHASE 8 — Admin Panel — Customers Section

### Task 8.1 — Customer Auto-Registration on First Order
In the checkout/order creation flow:
```typescript
// After order is placed, upsert customer record
await setDoc(doc(db, 'customers', customerEmail), {
  name: customerName,
  email: customerEmail,
  phone: customerPhone,
  totalOrders: increment(1),
  totalSpent: increment(orderTotal),
  status: 'active',
  joinedAt: serverTimestamp(),
}, { merge: true });
```

### Task 8.2 — Customers Table
Columns: Name, Email, Phone, Orders (count), Total Spent, Joined Date, Status (active/blocked), Actions (View Orders, Block)

---

## PHASE 9 — Admin Panel — Payments Section

### Task 9.1 — Real-Time Payments Feed
```typescript
const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(100));
onSnapshot(q, snap => setPayments(...));
```

### Task 9.2 — Payments Table
Columns: Transaction ID, Customer, Order ID, Amount, Method (UPI/Card/etc.), Date, Status, Actions (Refund)

---

## PHASE 10 — Admin Panel — Coupons Section

### Task 10.1 — Fix Coupons Slow Load
The slow load is likely due to no indexing. Add `active ASC, expiresAt DESC` index on `/coupons`.

### Task 10.2 — Coupon CRUD
- [ ] Create coupon: Code (auto-uppercase), Type (% or ₹), Value, Min Order, Max Uses, Expiry Date
- [ ] List coupons with real-time `onSnapshot`
- [ ] Toggle active/inactive
- [ ] Usage counter auto-increments when coupon is applied at checkout

### Task 10.3 — Apply Coupon at Checkout
```typescript
async function applyCoupon(code: string, orderTotal: number) {
  const snap = await getDocs(query(
    collection(db, 'coupons'),
    where('code', '==', code.toUpperCase()),
    where('active', '==', true)
  ));
  if (snap.empty) throw new Error('Invalid coupon');
  const coupon = snap.docs[0].data();
  if (coupon.usedCount >= coupon.maxUses) throw new Error('Coupon expired');
  if (orderTotal < coupon.minOrderValue) throw new Error(`Min order ₹${coupon.minOrderValue}`);
  // Return discount amount
  return coupon.type === 'percentage' ? orderTotal * coupon.value / 100 : coupon.value;
}
```

---

## PHASE 11 — Admin Panel — Shipping Section

### Task 11.1 — Shipping Records Auto-Created on Order
When order status changes to 'processing', create shipping record:
```typescript
await addDoc(collection(db, 'shipping'), {
  orderId,
  customerName,
  address: shippingAddress,
  courierName: '',
  trackingId: '',
  status: 'pending',
  updatedAt: serverTimestamp(),
});
```

### Task 11.2 — Shipping Table with Quick Actions
Columns: Order ID, Customer & Address, Courier Details, Status, Quick Actions (Update Courier, Mark Delivered)
- Inline edit for courier name and tracking ID
- Status dropdown: pending → picked → in_transit → delivered

---

## PHASE 12 — Admin Panel — Reviews Moderation

### Task 12.1 — Reviews Table
Columns: Product, Customer, Rating, Review Text, Date, Status (pending/approved/rejected), Actions (Approve, Reject, Delete)

### Task 12.2 — Real-Time Reviews Feed
```typescript
const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
onSnapshot(q, snap => setReviews(...));
```

### Task 12.3 — Approve/Reject Reviews
```typescript
await updateDoc(doc(db, 'reviews', reviewId), { status: 'approved' });
// Cloud Function auto-updates averageRating on product
```

---

## PHASE 13 — Admin Panel — Reports Section

### Task 13.1 — Fix Reports Slow Load
Reports are slow because they're doing full collection scans. Fix by:
- Pre-aggregating daily sales totals into `/reports/daily/{date}` document
- Update this document via Cloud Function on each new order

### Task 13.2 — Sales Report Generation
```typescript
async function generateSalesReport(startDate: Date, endDate: Date) {
  const q = query(
    collection(db, 'orders'),
    where('paymentStatus', '==', 'paid'),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
```

### Task 13.3 — Export Report as PDF
```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function exportToPDF(orders) {
  const doc = new jsPDF();
  doc.text('Sales Report', 14, 10);
  doc.autoTable({
    head: [['Order ID', 'Customer', 'Date', 'Amount', 'Status']],
    body: orders.map(o => [o.orderId, o.customerName, o.createdAt.toDate().toLocaleDateString(), `₹${o.total}`, o.paymentStatus]),
  });
  doc.save('sales-report.pdf');
}
```
Install: `npm install jspdf jspdf-autotable`

---

## PHASE 14 — Bundles Feature

### Task 14.1 — Admin Bundle Creation
- [ ] Form: Bundle Name, Select 3 Products (searchable dropdown), Discount % (default 5%)
- [ ] Save to `/bundles/{bundleId}`

### Task 14.2 — Bundle Recommendation on Product Page
When user views or adds a product to cart:
```typescript
// Find if this product is part of any bundle
const q = query(
  collection(db, 'bundles'),
  where('productIds', 'array-contains', productId),
  where('active', '==', true)
);
const snap = await getDocs(q);
if (!snap.empty) {
  const bundle = snap.docs[0].data();
  // Show: "Buy with [Product 2] and [Product 3] and save 5%!"
  showBundleRecommendation(bundle);
}
```

### Task 14.3 — Bundle Discount at Checkout
- [ ] Detect when all 3 bundle products are in cart
- [ ] Auto-apply bundle discount
- [ ] Show savings amount clearly

---

## PHASE 15 — Rate Limiting

### Task 15.1 — Client-Side Rate Limiting for Reviews
```typescript
function checkReviewRateLimit(productId: string): boolean {
  const key = `review_${productId}`;
  const lastReview = localStorage.getItem(key);
  if (lastReview && Date.now() - parseInt(lastReview) < 24 * 60 * 60 * 1000) {
    return false; // Already reviewed in last 24h
  }
  localStorage.setItem(key, Date.now().toString());
  return true;
}
```

### Task 15.2 — API Route Rate Limiting (if using Next.js API routes)
```typescript
import rateLimit from 'express-rate-limit';
// 100 requests per 15 minutes per IP
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
```

### Task 15.3 — Firestore Write Rate Limiting via Security Rules
Add to Firestore rules:
```
// Prevent spam reviews: max 3 reviews per hour per IP (use createdAt checks)
allow create: if request.auth != null
  && request.resource.data.createdAt == request.time;
```

---

## PHASE 16 — Performance Optimizations

### Task 16.1 — Enable Firestore Offline Persistence
Already done in Task 0.4. This makes the app load from local cache instantly, then sync.

### Task 16.2 — Implement Pagination for Large Lists
```typescript
import { startAfter, limit } from 'firebase/firestore';
// First page
const first = query(collection(db, 'products'), orderBy('createdAt'), limit(12));
// Next page (pass last document)
const next = query(collection(db, 'products'), orderBy('createdAt'), startAfter(lastDoc), limit(12));
```

### Task 16.3 — Preload Critical Data
In `_app.tsx` or root layout, start loading products/categories immediately:
```typescript
// Warm up the cache on app start
prefetchProducts(); // starts Firebase listener early
```

### Task 16.4 — Image Lazy Loading
```tsx
<Image src={product.images[0]} loading="lazy" placeholder="blur" blurDataURL="..." />
```

### Task 16.5 — Bundle Splitting
Ensure admin panel code is NOT loaded on shop pages. Use dynamic imports:
```typescript
const AdminPanel = dynamic(() => import('../components/Admin'), { ssr: false });
```

---

## PHASE 17 — Deployment Verification Checklist

### Task 17.1 — Environment Variables
- [ ] All `NEXT_PUBLIC_FIREBASE_*` vars set in Vercel/Netlify/hosting dashboard
- [ ] `RAZORPAY_KEY_SECRET` set as server-only env var (no NEXT_PUBLIC prefix)
- [ ] `FIREBASE_ADMIN_SDK` JSON set for server-side functions

### Task 17.2 — Firebase Rules Deployed
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Task 17.3 — Performance Testing Post-Deployment
- [ ] Open Shop page → products should appear within 1–2 seconds (from cache: <500ms)
- [ ] Open Product Detail → loads in <1 second
- [ ] Update price in Admin → Shop page reflects in <3 seconds
- [ ] Place test order → appears in Admin Orders in <2 seconds
- [ ] Submit review → appears under pending in Admin instantly

### Task 17.4 — Firebase Indexes Verification
```bash
firebase firestore:indexes
```
Ensure all indexes from Task 1.3 show as READY (not BUILDING).

---

## PHASE 18 — Final QA

- [ ] Shop page loads in <2s on 4G mobile (test with Chrome DevTools throttling)
- [ ] Product detail page loads in <1.5s
- [ ] Admin dashboard loads in <2s
- [ ] All admin sections (Categories, Orders, Customers, Coupons, Bundles, Reports) load in <2s
- [ ] Razorpay payment flow works end-to-end
- [ ] Order appears in admin after payment
- [ ] Review submission and approval flow works
- [ ] Coupon application at checkout works
- [ ] Bundle recommendation shows when product is in cart
- [ ] Report PDF exports correctly
- [ ] Price/photo changes in admin reflect instantly in shop

---

## Summary of Key Files to Create/Modify

| File | Purpose |
|------|---------|
| `/lib/firebase.ts` | Firebase init with offline persistence |
| `/hooks/useProducts.ts` | Real-time products hook |
| `/hooks/useProduct.ts` | Single product real-time hook |
| `/hooks/useReviews.ts` | Real-time reviews hook |
| `/hooks/useOrders.ts` | Real-time orders hook |
| `/hooks/useBundles.ts` | Bundle detection hook |
| `/components/ReviewForm.tsx` | Review submission UI |
| `/components/ReviewSection.tsx` | Reviews display (Amazon-style) |
| `/components/ProductSkeleton.tsx` | Loading skeleton |
| `/api/razorpay-webhook.ts` | Payment confirmation handler |
| `/api/create-order.ts` | Pre-payment order creation |
| `/scripts/seedProducts.ts` | One-time product seeding |
| `firestore.rules` | Security rules |
| `storage.rules` | Storage security rules |
