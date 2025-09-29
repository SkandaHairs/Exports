// 🔒 Disable right-click and dev shortcuts
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});

// ✅ DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("ready");

  // Flip button styles
  const flipButtons = document.querySelectorAll(".flip-card-back button");
  flipButtons.forEach((button) => {
    button.addEventListener("click", () => {
      flipButtons.forEach((b) => {
        b.style.backgroundColor = "crimson";
        b.style.color = "#fff";
        b.style.border = "none";
        b.style.padding = "10px 20px";
        b.style.borderRadius = "8px";
      });

      button.style.backgroundColor = "#c0c0c0";
      button.style.color = "#fff";
    });
  });

  // Flip card toggle
  window.toggleFlip = function (btn) {
    const flipInner = btn.closest(".card").querySelector(".flip-card-inner");
    const currentTransform = flipInner.style.transform;
    flipInner.style.transform =
      currentTransform === "rotateY(180deg)"
        ? "rotateY(0deg)"
        : "rotateY(180deg)";
  };

  // Counter functions
  // --- Price Update Logic ---

  // Alert functions
  window.showAlert = function (message) {
    const alertBox = document.getElementById("customAlert");
    alertBox.querySelector("p").textContent = message;
    document.getElementById("alertOverlay").style.display = "block";
  };

  window.closeAlert = function () {
    document.getElementById("alertOverlay").style.display = "none";
  };

  // Slider logic
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentSlide = index;
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      showSlide(nextSlide);
    }, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      clearInterval(autoSlideInterval);
      startAutoSlide();
    });
  });

  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      let nextSlide = (currentSlide + 1) % slides.length;
      showSlide(nextSlide);
      clearInterval(autoSlideInterval);
      startAutoSlide();
    });
  });

  showSlide(currentSlide);
  startAutoSlide();

  // Hamburger menu
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector("nav");
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("collapsed");
  });

  // Remove AOS on mobile
  if (window.innerWidth <= 600) {
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.removeAttribute("data-aos");
    });
  }
});

// 🛒 Add to Cart
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add");
  if (addButton) {
    addButton.addEventListener("click", () => {
      const length = document.getElementById("length").value;
      const type = document.getElementById("hairType").value;
      const weight = document.getElementById("weight").value;
      const quantity = document.getElementById("counter-value").value;
      // NEW (correct)
      const price = document
        .getElementById("price")
        .textContent.replace("Price: ₹", "");
      if (!type) {
        showAlert("Please select a hair type before adding to cart.");
        return;
      }

      const item = { length, type, weight, quantity, price };
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
      showAlert("Item added to cart!");
    });
  }

  // Update cart badge on DOMContentLoaded on all pages
  updateCartBadge();
});

// 🛒 Update Cart Badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cartCount");
  if (badge) {
    const total = cart.reduce(
      (sum, item) => sum + (parseInt(item.quantity) || 1),
      0
    );
    badge.textContent = total;
  }
}

//hair image preview on order page

const hairTypeDropdown = document.getElementById("hairType");
const previewImage = document.getElementById("previewImage");

hairTypeDropdown.addEventListener("change", function () {
  const selectedType = this.value;
  previewImage.src = `"images/img${selectedType}.webp"`;
  previewImage.alt = `${
    selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
  } Hair Sample`;
  previewImage.style.opacity = 1;
});

//price calculation logic on order.html
// Reference UI elements
const priceDiv = document.querySelector(".price");
const lengthSelect = document.getElementById("length");
const typeSelect = document.getElementById("hairType");
const weightSelect = document.getElementById("weight");
const quantityInput = document.getElementById("counter-value");

// Initialize price map
let priceMap = {};

// Fetch price data from JSON
fetch("prices.json")
  .then((response) => response.json())
  .then((data) => {
    priceMap = data;

    // Attach listeners AFTER prices load
    lengthSelect.addEventListener("change", calculatePrice);
    typeSelect.addEventListener("change", calculatePrice);
    weightSelect.addEventListener("change", calculatePrice);
    quantityInput.addEventListener("input", calculatePrice);

    calculatePrice(); // initial calculation
  })
  .catch((error) => console.error("Failed to load prices:", error));

// Unified price calculator
function calculatePrice() {
  const length = lengthSelect.value;
  const type = typeSelect.value;
  const weight = weightSelect.value;
  const quantity = parseInt(quantityInput.value) || 1;

  // Avoid calculation if any selection is missing
  // if (!length || !type || !weight) {
  //   priceDiv.textContent = "Price: ₹0";
  //   return;
  // }

  const key = `${length}_${weight}_${type}`;
  const pricePerUnit = priceMap[key] || 0;
  const totalPrice = pricePerUnit * quantity;

  priceDiv.textContent = `Price: ₹${totalPrice}`;
}

// Hook dropdown changes
lengthSelect.addEventListener("change", calculatePrice);
typeSelect.addEventListener("change", calculatePrice);
weightSelect.addEventListener("change", calculatePrice);
quantityInput.addEventListener("input", calculatePrice);

// Counter functions
window.increment = function () {
  quantityInput.value = parseInt(quantityInput.value) + 1;
  calculatePrice();
};

window.decrement = function () {
  if (parseInt(quantityInput.value) > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
    calculatePrice();
  }
};

// Initial price display
calculatePrice();

// Redirect to cart page when "Your Order Summary" button is clicked
cartpage = function () {
  window.location.href = "cart.html";
};
