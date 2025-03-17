// public/main.js

// Xử lý sự kiện và cập nhật giỏ hàng cho tất cả các trang (index, cart, detail, auth)
document.addEventListener("DOMContentLoaded", function () {
    // Biến cart toàn cục, sẽ được cập nhật từ server (session)
    let cart = [];
  
    // Hàm load giỏ hàng từ server khi trang được load
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
  
    // Xử lý sự kiện nhấn nút Giỏ hàng (Cart Button)
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
  
    // Xử lý nút Clear Cart
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
  
    // Hàm render giỏ hàng vào modal (hoặc trang cart)
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
            <img src="${item.image}" class="img-thumbnail me-2" style="width: 50px; height: 50px; object-fit: cover;" alt="${item.name}">
            <div>
              <p class="mb-0"><strong>${item.name}</strong></p>
              ${ item.size && item.size !== "No Size" ? `<p class="mb-0">Size: ${item.size}</p>` : '' }
              <p class="mb-0">Quantity: ${item.quantity}</p>
              <p class="mb-0">${formatPrice(item.price)} ₫</p>
            </div>
          </div>
          <button class="btn btn-transparent btn-sm remove-item" data-id="${item.id}" data-size="${item.size}">🗑️</button>
        `;
        cartItems.appendChild(li);
      });
  
      // Gắn sự kiện cho các nút Remove
      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
          let id = this.getAttribute("data-id");
          let size = this.getAttribute("data-size");
          removeItem(id, size);
        });
      });
    }
  
    // Hàm xóa một sản phẩm khỏi giỏ hàng (session)
    function removeItem(id, size) {
      fetch(`/cart/remove/${id}?size=${encodeURIComponent(size)}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          cart = data;
          renderCart();
          updateCartCount();
        })
        .catch((error) => console.error("Error removing item:", error));
    }
  
    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng hiển thị ở badge
    function updateCartCount() {
      const cartCountElement = document.getElementById("cartCount");
      if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      }
    }
  
    // Hàm định dạng giá theo định dạng VNĐ
    function formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  
    // Xử lý sự kiện "Add to Cart"
    document.querySelectorAll(".addToCart").forEach((button) => {
      button.addEventListener("click", function () {
        let id = this.getAttribute("data-id");
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price"));
        let thumbnail = this.getAttribute("data-thumbnail");
        let quantity = parseInt(document.getElementById("quantityInput").value, 10);
  
        // Lấy size được chọn từ radio buttons (name=\"sizeOptions\")
        const selectedSize = document.querySelector('input[name="sizeOptions"]:checked');
        let size = selectedSize ? selectedSize.value : "No Size";
  
        if (!quantity || quantity < 1) {
          alert("Vui lòng nhập số lượng hợp lệ.");
          return;
        }
  
        // Gửi yêu cầu POST đến API /cart/add để lưu giỏ hàng vào session
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
  
  // Xử lý hộp số lượng (cho trang detail.ejs)
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
  
  // Xử lý slider hình ảnh (cho trang detail.ejs)
  document.addEventListener("DOMContentLoaded", function () {
    const sliderContainer = document.getElementById("imageSlider");
    const sliderItems = document.querySelectorAll(".slider-item");
    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");
    const thumbnails = document.querySelectorAll(".thumbnail");
  
    let currentIndex = 0;
  
    function updateSlider() {
      const offset = -currentIndex * 100; // Di chuyển slider
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