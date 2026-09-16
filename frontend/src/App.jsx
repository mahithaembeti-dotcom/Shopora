import { useEffect, useState } from "react";

const API = "https://shopora-backend-9rk3.onrender.com/api";

const categories = [
  "All",
  "Laptops",
  "Smartphones",
  "Headphones",
  "Clothing",
  "Footwear",
  "Smart Watches",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Bags & Accessories",
];

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("shoporaUser") || "null")
  );

  const [view, setView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/products`);
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Products error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCart() {
    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCart(await response.json());
      }
    } catch (error) {
      console.error("Cart error:", error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadCart();
  }, [token]);

  async function addToCart(productId) {
    if (!user) {
      setView("login");
      return;
    }

    try {
      const response = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        await loadCart();
        setView("cart");
      } else {
        alert("Could not add product to cart");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server");
    }
  }

  async function removeFromCart(productId) {
    try {
      await fetch(`${API}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadCart();
    } catch (error) {
      console.error(error);
    }
  }

  async function checkout() {
    try {
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCart([]);
        alert("Order placed successfully!");
        setView("orders");
      } else {
        alert("Unable to place order");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server");
    }
  }

  function logout() {
    localStorage.removeItem("shoporaUser");
    setUser(null);
    setCart([]);
    setView("home");
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setView("product");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function backToProducts() {
    setSelectedProduct(null);
    setView("home");

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category?.toLowerCase() === category.toLowerCase() ||
      (category === "Smart Watches" &&
        product.category?.toLowerCase() === "smart watch");

    return matchesSearch && matchesCategory;
  });

  const cartItems = cart.map((item) => {
    const product = products.find(
      (productItem) => productItem.id === item.productId
    );

    return {
      ...item,
      product,
    };
  });

  const cartTotal = cartItems.reduce((total, item) => {
    if (!item.product) return total;

    return (
      total +
      Number(item.product.price) * Number(item.quantity)
    );
  }, 0);

  return (
    <div className="app">

      {/* HEADER */}

      <header className="top-header">
        <div className="header-inner">

          <button
            className="logo"
            onClick={() => {
              setSelectedProduct(null);
              setView("home");
            }}
          >
            Shopora
          </button>

          <div className="search-box">
            <span>🔍</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
            />
          </div>

          <nav className="main-nav">

            <button onClick={() => setView("cart")}>
              🛒 Cart
              <span className="cart-count">
                {cart.length}
              </span>
            </button>

            <button onClick={() => setView("orders")}>
              📦 My Orders
            </button>

            <button onClick={() => setView("home")}>
              🛠 Admin
            </button>

            {user ? (
              <button
                className="login-button"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <button
                className="login-button"
                onClick={() => setView("login")}
              >
                Login / Register
              </button>
            )}

          </nav>
        </div>

        <div className="category-bar">

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "active-category"
                  : ""
              }
              onClick={() => {
                setCategory(item);
                setSelectedProduct(null);
                setView("home");
              }}
            >
              {item}
            </button>
          ))}

        </div>
      </header>

      {/* HOME */}

      {view === "home" && (
        <main>

          <section className="hero">
            <div className="hero-content">

              <p className="hero-small-title">
                Welcome to Shopora
              </p>

              <h1>
                Smart Shopping,
                <br />
                Better Choices.
              </h1>

              <p className="hero-description">
                Discover amazing products at great prices.
              </p>

              <button
                className="shop-now-button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Shop Now
              </button>

            </div>
          </section>

          <section className="features">

            <div className="feature">
              <span>🚚</span>
              <div>
                <h3>Fast Delivery</h3>
                <p>Quick doorstep delivery</p>
              </div>
            </div>

            <div className="feature">
              <span>💳</span>
              <div>
                <h3>Secure Payment</h3>
                <p>100% secure checkout</p>
              </div>
            </div>

            <div className="feature">
              <span>↩️</span>
              <div>
                <h3>Easy Returns</h3>
                <p>Simple return process</p>
              </div>
            </div>

            <div className="feature">
              <span>⭐</span>
              <div>
                <h3>Quality Products</h3>
                <p>Trusted products</p>
              </div>
            </div>

          </section>

          <section
            className="products-section"
            id="products"
          >

            <div className="section-heading">

              <div>
                <p className="section-label">
                  OUR COLLECTION
                </p>

                <h2>
                  Explore Our Products
                </h2>
              </div>

              <span className="product-count">
                {filteredProducts.length} products
              </span>

            </div>

            {loading ? (
              <p className="status-message">
                Loading products...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="status-message">
                No products found.
              </p>
            ) : (
              <div className="product-grid">

                {filteredProducts.map((product) => (

                  <article
                    className="product-card"
                    key={product.id}
                    onClick={() => openProduct(product)}
                    style={{ cursor: "pointer" }}
                  >

                    <div className="product-image-container">

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />

                    </div>

                    <div className="product-details">

                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-bottom">

                        <strong>
                          ₹{product.price}
                        </strong>

                        <button
                          className="add-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(product.id);
                          }}
                        >
                          Add +
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>
            )}

          </section>

        </main>
      )}

      {/* PRODUCT DETAILS */}

      {view === "product" && selectedProduct && (
        <main className="page-container">

          <button
            className="primary-button"
            onClick={backToProducts}
          >
            ← Back to Products
          </button>

          <div className="product-detail-page">

            <div className="product-detail-image">

              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
              />

            </div>

            <div className="product-detail-info">

              <span className="product-category">
                {selectedProduct.category}
              </span>

              <h1>
                {selectedProduct.name}
              </h1>

              <p className="product-detail-description">
                {selectedProduct.description}
              </p>

              <h2 className="product-detail-price">
                ₹{selectedProduct.price}
              </h2>

              <p>
                <strong>Stock:</strong>{" "}
                {selectedProduct.stock ?? "Available"}
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  addToCart(selectedProduct.id)
                }
              >
                🛒 Add to Cart
              </button>

            </div>

          </div>

        </main>
      )}

      {/* CART */}

      {view === "cart" && (
        <main className="page-container cart-page">

          <div className="cart-header">

            <div>
              <p className="section-label">
                SHOPPING CART
              </p>

              <h2>
                Your Cart
              </h2>
            </div>

            <span className="cart-item-count">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>

          </div>

          {!cart.length ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Add some products to your cart to see them here.
              </p>

              <button
                className="primary-button"
                onClick={() => setView("home")}
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="cart-layout">

              <div className="cart-items">

                {cartItems.map((item) => {

                  const product = item.product;

                  if (!product) {
                    return null;
                  }

                  const itemTotal =
                    Number(product.price) *
                    Number(item.quantity);

                  return (
                    <div
                      className="cart-product-card"
                      key={item.id}
                    >

                      <div className="cart-product-image">

                        <img
                          src={product.imageUrl}
                          alt={product.name}
                        />

                      </div>

                      <div className="cart-product-info">

                        <span className="product-category">
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <span className="cart-quantity">
                          Quantity: {item.quantity}
                        </span>

                      </div>

                      <div className="cart-product-total">

                        <strong>
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </strong>

                        <button
                          className="remove-button"
                          onClick={() =>
                            removeFromCart(product.id)
                          }
                        >
                          ❌ Remove
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="cart-summary">

                <h3>
                  Order Summary
                </h3>

                <div className="summary-row">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>

                <hr />

                <div className="summary-total">

                  <strong>
                    Total
                  </strong>

                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>

                </div>

                <button
                  className="primary-button checkout-button"
                  onClick={checkout}
                >
                  Place Order
                </button>

                <button
                  className="continue-shopping-button"
                  onClick={() => setView("home")}
                >
                  ← Continue Shopping
                </button>

              </div>

            </div>

          )}

        </main>
      )}

      {/* LOGIN */}

      {view === "login" && (
        <Auth
          type="login"
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            setView("home");
          }}
          onRegister={() => {
            setView("register");
          }}
        />
      )}

      {/* REGISTER */}

      {view === "register" && (
        <Auth
          type="register"
          onSuccess={(registeredUser) => {
            setUser(registeredUser);
            setView("home");
          }}
          onLogin={() => {
            setView("login");
          }}
        />
      )}

      {/* ORDERS */}

      {view === "orders" && (
        <Orders token={token} />
      )}

    </div>
  );
}


