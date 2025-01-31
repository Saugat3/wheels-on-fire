const dynamicContent = document.getElementById('dynamic-content');
const appointmentAPI_URL = 'http://localhost:3000/api/appointments'; // API endpoint for appointments

// Function to load the appointments table
async function loadAppointmentsSection() {
    dynamicContent.innerHTML = '<p>Loading appointments...</p>';
    try {
        const response = await fetch(appointmentAPI_URL);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();
        renderAppointmentsTable(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        dynamicContent.innerHTML = '<p>Failed to load appointments. Please try again later.</p>';
    }
}

// Function to render the appointments table
function renderAppointmentsTable(appointments) {
    dynamicContent.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('appointments-table');

    // Create table headers
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Vehicle</th>
        <th>Mechanic</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>Actions</th>
    `;
    table.appendChild(headerRow);

    // Add rows for each appointment
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.vehicleCompany} ${appointment.vehicleModel}</td>
            <td>${appointment.mechanic}</td>
            <td>${new Date(appointment.appointmentDate).toLocaleDateString()}</td>
            <td>${appointment.appointmentTime}</td>
            <td>
                <select class="status-dropdown" data-id="${appointment._id}">
                    <option value="Pending" ${appointment.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${appointment.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${appointment.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${appointment.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteAppointment('${appointment._id}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });

    dynamicContent.appendChild(table); // Append the table to the dynamic content area
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
