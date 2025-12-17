// ===================================
// Organic Farm Website - Main JavaScript
// ===================================

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Shopping Cart
const cart = {
    items: [],
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateCart();
        this.saveCart();
    },
    
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
        this.saveCart();
    },
    
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.updateCart();
            this.saveCart();
        }
    },
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    updateCart() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const count = this.getItemCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        
        if (document.querySelector('.cart-items')) {
            this.renderCart();
        }
    },
    
    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
            if (cartTotal) {
                cartTotal.innerHTML = '<p style="text-align: center; font-size: 1.2rem; font-weight: 600;">Total: $0.00</p>';
            }
            return;
        }
        
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" style="padding: 2px 8px; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" style="padding: 2px 8px; cursor: pointer;">+</button>
                    </div>
                </div>
                <button onclick="cart.removeItem(${item.id})" style="background: none; border: none; color: red; cursor: pointer; font-size: 1.2rem;">×</button>
            </div>
        `).join('');
        
        if (cartTotal) {
            cartTotal.innerHTML = `
                <h3>Total: $${this.getTotal().toFixed(2)}</h3>
                <button class="btn btn-primary" onclick="checkout()" style="width: 100%; margin-top: 1rem;">Proceed to Checkout</button>
            `;
        }
    },
    
    saveCart() {
        localStorage.setItem('farmCart', JSON.stringify(this.items));
    },
    
    loadCart() {
        const saved = localStorage.getItem('farmCart');
        if (saved) {
            this.items = JSON.parse(saved);
            this.updateCart();
        }
    }
};

// Initialize cart
cart.loadCart();

// Cart Sidebar Toggle
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.close-cart');

if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartSidebar?.classList.add('active');
        overlay?.classList.add('active');
        cart.renderCart();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        overlay?.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// Add to Cart Buttons
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: parseInt(this.dataset.productId || Math.random() * 10000),
                name: productCard.querySelector('.product-name')?.textContent || 'Product',
                price: parseFloat(productCard.querySelector('.product-price')?.textContent.replace('$', '') || 0),
                image: productCard.querySelector('.product-image')?.src || ''
            };
            
            cart.addItem(product);
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#8bc34a';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1000);
        });
    });
});

// Form Handling
function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Basic validation
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (isValid) {
        // In a real application, this would send data to a server
        alert(`Thank you! Your ${formType} has been submitted. We'll get back to you soon.`);
        form.reset();
    } else {
        alert('Please fill in all required fields.');
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

// Checkout Function
function checkout() {
    if (cart.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Export cart for use in other scripts
window.cart = cart;

