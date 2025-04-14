 
        const mechanicAPI_URL = 'http://localhost:3000/api/mechanics'; // Adjust as needed
        const dynamicContent = document.getElementById('dynamic-content');
        const mechanicModal = document.getElementById('mechanicModal');

        // Navigation logic for Mechanics section
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.addEventListener('click', () => {
                document.querySelector('.nav-item.active').classList.remove('active');
                navItem.classList.add('active');
                const pageTitle = document.getElementById('page-title');
                pageTitle.textContent = navItem.textContent.trim();
                const page = navItem.getAttribute('data-page');
                if (page === 'mechanics') {
                    loadMechanicsSection();
                } else {
                    dynamicContent.innerHTML = `<p>${page} content goes here.</p>`;
                }
            });
        });

        // Load Mechanics Section
        async function loadMechanicsSection() {
            dynamicContent.innerHTML = '<p>Loading mechanics...</p>';
            try {
                const response = await fetch(mechanicAPI_URL);
                if (!response.ok) throw new Error('Failed to fetch mechanics');
                const mechanics = await response.json();
                renderMechanicsCards(mechanics);
            } catch (error) {
                console.error('Error loading mechanics:', error);
                dynamicContent.innerHTML = '<p>Failed to load mechanics. Please try again later.</p>';
            }
        }

 // Render Mechanics Cards with enhanced styling
function renderMechanicsCards(mechanics) {
    dynamicContent.innerHTML = ''; // Clear existing content

    // Create and style the "Add New Mechanic" button
    const addMechanicBtn = document.createElement('button');
    addMechanicBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Mechanic';
    addMechanicBtn.classList.add('add-mechanic-btn');
    addMechanicBtn.addEventListener('click', () => {
        document.getElementById('mechanicModal').style.display = 'flex';
    });
    dynamicContent.appendChild(addMechanicBtn);

    // Create cards container with grid layout
    const mechanicsGrid = document.createElement('div');
    mechanicsGrid.classList.add('mechanics-grid');

    mechanics.forEach(mechanic => {
        const card = document.createElement('div');
        card.classList.add('mechanic-card');
        
        card.innerHTML = `
            <div class="card-header">
                <img src="http://localhost:3000/${mechanic.photo}" alt="${mechanic.name}" class="mechanic-photo">
                <h3 class="mechanic-name">${mechanic.name}</h3>
                <span class="specialization-badge">${mechanic.specialization}</span>
            </div>
            <div class="card-body">
                <div class="mechanic-info">
                    <p><i class="fas fa-star"></i> <strong>Experience:</strong> ${mechanic.experience} years</p>
                    <p><i class="fas fa-info-circle"></i> <strong>About:</strong> <br>${mechanic.description}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editMechanic('${mechanic._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteMechanic('${mechanic._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        mechanicsGrid.appendChild(card);
    });

    dynamicContent.appendChild(mechanicsGrid);
}

// Edit Mechanic
async function editMechanic(id) {
    try {
        const response = await fetch(mechanicAPI_URL + `/${id}`);
        if (!response.ok) throw new Error('Failed to fetch mechanic data');
        const mechanic = await response.json();

        // Prefill the form with mechanic details
        document.getElementById('mechanicName').value = mechanic.name;
        document.getElementById('specialization').value = mechanic.specialization;
        document.getElementById('experience').value = mechanic.experience;
        document.getElementById('description').value = mechanic.description;

        // Store existing photo in a hidden input
        document.getElementById('existingPhoto').value = mechanic.photo;

        // Show existing photo preview
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.src = `http://localhost:3000/${mechanic.photo}`;
        photoPreview.style.display = 'block';

        // Handle form submission
        document.getElementById('mechanicForm').onsubmit = async (event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.append('name', document.getElementById('mechanicName').value);
            formData.append('specialization', document.getElementById('specialization').value);
            formData.append('experience', document.getElementById('experience').value);
            formData.append('description', document.getElementById('description').value);

            const photoInput = document.getElementById('photo').files[0];
            if (photoInput) {
                formData.append('photo', photoInput); // Add new photo if uploaded
            } else {
                formData.append('existingPhoto', document.getElementById('existingPhoto').value); // Keep old photo
            }

            try {
                const updateResponse = await fetch(mechanicAPI_URL + `/${id}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (!updateResponse.ok) throw new Error('Failed to update mechanic');
                alert('Mechanic updated successfully!');
                closeMechanicModal();
                loadMechanicsSection(); // Refresh the mechanics list
            } catch (error) {
                console.error('Error updating mechanic:', error);
                alert('Failed to update mechanic. Please try again.');
            }
        };

        // Show the modal for editing the mechanic
        mechanicModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching mechanic details:', error);
        alert('Failed to load mechanic details for editing.');
    }
}


        // Close Mechanic Modal
        function closeMechanicModal() {
            mechanicModal.style.display = 'none';
        }

        // Add Mechanic Form Submission
        document.getElementById('mechanicForm').onsubmit = async (event) => {
            event.preventDefault();
            const name = document.getElementById('mechanicName').value;
            const specialization = document.getElementById('specialization').value;
            const photo = document.getElementById('photo').files[0];
            const experience = document.getElementById('experience').value;
            const description = document.getElementById('description').value;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('specialization', specialization);
            formData.append('photo', photo);
            formData.append('experience', experience);
            formData.append('description', description);

            try {
                const response = await fetch(mechanicAPI_URL + '/add', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Failed to add mechanic');
                alert('Mechanic added successfully!');
                closeMechanicModal();
                loadMechanicsSection(); // Refresh mechanics cards
            } catch (error) {
                console.error('Error adding mechanic:', error);
                alert('Failed to add mechanic. Please try again.');
            }
        };

        // Delete Mechanic
        async function deleteMechanic(id) {
            try {
                const response = await fetch(mechanicAPI_URL + `/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete mechanic');
                alert('Mechanic deleted successfully!');
                loadMechanicsSection(); // Refresh mechanics list after deletion
            } catch (error) {
                console.error('Error deleting mechanic:', error);
                alert('Failed to delete mechanic. Please try again.');
            }
        }

        // Automatically load mechanics section on page load
        document.addEventListener('DOMContentLoaded', () => {
            const activeSection = document.querySelector('.nav-item.active').getAttribute('data-page');
            if (activeSection === 'mechanics') {
                loadMechanicsSection();
            }
        });