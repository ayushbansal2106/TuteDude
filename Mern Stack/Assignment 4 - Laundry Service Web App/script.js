document.addEventListener('DOMContentLoaded', function () {
  // simple data for servics
  var services = {
    'dry-cleaning': { name: 'Dry Cleaning', price: 200 },
    'wash-fold': { name: 'Wash & Fold', price: 100 },
    'ironing': { name: 'Ironing', price: 30 },
    'stain-removal': { name: 'Stain Removal', price: 500 },
    'leather-cleaning': { name: 'Leather & Suede Cleaning', price: 999 },
    'wedding-dress': { name: 'Wedding Dress Cleaning', price: 2800 }
  };

  // beginer cart: plain object {key: qty}
  var cartData = {};
  var cartDiv = document.getElementById('cart-items');
  var totalDiv = document.getElementById('total-amount');
  var msgBooking = document.getElementById('booking-status');
  var msgNewsletter = document.getElementById('newsletter-status');

  // add/remove buttuns in service list
  var svcBtns = document.querySelectorAll('.service-item .btn2');
  for (var i = 0; i < svcBtns.length; i++) {
    svcBtns[i].addEventListener('click', function () {
      var row = this.closest('.service-item');
      var key = row.getAttribute('data-service');
      var act = this.getAttribute('data-action');
      if (!services[key]) return;
      if (act === 'add') addToCart(key);
      if (act === 'remove') removeFromCart(key);
      renderCart();
    });
  }

  // CTA scroll
  var cta = document.getElementById('cta-scroll');
  if (cta) {
    cta.addEventListener('click', function () {
      var target = document.getElementById('booking');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // bookin form
  var bookForm = document.getElementById('booking-form');
  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (Object.keys(cartData).length === 0) {
      msgBooking.textContent = 'Please add at least one service before booking.';
      msgBooking.style.color = '#d94646';
      return;
    }

    var formData = new FormData(bookForm);
    var fullName = formData.get('fullName');
    var email = formData.get('email');
    var phone = formData.get('phone');

    var lines = [];
    var index = 1;
    for (var k in cartData) {
      var item = services[k];
      var qty = cartData[k];
      lines.push(index + '. ' + item.name + ' x' + qty + ' - ₹' + (item.price * qty).toFixed(2));
      index++;
    }

    var total = getTotal();
    msgBooking.textContent = 'Processing booking...';
    msgBooking.style.color = '#4b5563';

    // show confirmation
    setTimeout(function() {
      var orderSummary = 'Booking Confirmed!\n\n';
      orderSummary += 'Name: ' + fullName + '\n';
      orderSummary += 'Email: ' + email + '\n';
      orderSummary += 'Phone: ' + phone + '\n\n';
      orderSummary += 'Order Details:\n' + lines.join('\n') + '\n\n';
      orderSummary += 'Total: ₹' + total.toFixed(2);
      
      alert(orderSummary);
      
      msgBooking.textContent = 'Thank you for booking the service. We will get back to you soon!';
      msgBooking.style.color = '#1b61d1';
      bookForm.reset();
      cartData = {};
      renderCart();
    }, 500);
  });

  // newsletter
  var newsForm = document.getElementById('newsletter-form');
  newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    msgNewsletter.textContent = 'Thanks for subscribing!';
    msgNewsletter.style.color = '#fff';
    newsForm.reset();
  });

  function addToCart(key) {
    if (!cartData[key]) cartData[key] = 1;
      else cartData[key] = cartData[key] + 1;
  }

  function removeFromCart(key) {
    if (!cartData[key]) return;
    cartData[key] = cartData[key] - 1;
    if (cartData[key] <= 0) delete cartData[key];
  }

  function getTotal() {
    var total = 0;
    for (var k in cartData) {
      var qty = cartData[k];
      var svc = services[k];
      total += svc.price * qty;
    }
    return total;
  }

  function renderCart() {
    var keys = Object.keys(cartData);
    if (keys.length === 0) {
      cartDiv.innerHTML = '<div class="empty-state">No items added yet</div>';
      totalDiv.textContent = '₹0.00';
    } else {
      var html = '<div class="cart-header"><span>S.No</span><span>Service Name</span><span>Qty</span><span>Price</span></div>';
      var i = 1;
      for (var k in cartData) {
        var svc = services[k];
        var qty = cartData[k];
        html += '<div class="cart-row">' +
          '<span>' + i + '</span>' +
          '<span>' + svc.name + '</span>' +
          '<span class="qty-controls">' +
            '<button class="qty-btn" data-action="decrease" data-service="' + k + '">-</button>' +
            '<span class="qty-display">' + qty + '</span>' +
            '<button class="qty-btn" data-action="increase" data-service="' + k + '">+</button>' +
          '</span>' +
          '<span>₹' + (svc.price * qty).toFixed(2) + '</span>' +
        '</div>';
        i++;
      }
      cartDiv.innerHTML = html;
      totalDiv.textContent = '₹' + getTotal().toFixed(2);

      // attach +/- handelers inside cart
      var btns = cartDiv.querySelectorAll('.qty-btn');
      for (var b = 0; b < btns.length; b++) {
        btns[b].addEventListener('click', function () {
          var k = this.getAttribute('data-service');
          var a = this.getAttribute('data-action');
          if (a === 'increase') addToCart(k);
          else removeFromCart(k);
          renderCart();
        });
      }
    }

    // update add/remove buttens visibility
    var rows = document.querySelectorAll('.service-item');
    for (var r = 0; r < rows.length; r++) {
      var k3 = rows[r].getAttribute('data-service');
      var addBtn = rows[r].querySelector('[data-action="add"]');
      var remBtn = rows[r].querySelector('[data-action="remove"]');
      if (cartData[k3]) {
        addBtn.style.display = 'none';
        remBtn.style.display = 'inline-block';
      } else {
        addBtn.style.display = 'inline-block';
        remBtn.style.display = 'none';
      }
    }
  }

  // initail render
  renderCart();
});
