document.addEventListener("DOMContentLoaded", () => {
    console.log("Wheels On Fire - Mechanics page loaded");
    initializePage();
});

function initializePage() {
    // Button event listeners
    setupButtonInteractions();
    
    // Overlay functionality
    setupOverlays();
    
    // Load mechanics data
    loadMechanicsData();
}

// Button interactions
function setupButtonInteractions() {
    const bookServiceBtn = document.getElementById("bookServiceButton");
    if (bookServiceBtn) {
        bookServiceBtn.addEventListener("click", () => {
            window.location.href = "services.html";
        });
    }
}

// Overlay functionality
function setupOverlays() {
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', closeOverlays);
    });

    // Click outside to close
    window.addEventListener('click', function(event) {
        const loginOverlay = document.getElementById('login-overlay');
        const signupOverlay = document.getElementById('signup-overlay');
        
        if (event.target === loginOverlay || event.target === signupOverlay) {
            closeOverlays();
        }
    });
}

function toggleOverlay(type) {
    const loginOverlay = document.getElementById('login-overlay');
    const signupOverlay = document.getElementById('signup-overlay');

    // Hide both first
    loginOverlay.style.display = 'none';
    signupOverlay.style.display = 'none';

    // Show the requested overlay
    if (type === 'login') {
        loginOverlay.style.display = 'flex';
    } else if (type === 'signup') {
        signupOverlay.style.display = 'flex';
    }
}

function closeOverlays() {
    const loginOverlay = document.getElementById('login-overlay');
    const signupOverlay = document.getElementById('signup-overlay');
    
    loginOverlay.style.display = 'none';
    signupOverlay.style.display = 'none';
}

function togglePassword(type) {
    const config = {
        'login': {
            field: 'login-password',
            icon: 'login-eye'
        },
        'signup': {
            field: 'signup-password',
            icon: 'signup-eye'
        },
        'signup-confirm': {
            field: 'signup-confirm-password',
            icon: 'signup-confirm-eye'
        }
    };

    const { field, icon } = config[type] || {};
    if (!field || !icon) return;

    const passwordField = document.getElementById(field);
    const eyeIcon = document.getElementById(icon);

    if (passwordField && eyeIcon) {
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        eyeIcon.classList.toggle('fa-eye-slash', isPassword);
        eyeIcon.classList.toggle('fa-eye', !isPassword);
    }
}

// Mechanics data loading
async function loadMechanicsData() {
    const mechanicsContainer = document.getElementById("mechanics-container");
    if (!mechanicsContainer) return;

    try {
        mechanicsContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        const response = await fetch("http://localhost:3000/api/mechanics");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const mechanics = await response.json();
        
        if (!mechanics || !Array.isArray(mechanics)) {
            throw new Error("Invalid data format received");
        }

        renderMechanics(mechanics);
    } catch (error) {
        console.error("Error loading mechanics:", error);
        mechanicsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load mechanics at this time. Please try again later.</p>
            </div>
        `;
    }
}

function renderMechanics(mechanics) {
    const mechanicsContainer = document.getElementById("mechanics-container");
    
    mechanicsContainer.innerHTML = mechanics.map(mechanic => `
        <div class="mechanic-card">
            <div class="mechanic-photo-container">
                <img src="http://localhost:3000/${mechanic.photo}" alt="${mechanic.name}" class="mechanic-photo">
                ${mechanic.certified ? '<div class="mechanic-badge">Certified</div>' : ''}
            </div>
            <div class="mechanic-info">
                <h3>${mechanic.name}</h3>
                <div class="mechanic-specialty">
                    <i class="fas fa-wrench"></i>
                    <span>${mechanic.specialization}</span>
                </div>
                <div class="mechanic-experience">
                    <i class="fas fa-clock"></i>
                    <span>${mechanic.experience}   years experience</span>
                </div>
                ${mechanic.rating ? `
                <div class="mechanic-rating">
                    ${renderRatingStars(mechanic.rating)}
                    <span>${mechanic.rating.toFixed(1)} (${mechanic.reviewCount || 0} reviews)</span>
                </div>` : ''}
                <div class="mechanic-bio">
                    <p>${mechanic.description}</p>
                </div>
               
            </div>
        </div>
    `).join("");

   
}

function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

