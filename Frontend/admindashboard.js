const API_URL = 'http://localhost:3000/api/users'; 

document.addEventListener('DOMContentLoaded', () => {
    // Set "Appointments" as the default section
    const activeSection = document.querySelector('.nav-item.active');
    if (!activeSection) {
        // If no section is active, set "Appointments" as the active section by default
        const appointmentsNavItem = document.querySelector('.nav-item[data-page="appointments"]');
        appointmentsNavItem.classList.add('active');
        loadAppointmentsSection();
    } else {
        // If a section is already active, load the corresponding content
        const activePage = activeSection.getAttribute('data-page');
        if (activePage === 'appointments') {
            loadAppointmentsSection();
        }
    }
});

// Navigation logic for the other sections
document.querySelectorAll('.nav-item').forEach(navItem => {
    navItem.addEventListener('click', () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        navItem.classList.add('active');
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = navItem.textContent.trim();
        const page = navItem.getAttribute('data-page');

        // Load content based on active section
        if (page === 'appointments') {
            loadAppointmentsSection();
        } else if (page === 'mechanics') {
            loadMechanicsSection();
        } else if (page === 'users') {
            loadUsersSection();
        } else {
            document.getElementById('dynamic-content').innerHTML = `<p>${page} content goes here.</p>`;
        }
    });
});

// Load Appointments Section
document.addEventListener('DOMContentLoaded', () => {
    // Set "Appointments" as the default section
    const activeSection = document.querySelector('.nav-item.active');
    if (!activeSection) {
        // If no section is active, set "Appointments" as the active section by default
        const appointmentsNavItem = document.querySelector('.nav-item[data-page="appointments"]');
        appointmentsNavItem.classList.add('active');
        loadAppointmentsSection();
    } else {
        // If a section is already active, load the corresponding content
        const activePage = activeSection.getAttribute('data-page');
        if (activePage === 'appointments') {
            loadAppointmentsSection();
        }
    }
});

// Function to load the appointments section
async function loadAppointmentsSection() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = '<p>Loading appointments...</p>'; // Loading indicator

    try {
        const userId = localStorage.getItem('userId'); // Get user ID from local storage
        if (!userId) {
            alert('User not logged in.');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/appointments?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();
        renderAppointmentsTable(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        dynamicContent.innerHTML = '<p>Failed to load appointments. Please try again later.</p>';
    }
}

function renderAppointmentsTable(appointments) {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('appointments-table'); // Add a class for styling

    // Updated headers to show user details
    const headers = ['User Name', 'Service Name', 'Email', 'Phone Number', 'Status', 'Actions'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    appointments.forEach(appointment => {
        const row = document.createElement('tr');

        // Get user details from userDetails field in appointment
        const userDetails = appointment.userDetails; 
        
        row.innerHTML = `
            <td>${userDetails.firstName} ${userDetails.lastName}</td>  <!-- User Name -->
            <td>${appointment.serviceName}</td>
            <td>${userDetails.email}</td>  <!-- User Email -->
            <td>${userDetails.phoneNumber}</td>  <!-- User Phone Number -->
            <td>${appointment.status}</td> <!-- Status -->
            <td>
                <button class="details-btn" onclick='showAppointmentDetails(${JSON.stringify(appointment)})'>Show Details</button>
                <button class="delete-btn" onclick="deleteAppointment('${appointment._id}')">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    dynamicContent.appendChild(table);
}


function showAppointmentDetails(appointment) {
    const modal = document.getElementById('appointmentModal');
    const modalBody = document.getElementById('modal-body');

    // Populate the modal with appointment details
    modalBody.innerHTML = `
        <h5 class="detail-title">Appointment Details</h5>
        <div class="para">
        <p><strong>Service Name:</strong> ${appointment.serviceName}</p>
        <p><strong>User Name:</strong> ${appointment.userDetails.firstName} ${appointment.userDetails.lastName}</p>
        <p><strong>Email:</strong> ${appointment.userDetails.email}</p>
        <p><strong>Phone Number:</strong> ${appointment.userDetails.phoneNumber}</p>
        <p><strong>Appointment Date:</strong> ${appointment.appointmentDate}</p>
        <p><strong>Appointment Time:</strong> ${appointment.appointmentTime}</p>
        <p><strong>Mechanic:</strong> ${appointment.mechanic}</p>
        <p><strong>Status:</strong> ${appointment.status}</p></div>
    `;

    // Display the modal
    modal.style.display = 'block';
}

// Close the modal when clicking on the close button
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('appointmentModal').style.display = 'none';
});

// Close the modal if user clicks outside the modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});



// Function to handle appointment deletion
async function deleteAppointment(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete appointment');
        alert('Appointment deleted successfully!');
        loadAppointmentsSection(); // Reload the appointments section after deletion
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
    }
}


// Function to handle appointment deletion
async function deleteAppointment(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete appointment');
        alert('Appointment deleted successfully!');
        loadAppointmentsSection(); // Reload the appointments section after deletion
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
    }
}

// Event listener for navigation items
document.querySelectorAll('.nav-item').forEach(navItem => {
    navItem.addEventListener('click', () => {
        // Remove active class from the previous active item
        document.querySelector('.nav-item.active').classList.remove('active');
        
        // Add active class to the clicked item
        navItem.classList.add('active');
        
        // Update the page title
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = navItem.textContent.trim();
        
        const page = navItem.getAttribute('data-page');
        
        // Load the appropriate section based on the selected page
        if (page === 'appointments') {
            loadAppointmentsSection();
        } else if (page === 'mechanics') {
            loadMechanicsSection();
        } else if (page === 'users') {
            dynamicContent.innerHTML = `<p>Users content goes here.</p>`;
        }
    });
});

// Automatically load the Appointments section by default on page load
document.addEventListener('DOMContentLoaded', () => {
    // Automatically trigger the "appointments" section
    const defaultPage = 'appointments';
    document.querySelector(`[data-page="${defaultPage}"]`).classList.add('active'); // Make appointments active
    loadAppointmentsSection(); // Load the appointments section
});


// Navigation logic
document.querySelectorAll('.nav-item').forEach(navItem => {
    navItem.addEventListener('click', () => {
        // Update active class
        document.querySelector('.nav-item.active').classList.remove('active');
        navItem.classList.add('active');

        // Update page title
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = navItem.textContent.trim();

        // Load content dynamically
        const page = navItem.getAttribute('data-page');
        if (page === 'users') {
            loadUsersSection();
        } else {
            document.getElementById('dynamic-content').innerHTML = `<p>${page} content goes here.</p>`;
        }
    });
});

// Load Users Section
async function loadUsersSection() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = '<p>Loading users...</p>'; // Loading indicator

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        renderUsersTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
        dynamicContent.innerHTML = '<p>Failed to load users. Please try again later.</p>';
    }
}

// Render Users Table
function renderUsersTable(users) {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = ''; // Clear existing content

    // Create table
    const table = document.createElement('table');
    table.classList.add('user-table'); // Add a class for styling (optional)

    // Create table headers
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Actions'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.role}</td>
            <td>
                <div class="action-buttons">
                    
                    <button class="delete-btn" onclick="deleteUser('${user._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to dynamic content
    dynamicContent.appendChild(table);
}


// Delete User
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');
        alert('User deleted successfully!');
        loadUsersSection(); // Refresh users table
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Automatically load the first section on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeSection = document.querySelector('.nav-item.active').getAttribute('data-page');
    if (activeSection === 'users') {
        loadUsersSection();
    }
});



