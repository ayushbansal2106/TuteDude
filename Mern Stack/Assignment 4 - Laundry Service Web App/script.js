document.addEventListener('DOMContentLoaded', () => {
  // Initialize emailJS with your public key (replace placeholder).
  if (window.emailjs) {
    emailjs.init('YOUR_PUBLIC_KEY');
  }

  const services = {
    'dry-cleaning': { name: 'Dry Cleaning', price: 200 },
    'wash-fold': { name: 'Wash & Fold', price: 100 },
    'ironing': { name: 'Ironing', price: 30 },
    'stain-removal': { name: 'Stain Removal', price: 500 },
    'leather-cleaning': { name: 'Leather & Suede Cleaning', price: 999 },
    'wedding-dress': { name: 'Wedding Dress Cleaning', price: 2800 }
  };

  const cart = new Map();
  const cartContainer = document.getElementById('cart-items');
  const totalAmountEl = document.getElementById('total-amount');
  const statusEl = document.getElementById('booking-status');
  const newsletterStatusEl = document.getElementById('newsletter-status');

  const serviceButtons = document.querySelectorAll('.service-row .ghost-btn');
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceKey = btn.closest('.service-row').dataset.service;
      const action = btn.dataset.action;
      if (!services[serviceKey]) return;
      if (action === 'add') addToCart(serviceKey);
      if (action === 'remove') removeFromCart(serviceKey);
      renderCart();
    });
  });

  document.getElementById('cta-scroll').addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cart.size) {
      statusEl.textContent = 'Please add at least one service before booking.';
      statusEl.style.color = '#d94646';
      return;
    }

    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');

    const orderLines = [...cart.entries()].map(([key, qty], index) => {
      const item = services[key];
      return `${index + 1}. ${item.name} x${qty} - ₹${(item.price * qty).toFixed(2)}`;
    }).join('\n');

    const total = getTotal();
    statusEl.textContent = 'Sending booking...';
    statusEl.style.color = '#4b5563';

    try {
      if (!window.emailjs) throw new Error('EmailJS not loaded');
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'YOUR_EMAIL_ADDRESS',
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        order_details: orderLines,
        order_total: `₹${total.toFixed(2)}`
      });
      statusEl.textContent = 'Thank you for booking the service. We will get back to you soon!';
      statusEl.style.color = '#1b61d1';
      e.target.reset();
      cart.clear();
      renderCart();
    } catch (err) {
      statusEl.textContent = 'Could not send email. Please check EmailJS keys and try again.';
      statusEl.style.color = '#d94646';
      console.error(err);
    }
  });

  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterStatusEl.textContent = 'Thanks for subscribing!';
    newsletterStatusEl.style.color = '#fff';
    e.target.reset();
  });

  function addToCart(key) {
    const current = cart.get(key) || 0;
    cart.set(key, current + 1);
  }

  function removeFromCart(key) {
    if (!cart.has(key)) return;
    const current = cart.get(key);
    if (current <= 1) {
      cart.delete(key);
    } else {
      cart.set(key, current - 1);
    }
  }

  function getTotal() {
    let total = 0;
    cart.forEach((qty, key) => {
      const service = services[key];
      total += service.price * qty;
    });
    return total;
  }

  function renderCart() {
    cartContainer.innerHTML = '';
    if (!cart.size) {
      cartContainer.innerHTML = '<div class="empty-state">No items added yet</div>';
      totalAmountEl.textContent = '₹0.00';
      return;
    }

    const header = document.createElement('div');
    header.className = 'cart-header';
    header.innerHTML = '<span>S.No</span><span>Service Name</span><span>Qty</span><span>Price</span>';
    cartContainer.appendChild(header);

    let index = 1;
    cart.forEach((qty, key) => {
      const service = services[key];
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `<span>${index}</span><span>${service.name}</span><span>${qty}</span><span>₹${(service.price * qty).toFixed(2)}</span>`;
      cartContainer.appendChild(row);
      index += 1;
    });

    totalAmountEl.textContent = `₹${getTotal().toFixed(2)}`;
  }

  renderCart();
});
