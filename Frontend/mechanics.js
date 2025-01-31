document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully!");
});
// Add a click event listener to the button
document.getElementById("bookServiceButton").addEventListener("click", function() {
    // Redirect to services.html
    window.location.href = "services.html";
  });
 // Function to open login or signup overlay
 function toggleOverlay(type) {
    const loginOverlay = document.getElementById('login-overlay');
    const signupOverlay = document.getElementById('signup-overlay');

    // Hide both overlays first
    loginOverlay.style.display = 'none';
    signupOverlay.style.display = 'none';

    // Show the clicked overlay
    if (type === 'login') {
        loginOverlay.style.display = 'flex';
    } else if (type === 'signup') {
        signupOverlay.style.display = 'flex';
    }
}

// Close overlay function to hide both login and signup overlays
function closeOverlays() {
    const loginOverlay = document.getElementById('login-overlay');
    const signupOverlay = document.getElementById('signup-overlay');
    
    loginOverlay.style.display = 'none';
    signupOverlay.style.display = 'none';
}

// Function to toggle password visibility for login/signup
function togglePassword(type) {
    let passwordField, eyeIcon;
    if (type === 'signup') {
        passwordField = document.getElementById('signup-password');
        eyeIcon = document.getElementById('signup-eye');
    } else if (type === 'signup-confirm') {
        passwordField = document.getElementById('signup-confirm-password');
        eyeIcon = document.getElementById('signup-confirm-eye');
    } else if (type === 'login') {
        passwordField = document.getElementById('login-password');
        eyeIcon = document.getElementById('login-eye');
    }

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

// Optional: Close overlays when clicking outside the overlay content
window.addEventListener('click', function(event) {
    const loginOverlay = document.getElementById('login-overlay');
    const signupOverlay = document.getElementById('signup-overlay');
    
    // Close the overlay if clicking outside of the overlay content area
    if (event.target === loginOverlay || event.target === signupOverlay) {
        closeOverlays();
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3000/api/mechanics"); // Adjust API URL if needed
        const mechanics = await response.json();
        const mechanicsContainer = document.getElementById("mechanics-container");

        mechanicsContainer.innerHTML = mechanics.map(mechanic => `
            <div class="mechanic-card">
                <img src="http://localhost:3000/${mechanic.photo}" alt="${mechanic.name}" class="mechanic-photo">
                <div class="mechanic-info">
                    <h3>${mechanic.name}</h3>
                    <p><strong>Specialization:</strong> ${mechanic.specialization}</p>
                    <p><strong>Experience:</strong> ${mechanic.experience} years</p>
                    <p>${mechanic.description}</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching mechanics:", error);
    }
});