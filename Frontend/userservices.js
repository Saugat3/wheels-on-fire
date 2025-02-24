// Function to fetch mechanics from the backend and populate the dropdown
async function populateMechanicDropdown() {
    try {
        // Fetching mechanics data from the backend
        const response = await fetch('http://localhost:3000/api/mechanics'); // Update the URL to your backend
        const mechanics = await response.json();

        // Get the mechanic dropdown element
        const mechanicSelect = document.getElementById("mechanic");

        // Clear any existing options
        mechanicSelect.innerHTML = '<option value="">Select a Mechanic</option>';

        // Loop through mechanics and create option elements
        mechanics.forEach(mechanic => {
            const option = document.createElement("option");
            // option.value = mechanic._id; // You can use the mechanic's ID as the value
            option.textContent = mechanic.name; // Display mechanic's name in the dropdown
            mechanicSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching mechanics:', error);
        // Optionally show an error message to the user
    }
}

// Call the function to populate the mechanic dropdown when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateMechanicDropdown();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully!");
});
function generateTimeSlots() {
    const timeSlots = [
        "9:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM",
        "1:00 PM - 2:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM",
    ];
     // List of time slots (you can modify this)

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

    // Store the service name in a hidden input field for submission
    document.getElementById('service-name-input').value = serviceName; 

    modal.style.display = "block"; // Show modal
}
async function submitBookingForm(event) {
    event.preventDefault();
    
    // Collect form data
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    // Log formData to ensure it's being collected properly
    console.log('Form Data:', formData);

    const serviceName = formData.get('service-name'); // Get service name from hidden input
    console.log('Service Name:', serviceName); // Check if service name is correctly populated

    if (!serviceName) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a service to book.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal-confirm-btn',
            },
        });
        return;
    }

    const userId = localStorage.getItem('userId'); // Fetch userId from localStorage
    if (!userId) {
        Swal.fire({
            title: 'Error!',
            text: 'User not logged in. Please log in to book a service.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal-confirm-btn',
            },
        });
        return;
    }

    const bookingData = {
        userId: userId, // Add userId to bookingData
        serviceName: serviceName,
        vehicleCompany: formData.get('vehicle-company'),
        vehicleModel: formData.get('vehicle-model'),
        vehicleYear: formData.get('vehicle-year'),
        vehicleNumber: formData.get('vehicle-number'),
        appointmentDate: formData.get('appointment-date'),
        appointmentTime: formData.get('appointment-time'),
        mechanic: formData.get('mechanic'),
    };
    
    console.log('Booking data:', bookingData);

    // Check if any required field is empty
    for (const key in bookingData) {
        if (!bookingData[key]) {
            console.error(`Missing field: ${key}`);
            Swal.fire({
                title: 'Error!',
                text: `Please fill out all fields. Missing: ${key}`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal-confirm-btn',
                },
            });
            return; // Prevent form submission if any field is missing
        }
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/appointments/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Your appointment has been scheduled.',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal-confirm-btn',
                },
            });
            form.reset();
            closeBookingModal();
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'Something went wrong. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal-confirm-btn',
                },
            });
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire({
            title: 'Error!',
            text: 'There was a problem with the request. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal-confirm-btn',
            },
        });
    }
}

function closeBookingModal() {
    const modal = document.querySelector(".booking-modal");
    modal.style.display = "none"; // Hide the modal
}
