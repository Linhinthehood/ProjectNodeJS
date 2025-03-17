// Handle cart modal (for all pages: index, cart, detail, auth)
document.addEventListener("DOMContentLoaded", function () {
    // Global cart variable; sẽ được cập nhật từ server
    let cart = [];
  
    // Load cart từ server khi trang được load
    function loadCart() {
      fetch("/cart")
        .then((res) => res.json())
        .then((data) => {
          cart = data;
          updateCartCount();
          renderCart();
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
    loadCart();
  
    // Handle Cart Button Click
    const cartButton = document.getElementById("cartButton");
    if (cartButton) {
      cartButton.addEventListener("click", function (event) {
        event.preventDefault();
        renderCart();
        const cartModalElement = document.getElementById("cartModal");
        if (cartModalElement) {
          const cartModal = new bootstrap.Modal(cartModalElement);
          cartModal.show();
        } else {
          console.error("Cart modal element not found");
        }
      });
    } else {
      console.error("Cart button not found");
    }
  
    // Clear Cart Button
    const clearCartButton = document.getElementById("clearCart");
    if (clearCartButton) {
      clearCartButton.addEventListener("click", function () {
        fetch("/cart/clear", { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            cart = data;
            renderCart();
            updateCartCount();
          })
          .catch((error) => console.error("Error clearing cart:", error));
      });
    }
  
    // Function to Render Cart Items
    function renderCart() {
      const cartItems = document.getElementById("cartItems");
      if (!cartItems) {
        console.error("Cart items container not found");
        return;
      }
  
      cartItems.innerHTML = "";
      if (cart.length === 0) {
        cartItems.innerHTML = "<li class='list-group-item text-center'>Giỏ hàng trống</li>";
        return;
      }
  
      cart.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.innerHTML = `
          <div class="d-flex align-items-center">
            <img src="${item.thumbnail}" class="img-thumbnail me-2" style="width: 50px; height: 50px; object-fit: cover;" alt="${item.name}">
            <div>
              <p class="mb-0"><strong>${item.name}</strong></p>
              <p class="mb-0">Size: ${item.size}</p>
              <p class="mb-0">Quantity: ${item.quantity}</p>
              <p class="mb-0">${formatPrice(item.price)} ₫</p>
            </div>
          </div>
          <button class="btn btn-transparent btn-sm remove-item" data-id="${item.id}" data-size="${item.size}">🗑️</button>
        `;
        cartItems.appendChild(li);
      });
  
      // Attach remove event listeners
      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
          let id = this.getAttribute("data-id");
          let size = this.getAttribute("data-size");
          removeItem(id, size);
        });
      });
    }
  
    // Function to Remove Item from Cart
    function removeItem(id, size) {
      // Gửi DELETE request đến API để xóa sản phẩm khỏi giỏ hàng dựa trên id và size
      fetch(`/cart/remove/${id}?size=${encodeURIComponent(size)}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          cart = data;
          renderCart();
          updateCartCount();
        })
        .catch((error) => console.error("Error removing item:", error));
    }
  
    // Function to Update Cart Count Badge
    function updateCartCount() {
      const cartCountElement = document.getElementById("cartCount");
      if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      }
    }
  
    // Function to Format Price (VND)
    function formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  
    // Add to Cart Button Click Event
    document.querySelectorAll(".addToCart").forEach((button) => {
      button.addEventListener("click", function () {
        let id = this.getAttribute("data-id");
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price"));
        let thumbnail = this.getAttribute("data-thumbnail");
        let quantity = parseInt(document.getElementById("quantityInput").value, 10);
  
        // Get selected size from radio buttons (name="sizeOptions")
        const selectedSize = document.querySelector('input[name="sizeOptions"]:checked');
        let size = selectedSize ? selectedSize.value : "No Size";
  
        if (!quantity || quantity < 1) {
          alert("Vui lòng nhập số lượng hợp lệ.");
          return;
        }
  
        // Send POST request to server API to add product to cart stored in session
        fetch("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name, price, quantity, size, image: thumbnail })
        })
          .then((response) => response.json())
          .then((data) => {
            cart = data;
            updateCartCount();
            renderCart();
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
          })
          .catch((error) => {
            console.error("Error adding product to cart:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
          });
      });
    });
  });
  
  // Handle quantity box (for detail.ejs)
  document.addEventListener("DOMContentLoaded", function () {
    const increaseBtn = document.getElementById("increaseQuantity");
    const decreaseBtn = document.getElementById("decreaseQuantity");
    const qtyInput = document.getElementById("quantityInput");
  
    if (increaseBtn && qtyInput) {
      increaseBtn.addEventListener("click", function () {
        qtyInput.value = parseInt(qtyInput.value) + 1;
      });
    }
  
    if (decreaseBtn && qtyInput) {
      decreaseBtn.addEventListener("click", function () {
        if (parseInt(qtyInput.value) > 1) {
          qtyInput.value = parseInt(qtyInput.value) - 1;
        }
      });
    }
  });
  
  // Handle image sliding (for detail.ejs)
  document.addEventListener("DOMContentLoaded", function () {
    const sliderContainer = document.getElementById("imageSlider");
    const sliderItems = document.querySelectorAll(".slider-item");
    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");
    const thumbnails = document.querySelectorAll(".thumbnail");
  
    let currentIndex = 0;
  
    function updateSlider() {
      const offset = -currentIndex * 100; // Move the slider
      sliderContainer.style.transform = `translateX(${offset}%)`;
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle("active", index === currentIndex);
      });
    }
  
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        if (currentIndex < sliderItems.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });
    }
  
    if (prevButton) {
      prevButton.addEventListener("click", function () {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }
  
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", function () {
        currentIndex = index;
        updateSlider();
      });
    });
  });