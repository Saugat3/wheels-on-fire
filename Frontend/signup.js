document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("#signup-overlay form");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const formData = {
            firstName: document.querySelector("#first-name").value,
            lastName: document.querySelector("#last-name").value,
            email: document.querySelector("#signup-email").value,
            phoneNumber: document.querySelector("#signup-phone").value,
            address: document.querySelector("#signup-address").value,
            password: document.querySelector("#signup-password").value,
            confirmPassword: document.querySelector("#signup-confirm-password").value,
        };

        try {
            // Send a POST request to the backend
            const response = await fetch("http://localhost:3000/api/signup", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Parse response
            const responseData = await response.json();

            if (!response.ok) {
                // Display validation or server error messages
                if (responseData.errors) {
                    // Display validation errors properly with SweetAlert2
                    const errorMessages = responseData.errors.map(error => error.message).join("\n- ");
                    Swal.fire({
                        title: 'Validation Errors',
                        text: errorMessages,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                } else if (responseData.error) {
                    Swal.fire({
                        title: 'Error',
                        text: responseData.error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                } else {
                    Swal.fire({
                        title: 'Unknown Error',
                        text: "An unknown error occurred. Please try again.",
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#1A73E8'
                    });
                }
                return;
            }

            // Display success message using SweetAlert2
            Swal.fire({
                title: 'Success!',
                text: responseData.message || "User created successfully!",
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1A73E8'
            }).then(() => {
                // Reset the form fields after success
                signupForm.reset(); // This resets all fields to their initial values (empty for text fields)

                // Optionally, reset visibility toggles for password fields
                const passwordEyeIcon = document.getElementById('signup-eye');
                const confirmPasswordEyeIcon = document.getElementById('signup-confirm-eye');
                if (passwordEyeIcon) {
                    passwordEyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
                    document.getElementById('signup-password').type = 'password';
                }
                if (confirmPasswordEyeIcon) {
                    confirmPasswordEyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
                    document.getElementById('signup-confirm-password').type = 'password';
                }

                // Optionally, close the overlay after successful signup
                toggleOverlay('login');
            });
        } catch (error) {
            console.error("Error during signup:", error);
            Swal.fire({
                title: 'Unexpected Error',
                text: "An unexpected error occurred. Please try again later.",
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1A73E8'
            });
        }
    });
});