/* =========================
   LOGIN / REGISTER
========================= */

function Auth({
  type,
  onSuccess,
  onRegister,
  onLogin,
}) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function submit(event) {

    event.preventDefault();

    try {

      const url =
        type === "login"
          ? `${API}/auth/login`
          : `${API}/auth/register`;

      const body =
        type === "login"
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
            };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          data.error ||
          "Request failed"
        );

        return;
      }

      localStorage.setItem(
        "shoporaUser",
        JSON.stringify(data)
      );

      onSuccess(data);

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      alert(
        "Unable to connect to the server. Make sure the backend is running."
      );
    }
  }

  return (
    <main className="auth-page">

      <form
        className="auth-form"
        onSubmit={submit}
      >

        <h2>
          {type === "login"
            ? "Welcome Back"
            : "Create Account"}
        </h2>

        {type === "register" && (
          <input
            type="text"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          minLength="6"
          required
          value={form.password}
          onChange={(event) =>
            setForm({
              ...form,
              password: event.target.value,
            })
          }
        />

        <button
          className="primary-button"
          type="submit"
        >
          {type === "login"
            ? "Login"
            : "Register"}
        </button>

        {type === "login" && (
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => onRegister()}
          >
            Create an account
          </button>
        )}

        {type === "register" && (
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => onLogin()}
          >
            Already have an account? Login
          </button>
        )}

      </form>

    </main>
  );
}


/* =========================
   ORDERS
========================= */

function Orders({ token }) {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    if (!token) {
      setOrders([]);
      return;
    }

    fetch(`${API}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(setOrders)
      .catch((error) =>
        console.error(
          "Orders error:",
          error
        )
      );

  }, [token]);

  return (
    <main className="page-container orders-page">

      <div className="orders-header">

        <div>
          <p className="section-label">
            ORDER HISTORY
          </p>

          <h2>
            My Orders
          </h2>
        </div>

        <span className="orders-count">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>

      </div>

      {orders.length === 0 ? (

        <div className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h3>
            No orders yet
          </h3>

          <p>
            Your completed orders will appear here.
          </p>

          <button
            className="primary-button"
            onClick={() => setView("home")}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-card-top">

                <div>

                  <span className="order-label">
                    ORDER
                  </span>

                  <h3>
                    Order #{order.id}
                  </h3>

                </div>

                <span className="order-status">
                  {order.status || "PLACED"}
                </span>

              </div>

              <div className="order-divider" />

              <div className="order-information">

                <div className="order-info-item">

                  <span>
                    📅
                  </span>

                  <div>
                    <small>
                      Order Date
                    </small>

                    <strong>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </strong>
                  </div>

                </div>

                <div className="order-info-item">

                  <span>
                    🕐
                  </span>

                  <div>
                    <small>
                      Time
                    </small>

                    <strong>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </strong>
                  </div>

                </div>

                <div className="order-info-item">

                  <span>
                    💰
                  </span>

                  <div>
                    <small>
                      Total Amount
                    </small>

                    <strong>
                      ₹{Number(
                        order.total || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="order-divider" />

              <div className="order-footer">

                <span>
                  Thank you for shopping with Shopora ❤️
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default App;