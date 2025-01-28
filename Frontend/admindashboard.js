const API_URL = 'http://localhost:3000/api/users'; // Replace with your backend URL

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
