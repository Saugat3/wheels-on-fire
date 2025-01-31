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
async function loadAppointmentsSection() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = '<p>Loading appointments...</p>'; // Loading indicator

    try {
        const response = await fetch('http://localhost:3000/api/appointments');
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();
        renderAppointmentsTable(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        dynamicContent.innerHTML = '<p>Failed to load appointments. Please try again later.</p>';
    }
}


// Attach the event listener to the status dropdown
function renderAppointmentsTable(appointments) {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('appointments-table'); // Add a class for styling (optional)

    const headers = ['Service Name', 'Vehicle Company', 'Vehicle Model', 'Vehicle Year', 'Vehicle Number', 'Appointment Date', 'Appointment Time', 'Mechanic', 'Status', 'Actions'];
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
        
        // Create status dropdown
        const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        const statusSelect = document.createElement('select');
        statusOptions.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (status === appointment.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });

        // Add event listener to handle status change
        statusSelect.addEventListener('change', (event) => {
            handleStatusChange(appointment._id, event.target.value);
        });

        row.innerHTML = `
            <td>${appointment.serviceName}</td>
            <td>${appointment.vehicleCompany}</td>
            <td>${appointment.vehicleModel}</td>
            <td>${appointment.vehicleYear}</td>
            <td>${appointment.vehicleNumber}</td>
            <td>${appointment.appointmentDate}</td>
            <td>${appointment.appointmentTime}</td>
            <td>${appointment.mechanic}</td>
            <td>
                ${statusSelect.outerHTML} <!-- Add dropdown for status -->
            </td>
            <td>
                <button class="delete-btn" onclick="deleteAppointment('${appointment._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    dynamicContent.appendChild(table);
}
// Add event listener to handle status change
function handleStatusChange(appointmentId, newStatus) {
    fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
        method: 'PUT', // Assuming you have a PATCH route to update the status
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Status updated:', data);
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}


// Function to delete an appointment
async function deleteAppointment(id) {
    try {
        const response = await fetch(`${appointmentAPI_URL}/${id}`, {
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
                    <button class="edit-btn" onclick="editUser('${user._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
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

// Edit User: Open Modal and Populate Data
async function editUser(userId) {
    try {
        // Fetch user data from the server
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const user = await response.json();

        // Populate modal form with user data
        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('name').value = `${user.firstName} ${user.lastName}`;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phoneNumber;
        document.getElementById('role').value = user.role;

        // Show the modal
        document.getElementById('userModal').style.display = 'block';

        // Set up the form submission logic
        const userForm = document.getElementById('userForm');
        userForm.onsubmit = async (event) => {
            event.preventDefault(); // Prevent form submission

            const fullName = document.getElementById('name').value.split(' ');
            const firstName = fullName[0];
            const lastName = fullName.slice(1).join(' ');
            const email = document.getElementById('email').value;
            const phoneNumber = document.getElementById('phone').value;
            const role = document.getElementById('role').value;

            const updatedUser = { firstName, lastName, email, phoneNumber, role };

            try {
                const updateResponse = await fetch(`${API_URL}/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!updateResponse.ok) throw new Error('Failed to update user');

                alert('User updated successfully!');
                closeUserModal();
                loadUsersSection(); // Refresh the users table
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Failed to update user. Please try again.');
            }
        };
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        alert('Failed to fetch user data. Please try again.');
    }
}

// Close Modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').onsubmit = null; // Remove previous submission logic
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



