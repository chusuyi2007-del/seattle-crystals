# SEA Bloom Crystals — Setup Guide

## Files in this project
- `index.html` — Main website
- `booking.html` — Booking/reservation page
- `styles.css` — Main styles
- `booking.css` — Booking page styles
- `main.js` — Cursor, nav, scroll effects
- `booking.js` — Booking logic (Stripe + Formspree)
- `vercel.json` — Vercel deployment config

---

## Step 1: Create accounts (all free to start)

### Formspree (to receive booking emails)
1. Go to formspree.io → Sign up
2. Click "New Form"
3. Name it "SEA Bloom Bookings"
4. Copy your Form ID (looks like: `xwkjabcd`)
5. Paste it in `booking.js` → `FORMSPREE_FORM_ID: 'xwkjabcd'`

### Stripe (to collect $120 payments)
1. Go to stripe.com → Sign up
2. Complete identity verification (required to receive payouts)
3. Go to **Payment Links** → Create a link
4. Add product: "Mother's Day Crystal Ritual" → $120
5. Copy the Payment Link URL
6. Paste in `booking.js` → `STRIPE_PAYMENT_LINK: 'https://buy.stripe.com/...'`
7. In Stripe settings, set the success redirect URL to:
   `https://YOUR-DOMAIN.vercel.app/booking?success=true`

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel website (easiest)
1. Go to github.com → Create a new repository called `sea-bloom-crystals`
2. Upload all these files to the repository
3. Go to vercel.com → Sign in with GitHub
4. Click "Add New Project" → Import your repository
5. Click "Deploy" — done! 🎉

### Option B: Via Vercel CLI
```bash
npm i -g vercel
cd sea-bloom
vercel --prod
```

---

## Step 3: Update spots manually

Right now spots are tracked in `booking.js` → `CONFIG.EVENT.spotsRemaining`.

**When someone books:**
1. You'll get an email from Formspree
2. You'll see the payment in Stripe
3. Update `spotsRemaining` in `booking.js` and redeploy

(This is the simple version — ask for an upgrade if you want automatic spot tracking!)

---

## Step 4: Custom domain (optional)
1. Buy `seabloomcrystals.com` on Namecheap (~$12/year)
2. In Vercel: Settings → Domains → Add domain
3. Follow DNS instructions

---

## Update event details
Everything is in `booking.js` → `CONFIG`:
- Change date, price, spots, event name there
- For the main page, edit `index.html` directly

---

## Questions?
Email configured in booking.js → update `hello@seabloomcrystals.com` to your real email.
