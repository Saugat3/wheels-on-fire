document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    loadUserProfile();
    loadUserAppointments();

    // Navigation tabs
    document.querySelectorAll('.profile-nav a').forEach(link => {
        if (link.id !== 'logout-btn') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.profile-nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                document.getElementById(`${link.dataset.section}-section`).classList.add('active');
            });
        }
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    });

    // Change to profile update modal
    const profileModal = document.getElementById('profile-modal');
    document.getElementById('update-profile-btn').addEventListener('click', () => {
        // Pre-fill the form with current user data
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:3000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(user => {
            document.getElementById('first-name').value = user.firstName;
            document.getElementById('last-name').value = user.lastName;
            document.getElementById('phone-number').value = user.phoneNumber;
            document.getElementById('address').value = user.address;
            profileModal.style.display = 'flex';
        });
    });
    
    // Remove the change password button since it's now part of profile update
    document.getElementById('change-password-btn').remove();

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    
});

// Update the loadUserProfile function
async function loadUserProfile() {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
        const user = await response.json();
        
      
        
        // Update details section
        document.getElementById('full-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('user-email-detail').textContent = user.email;
        document.getElementById('user-phone').textContent = user.phoneNumber || 'Not provided';
        document.getElementById('user-address').textContent = user.address || 'Not provided';
        
    } catch (error) {
        console.error('Error loading profile:', error);
        Swal.fire('Error', 'Failed to load profile data', 'error');
    }
}

// Load user appointments
async function loadUserAppointments(filter = 'all') {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/appointments?user=${userId}&filter=${filter}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load appointments');
        
        const appointments = await response.json();
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments found</p>';
            return;
        }
        
        appointments.forEach(appointment => {
            const appointmentCard = document.createElement('div');
            appointmentCard.className = 'appointment-card';
            
            // Format date
            const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Determine status class
            let statusClass = '';
            if (appointment.status === 'Pending') statusClass = 'status-pending';
            else if (appointment.status === 'Completed') statusClass = 'status-completed';
            else if (appointment.status === 'Cancelled') statusClass = 'status-cancelled';
            
            appointmentCard.innerHTML = `
                <div class="appointment-header">
                    <div class="appointment-title">${appointment.serviceName}</div>
                    <div class="appointment-status ${statusClass}">${appointment.status}</div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-detail">
                        <strong>Date:</strong> ${appointmentDate}
                    </div>
                    <div class="appointment-detail">
                        <strong>Time:</strong> ${appointment.appointmentTime}
                    </div>
                    <div class="appointment-detail">
                        <strong>Mechanic:</strong> ${appointment.mechanic || 'Not assigned'}
                    </div>
                    <div class="appointment-detail">
                        <strong>Vehicle:</strong> ${appointment.vehicleCompany} ${appointment.vehicleModel}
                    </div>
                </div>
                <div class="appointment-actions">
                    ${appointment.status === 'Pending' ? `
                        <button class="cancel-btn" onclick="cancelAppointment('${appointment._id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="reschedule-btn" onclick="rescheduleAppointment('${appointment._id}')">
                            <i class="fas fa-calendar-alt"></i> Reschedule
                        </button>
                    ` : ''}
                </div>
            `;
            
            appointmentsList.appendChild(appointmentCard);
        });
        
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-list').innerHTML = '<p>Failed to load appointments</p>';
    }
}

// Cancel appointment
async function cancelAppointment(appointmentId) {
    try {
        const result = await Swal.fire({
            title: 'Cancel Appointment?',
            text: 'Are you sure you want to cancel this appointment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it'
        });
        
        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to cancel appointment');
            
            Swal.fire('Cancelled', 'Your appointment has been cancelled', 'success');
            loadUserAppointments();
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        Swal.fire('Error', 'Failed to cancel appointment', 'error');
    }
}

// Reschedule appointment
function rescheduleAppointment(appointmentId) {
    // Implement rescheduling logic
    Swal.fire('Info', 'Rescheduling functionality will be added soon', 'info');
}

// Add profile form submission handler
document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Check if new password is provided but doesn't match confirmation
    if (newPassword && newPassword !== confirmPassword) {
        Swal.fire('Error', 'New passwords do not match', 'error');
        return;
    }
    
    // Check if changing password but didn't provide current password
    if (newPassword && !currentPassword) {
        Swal.fire('Error', 'Please enter your current password to change password', 'error');
        return;
    }
    
    try {
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phoneNumber: document.getElementById('phone-number').value,
            address: document.getElementById('address').value
        };
        
        // Only add password fields if they're being changed
        if (newPassword) {
            formData.currentPassword = currentPassword;
            formData.newPassword = newPassword;
        }
        
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }
        
        Swal.fire('Success', 'Profile updated successfully', 'success');
        document.getElementById('profile-modal').style.display = 'none';
        loadUserProfile(); // Refresh the profile data
        
    } catch (error) {
        console.error('Error updating profile:', error);
        Swal.fire('Error', error.message || 'Failed to update profile', 'error');
    }
});