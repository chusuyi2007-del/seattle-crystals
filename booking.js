/* ============================
   Booking Page JS
   Stripe + Formspree integration
   ============================ */

// ============================================================
// CONFIG — Fill these in after creating your accounts
// ============================================================
const CONFIG = {
  // 1. Stripe publishable key (from stripe.com dashboard → Developers → API keys)
  //    Looks like: pk_live_xxxxxxxxxxxx
  STRIPE_PUBLISHABLE_KEY: 'pk_test_REPLACE_WITH_YOUR_STRIPE_KEY',

  // 2. Formspree form ID (from formspree.io → create form → copy the ID)
  //    Your form endpoint will be: https://formspree.io/f/YOUR_FORM_ID
  FORMSPREE_FORM_ID: 'xlgwvoql',

  // 3. Event details
  EVENT: {
    name: "Mother's Day Crystal Ritual",
    date: "May 10, 2025",
    price: 120, // USD per person
    totalSpots: 10,
    spotsRemaining: 10, // Update this manually when someone books
    // When you set up Stripe, create a Price ID in your dashboard
    // Products → Add product → set price → copy Price ID
    stripePriceId: 'price_REPLACE_WITH_YOUR_STRIPE_PRICE_ID',
  }
};
// ============================================================

// Initialize state
let spotsLeft = CONFIG.EVENT.spotsRemaining;
let selectedGuests = 1;

// === Build spots dots UI ===
function buildSpotsDots() {
  const container = document.getElementById('spotsDots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < CONFIG.EVENT.totalSpots; i++) {
    const dot = document.createElement('div');
    dot.className = 'spot-dot' + (i >= spotsLeft ? ' taken' : '');
    dot.title = i >= spotsLeft ? 'Reserved' : 'Available';
    container.appendChild(dot);
  }
}

function updateSpotsUI() {
  const countLabel = document.getElementById('spotsCountLabel');
  const spotsLeft_el = document.getElementById('spots-left');
  const spotsInfo = document.getElementById('spots-info');

  if (countLabel) countLabel.textContent = spotsLeft;
  if (spotsLeft_el) spotsLeft_el.textContent = `${spotsLeft} left`;

  if (spotsLeft === 0) {
    showSoldOut();
  } else if (spotsLeft <= 3) {
    if (spotsLeft_el) {
      spotsLeft_el.style.color = '#e88b6b';
    }
  }
}

function showSoldOut() {
  const step1 = document.getElementById('step1');
  const soldout = document.getElementById('formSoldout');
  if (step1) step1.style.display = 'none';
  if (soldout) soldout.style.display = 'block';
}

// === Price update when guests change ===
function updatePrice() {
  const guestsSelect = document.getElementById('guests');
  const priceDisplay = document.getElementById('price-display');
  const totalDisplay = document.getElementById('total-display');
  if (!guestsSelect) return;

  selectedGuests = parseInt(guestsSelect.value);
  const total = CONFIG.EVENT.price * selectedGuests;
  const formatted = `$${total.toFixed(2)}`;

  if (priceDisplay) priceDisplay.textContent = formatted;
  if (totalDisplay) totalDisplay.textContent = formatted;

  // Update button text
  const btn = document.getElementById('checkoutBtn');
  if (btn) {
    const btnText = document.getElementById('btnText');
    if (btnText) btnText.textContent = `Continue to Payment — $${total} →`;
  }
}

// === Stripe Checkout ===
async function initiateStripeCheckout(bookingData) {
  // Option A: Stripe Checkout (recommended - hosted payment page)
  // You need to set up a backend endpoint or use Stripe Payment Links
  //
  // EASIEST OPTION: Use Stripe Payment Links
  // 1. Go to stripe.com → Payment Links → Create new link
  // 2. Add your product ($120 Crystal Ritual)
  // 3. Copy the link and paste it below
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK';

  // Add customer info as URL params so Stripe pre-fills the form
  const params = new URLSearchParams({
    prefilled_email: bookingData.email,
    client_reference_id: `${bookingData.firstName}_${bookingData.lastName}_${Date.now()}`,
  });

  // Redirect to Stripe payment link
  window.location.href = `${STRIPE_PAYMENT_LINK}?${params.toString()}`;
}

// === Send booking notification via Formspree ===
async function sendBookingNotification(data) {
  const endpoint = `https://formspree.io/f/${CONFIG.FORMSPREE_FORM_ID}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `🌸 New booking: ${data.firstName} ${data.lastName} — Mother's Day Ritual`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone || 'Not provided',
      guests: data.guests,
      total: `$${data.guests * CONFIG.EVENT.price}`,
      notes: data.notes || 'None',
      event: CONFIG.EVENT.name,
      date: CONFIG.EVENT.date,
      submitted_at: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    })
  });

  return response.ok;
}

// === Handle form submission ===
async function handleBookingSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('checkoutBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');

  // Validate spots
  if (spotsLeft <= 0) { showSoldOut(); return; }
  if (selectedGuests > spotsLeft) {
    alert(`Only ${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} remaining. Please adjust your selection.`);
    return;
  }

  // Loading state
  if (btn) btn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline';

  const data = {
    firstName: document.getElementById('firstName')?.value,
    lastName: document.getElementById('lastName')?.value,
    email: document.getElementById('email')?.value,
    phone: document.getElementById('phone')?.value,
    guests: selectedGuests,
    notes: document.getElementById('notes')?.value,
  };

  try {
    // Send notification email first
    if (CONFIG.FORMSPREE_FORM_ID !== 'REPLACE_WITH_YOUR_FORMSPREE_ID') {
      await sendBookingNotification(data);
    }

    // Then redirect to Stripe payment
    await initiateStripeCheckout(data);

  } catch (err) {
    console.error('Booking error:', err);
    // Reset button
    if (btn) btn.disabled = false;
    if (btnText) { btnText.style.display = 'inline'; btnText.textContent = 'Try Again'; }
    if (btnLoader) btnLoader.style.display = 'none';
    alert('Something went wrong. Please email us at hello@seabloomcrystals.com');
  }
}

// === Waitlist form ===
function handleWaitlist(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  // Send to Formspree
  fetch(`https://formspree.io/f/${CONFIG.FORMSPREE_FORM_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: '🌙 Waitlist signup — Mother\'s Day Ritual',
      email,
      type: 'waitlist',
    })
  });
  e.target.innerHTML = '<p style="color: var(--gold); font-size: 0.84rem;">✦ You\'re on the waitlist! We\'ll notify you if a spot opens.</p>';
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  buildSpotsDots();
  updateSpotsUI();
  updatePrice();

  const guestsSelect = document.getElementById('guests');
  if (guestsSelect) guestsSelect.addEventListener('change', updatePrice);

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);

  const waitlistForm = document.getElementById('waitlistForm');
  if (waitlistForm) waitlistForm.addEventListener('submit', handleWaitlist);

  // Check if coming back from successful Stripe payment
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    // Update spots (in a real app this would be server-side)
    spotsLeft = Math.max(0, spotsLeft - (parseInt(urlParams.get('qty')) || 1));
    buildSpotsDots();
    updateSpotsUI();
  }
});
