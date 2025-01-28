
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully!");
});
function generateTimeSlots() {
    const timeSlots = [
        "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
        "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ];  // List of time slots (you can modify this)

    const timeSelect = document.getElementById("appointment-time");

    // Clear any existing options in the select element
    timeSelect.innerHTML = '<option value="">Select a Time Slot</option>';

    // Loop through the time slots and create <option> elements
    timeSlots.forEach(function(time) {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

// Call the function to populate the time slots when the page loads
document.addEventListener("DOMContentLoaded", function() {
    generateTimeSlots();
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


// Check if the user is logged in by validating the token
function isLoggedIn() {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    return !!token; // Return true if token exists, false otherwise
}

// Handle service card click
function handleCardClick(serviceName) {
    console.log("Card clicked: ", serviceName); // Check if this gets logged

    if (isLoggedIn()) {
        // User is logged in, open the booking modal
        openBookingModal(serviceName);
    } else {
        // User is not logged in, show SweetAlert prompt for login
        Swal.fire({
            title: 'Login Required',
            text: 'Please log in to book a service.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Login Now',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            buttonsStyling: false // Disable default SweetAlert styles for buttons
        }).then((result) => {
            if (result.isConfirmed) {
                // Open the login overlay or redirect to login page
                toggleOverlay('login'); // Replace with your login modal function or logic
            }
        });
    }
}



// Open the booking modal and populate fields
async function openBookingModal(serviceName) {
    const modal = document.querySelector(".booking-modal");
    const serviceField = document.getElementById("service-name");

    serviceField.textContent = `Service: ${serviceName}`; // Set the service name


    modal.style.display = "block"; // Show modal
}

// Close the booking modal
function closeBookingModal() {
    document.querySelector(".booking-modal").style.display = "none";
}

// Close modal if the user clicks outside the modal
window.onclick = function (event) {
    const modal = document.querySelector(".booking-modal");
    if (event.target == modal) {
        closeBookingModal();
    }
};

// Handle booking form submission
function submitBookingForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Handle form data submission here
    console.log("Booking form submitted.");
    closeBookingModal();
}
