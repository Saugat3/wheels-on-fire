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
    table.classList.add('appointments-table');

    // Create table headers
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>User Name</th>
        <th>Service Name</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th>Status</th>
        <th>Actions</th>
    `;
    table.appendChild(headerRow);

    // Add rows for each appointment
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.userDetails.firstName} ${appointment.userDetails.lastName}</td>
            <td>${appointment.serviceName}</td>
            <td>${appointment.userDetails.email}</td>
            <td>${appointment.userDetails.phoneNumber}</td>
            <td>
                <select class="status-dropdown" data-id="${appointment._id}">
                    <option value="Pending" ${appointment.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${appointment.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${appointment.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${appointment.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="details-btn" onclick='showAppointmentDetails(${JSON.stringify(appointment)})'>Details</button>
                <button class="delete-btn" onclick="deleteAppointment('${appointment._id}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });

    dynamicContent.appendChild(table);

    // Add event listeners to all status dropdowns
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', async function() {
            const appointmentId = this.getAttribute('data-id');
            const newStatus = this.value;
            
            try {
                const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) throw new Error('Failed to update status');
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Status Updated',
                    text: `Appointment status changed to ${newStatus}`,
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Optional: Update the UI immediately without reload
                const row = this.closest('tr');
                row.style.backgroundColor = getStatusColor(newStatus);
                
            } catch (error) {
                console.error('Error updating status:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Could not update appointment status'
                });
                // Reset to original value
                this.value = appointment.status;
            }
        });
    });
}

// Helper function for status colors
function getStatusColor(status) {
    switch(status) {
        case 'Pending': return 'rgba(255, 193, 7, 0.1)';
        case 'In Progress': return 'rgba(0, 123, 255, 0.1)';
        case 'Completed': return 'rgba(40, 167, 69, 0.1)';
        case 'Cancelled': return 'rgba(220, 53, 69, 0.1)';
        default: return 'transparent';
    }
}

function showAppointmentDetails(appointment) {
    const modal = document.getElementById('appointmentModal');
    const modalBody = document.getElementById('modal-body');
    
    // Get status class
    const statusClass = appointment.status.toLowerCase().replace(' ', '-');
    
    // Format the date
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create the modal content with all details
    modalBody.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">
                <i class="fas fa-calendar-check"></i>
                Appointment Details
            </h3>
           
        </div>
        
        <div class="modal-content-grid">
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Customer</span>
                    <span class="detail-value">${appointment.userDetails.firstName} ${appointment.userDetails.lastName}</span>
                </div>
            </div>
            
            <div class="detail-card email-card">
                <div class="detail-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Email</span>
                    <span class="detail-value email-value">${appointment.userDetails.email}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${appointment.userDetails.phoneNumber}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-car"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Vehicle</span>
                    <span class="detail-value">${appointment.vehicleCompany} ${appointment.vehicleModel} (${appointment.vehicleYear})</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-id-card"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Plate Number</span>
                    <span class="detail-value">${appointment.vehicleNumber}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-wrench"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Service</span>
                    <span class="detail-value">${appointment.serviceName}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">${appointment.appointmentTime}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-user-cog"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Mechanic</span>
                    <span class="detail-value">${appointment.mechanic}</span>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="detail-info">
                    <span class="detail-label">Status</span>
                    <span class="detail-value status-badge ${statusClass}">${appointment.status}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="modal-btn print-btn" onclick="window.print()">
                <i class="fas fa-print"></i> Print
            </button>
            <button class="modal-btn close-modal-btn">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;

    // Display the modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add event listeners
    document.querySelectorAll('.close-btn, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

function closeModal() {
    const modal = document.getElementById('appointmentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target === modal) {
        closeModal();
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



let usersList = []; // Will store users for dropdown

async function openEmailComposer() {
  // Load users if not already loaded
  if (usersList.length === 0) {
    try {
      const response = await fetch(API_URL);
      usersList = await response.json();
      populateUserDropdown();
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    }
  }
  
  document.getElementById('emailComposerModal').style.display = 'flex';
}

function closeEmailComposer() {
  document.getElementById('emailComposerModal').style.display = 'none';
}

function populateUserDropdown() {
  const select = document.getElementById('userSelect');
  select.innerHTML = '';
  
  usersList.forEach(user => {
    const option = document.createElement('option');
    option.value = user.email;
    option.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
    select.appendChild(option);
  });
}

// Handle recipient type change
document.getElementById('recipientType').addEventListener('change', function() {
  const type = this.value;
  document.getElementById('singleUserGroup').style.display = 
    type === 'single' ? 'block' : 'none';
  document.getElementById('customEmailGroup').style.display = 
    type === 'custom' ? 'block' : 'none';
});

// Handle form submission
document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const type = document.getElementById('recipientType').value;
    let toEmail = '';
    
    if (type === 'single') {
      toEmail = document.getElementById('userSelect').value;
    } else if (type === 'custom') {
      toEmail = document.getElementById('customEmail').value;
    } else if (type === 'all') {
      toEmail = usersList.map(user => user.email).join(',');
    }
    
    const subject = document.getElementById('emailSubject').value;
    const content = document.getElementById('emailContent').value;
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          subject,
          content
        })
      });
      
      // First check if response has content
      const text = await response.text();
      let result = {};
      
      try {
        result = text ? JSON.parse(text) : {};
      } catch (e) {
        console.log('Non-JSON response:', text);
      }
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent',
          text: 'Your email has been sent successfully',
          timer: 2000
        });
        closeEmailComposer();
      } else {
        throw new Error(result.message || text || 'Failed to send email');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
  });