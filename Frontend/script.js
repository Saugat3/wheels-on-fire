
        // Function to open login, signup, or verification overlay
        function toggleOverlay(type) {
            const loginOverlay = document.getElementById('login-overlay');
            const signupOverlay = document.getElementById('signup-overlay');
            const verificationOverlay = document.getElementById('verification-overlay');

            // Hide all overlays first
            loginOverlay.style.display = 'none';
            signupOverlay.style.display = 'none';
            verificationOverlay.style.display = 'none';

            // Show the appropriate overlay based on the type
            if (type === 'login') {
                loginOverlay.style.display = 'flex';
            } else if (type === 'signup') {
                signupOverlay.style.display = 'flex';
            } else if (type === 'verification') {
                verificationOverlay.style.display = 'flex';
            }
        }

        // Close overlay function to hide both login, signup, and verification overlays
        function closeOverlays() {
            const loginOverlay = document.getElementById('login-overlay');
            const signupOverlay = document.getElementById('signup-overlay');
            const verificationOverlay = document.getElementById('verification-overlay');
            
            loginOverlay.style.display = 'none';
            signupOverlay.style.display = 'none';
            verificationOverlay.style.display = 'none';
        }

        // Function to toggle password visibility for login/signup
        function togglePassword(type) {
            let passwordField, eyeIcon;
            
            // For signup password visibility toggle
            if (type === 'signup') {
                passwordField = document.getElementById('signup-password');
                eyeIcon = document.getElementById('signup-eye');
            } 
            // For signup confirm password visibility toggle
            else if (type === 'signup-confirm') {
                passwordField = document.getElementById('signup-confirm-password');
                eyeIcon = document.getElementById('signup-confirm-eye');
            } 
            // For login password visibility toggle
            else if (type === 'login') {
                passwordField = document.getElementById('login-password');
                eyeIcon = document.getElementById('login-eye');
            }

            // Toggle the password field visibility and change the eye icon
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordField.type = 'password';
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        // Add event listeners to close buttons to close the respective overlay
        document.querySelectorAll('.close-btn').forEach(button => {
            button.addEventListener('click', closeOverlays);
        });

        //Close overlays when clicking outside the overlay content
        window.addEventListener('click', function(event) {
            const loginOverlay = document.getElementById('login-overlay');
            const signupOverlay = document.getElementById('signup-overlay');
            const verificationOverlay = document.getElementById('verification-overlay');
            
            // Close the overlay if clicking outside of the overlay content area
            if (event.target === loginOverlay || event.target === signupOverlay || event.target === verificationOverlay) {
                closeOverlays();
            }
        });


        // Create glow element if it doesn't exist
let glow = document.querySelector('.green-glow');
if (!glow) {
    glow = document.createElement('div');
    glow.className = 'green-glow';
    document.body.appendChild(glow);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
    .green-glow {
        position: fixed;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(10, 90, 6, 0.7) 0%, rgba(10, 90, 6, 0) 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: -1;
        filter: blur(20px);
        will-change: transform, opacity;
        left: 0;
        top: 0;
        animation: pulse 2s infinite ease-in-out;
    }
    
    @keyframes pulse {
        0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.95); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.95); }
    }
    `;
    document.head.appendChild(style);
}

// Track mouse position precisely with smooth animation
let lastX = window.innerWidth/2;
let lastY = window.innerHeight/2;

function updateGlowPosition() {
    const dx = lastX - parseFloat(glow.style.left);
    const dy = lastY - parseFloat(glow.style.top);
    
    // Apply smooth movement (remove this if you want instant movement)
    glow.style.left = `${parseFloat(glow.style.left) + dx * 0.1}px`;
    glow.style.top = `${parseFloat(glow.style.top) + dy * 0.1}px`;
    
    requestAnimationFrame(updateGlowPosition);
}

document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
});

// Initialize position
glow.style.left = `${lastX}px`;
glow.style.top = `${lastY}px`;

// Start animation loop
updateGlowPosition();