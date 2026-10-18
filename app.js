var products = [];
var cartCount = 0;

var productContainer = document.getElementById("productContainer");
var searchInput = document.getElementById("searchInput");
var categoryFilter = document.getElementById("categoryFilter");
var sortFilter = document.getElementById("sortFilter");
var productCount = document.getElementById("productCount");
var cartCountText = document.getElementById("cartCount");
var message = document.getElementById("message");

// API CALLING
async function getData() {
    try {
        var response = await fetch("https://dummyjson.com/products?limit=0");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        var data = await response.json();

        // Sirf home-related categories lena
        products = data.products.filter(function(product) {
            return product.category === "furniture" ||
                   product.category === "home-decoration" ||
                   product.category === "kitchen-accessories";
        });

        if (products.length === 0) {
            message.textContent = "No home products found.";
            productCount.textContent = "0 products";
            return;
        }

        // Category dropdown fill karna
        var categories = [];

        products.forEach(function(product) {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        });

        categories.sort();

        categories.forEach(function(category) {
            var option = document.createElement("option");

            option.value = category;
            option.textContent = category.replaceAll("-", " ");

            categoryFilter.appendChild(option);
        });

        message.style.display = "none";

        showProducts(products);

        console.log("API response:", data);
        console.log("Home products:", products);

    } catch (error) {
        message.textContent =
            "Products load nahi hue. Internet check karke refresh karein.";

        productCount.textContent = "Unable to load";
        console.log("API Error:", error);
    }
}

// PRODUCTS DISPLAY KARNA
function showProducts(list) {
    productContainer.innerHTML = "";

    productCount.textContent = list.length + " products";

    if (list.length === 0) {
        productContainer.innerHTML =
            '<div class="col-12 text-center py-5">' +
            '<h4>No products found</h4>' +
            '<p>Try another search.</p></div>';
        return;
    }

    list.forEach(function(product) {
        var col = document.createElement("div");

        col.className = "col-6 col-md-4 col-lg-3";

        col.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.thumbnail}"
                         alt="${product.title}"
                         loading="lazy">
                </div>

                <div class="product-info">
                    <p class="product-category">
                        ${product.category.replaceAll("-", " ")}
                    </p>

                    <h3 class="product-title">
                        ${product.title}
                    </h3>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <div class="product-bottom">
                        <span class="product-price">
                            $${product.price.toFixed(2)}
                        </span>

                        <button class="add-btn">
                            <i class="fa-solid fa-bag-shopping"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Cart button ka click event
        var button = col.querySelector(".add-btn");

        button.addEventListener("click", function() {
            cartCount++;

            cartCountText.textContent = cartCount;

            button.textContent = "Added ✓";

            setTimeout(function() {
                button.innerHTML =
                    '<i class="fa-solid fa-bag-shopping"></i> Add to Cart';
            }, 1000);
        });

        productContainer.appendChild(col);
    });
}

// SEARCH AUR FILTER
function filterProducts() {
    var searchText = searchInput.value.toLowerCase();
    var selectedCategory = categoryFilter.value;

    var filtered = products.filter(function(product) {
        var matchesSearch =
            product.title.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        var matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // SORTING
    if (sortFilter.value === "low") {
        filtered.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    else if (sortFilter.value === "high") {
        filtered.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    else if (sortFilter.value === "az") {
        filtered.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    }

    showProducts(filtered);
}

// EVENTS
searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

sortFilter.addEventListener("change", filterProducts);

// WEBSITE START
getData();