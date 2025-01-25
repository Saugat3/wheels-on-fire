 // Check if the user is logged in by validating the token
 function isLoggedIn() {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    return !!token; // Return true if token exists, false otherwise
}

// Handle service card click
function handleCardClick(serviceName) {
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

// Open the booking modal and set the service name
function openBookingModal(serviceName) {
    const modal = document.getElementById('booking-modal');
    const serviceNameField = document.getElementById('service-name');
    
    serviceNameField.textContent = `Service: ${serviceName}`; // Display the chosen service name
    
    modal.style.display = 'block';
}

// Close the booking modal
function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

// Close modal if the user clicks outside the modal
window.onclick = function (event) {
    const modal = document.getElementById('booking-modal');
    if (event.target == modal) {
        closeBookingModal();
    }
};

// Fetch user details using token and user ID from localStorage
async function fetchUserDetails() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");  // Retrieve userId from localStorage
    
    if (!token || !userId) return null;

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,  // Pass token in Authorization header
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user details.");
        }

        return await response.json(); // Assuming the API returns user details
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}

// Open booking modal and populate fields
async function openBookingModal(serviceName) {
    const modal = document.getElementById("booking-modal");
    const serviceField = document.getElementById("service-name");
    const userNameField = document.getElementById("user-name");
    const userEmailField = document.getElementById("user-email");
    const userPhoneField = document.getElementById("user-phone");

    serviceField.textContent = serviceName; // Set the service name

    // Fetch and populate user details using the userId from localStorage
    const userDetails = await fetchUserDetails();
    if (userDetails) {
        userNameField.value = userDetails.firstName + " " + userDetails.lastName || "";
        userEmailField.value = userDetails.email || "";
        userPhoneField.value = userDetails.phoneNumber || "";
    } else {
        Swal.fire({
            title: "Error",
            text: "Could not fetch user details. Please try again later.",
            icon: "error",
            confirmButtonColor: "#1A73E8",
        });
    }

    modal.style.display = "block"; // Show modal
}

// Close the booking modal
function closeBookingModal() {
    document.getElementById("booking-modal").style.display = "none";
}

// Close modal if the user clicks outside the modal
window.onclick = function (event) {
    const modal = document.getElementById("booking-modal");
    if (event.target == modal) {
        closeBookingModal();
    }
};
