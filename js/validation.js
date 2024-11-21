document.addEventListener('DOMContentLoaded', function() {
    // Get form and input elements
    const form = document.getElementById('contactForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');

    // Sanitization function to prevent XSS and SQL Injection
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/[;`]/g, '');
    }

    // Debounce function to limit validation frequency
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Validate input field
    function validateField(input) {
        const value = input.value.trim();
        const errorContainer = input.nextElementSibling;
        let errorMessage = '';

        switch(input.id) {
            case 'username':
                if (value.length === 0) {
                    errorMessage = 'Username is required.';
                } else if (value.length < 3) {
                    errorMessage = 'Username must be at least 3 characters.';
                } else if (value.length > 16) {
                    errorMessage = 'Username cannot exceed 16 characters.';
                } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    errorMessage = 'Username can only contain letters, numbers, underscores, and hyphens.';
                }
                break;
            
            case 'email':
                if (value.length === 0) {
                    errorMessage = 'Email is required.';
                } else {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address.';
                    } else if (value.length > 100) {
                        errorMessage = 'Email address is too long.';
                    }
                }
                break;
        }

        // Display error message
        errorContainer.textContent = errorMessage;
        
        // Styling for valid/invalid inputs
        if (errorMessage) {
            input.classList.add('border-red-500');
            input.classList.remove('border-green-500');
            errorContainer.classList.add('text-red-600');
            errorContainer.classList.remove('text-green-600');
            return false;
        } else {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
            errorContainer.textContent = 'Valid input';
            errorContainer.classList.remove('text-red-600');
            errorContainer.classList.add('text-green-600');
            return true;
        }
    }

    // Real-time validation for inputs
    [usernameInput, emailInput].forEach(input => {
        input.addEventListener('input', debounce(function() {
            validateField(this);
        }, 300));

        // Blur validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate all fields
        const inputs = [usernameInput, emailInput];
        const isValid = inputs.every(input => validateField(input));

        if (isValid) {
            // Sanitize inputs
            const sanitizedUsername = sanitizeInput(usernameInput.value);
            const sanitizedEmail = sanitizeInput(emailInput.value);

            // Simulated form submission (replace with actual submission logic)
            try {
                console.log('Submitting:', {
                    username: sanitizedUsername,
                    email: sanitizedEmail
                });

                // Show success message
                alert('Registration successful!');
                
                // Reset form
                form.reset();
                
                // Remove validation styling
                inputs.forEach(input => {
                    input.classList.remove('border-green-500', 'border-red-500');
                    const errorContainer = input.nextElementSibling;
                    errorContainer.textContent = '';
                    errorContainer.classList.remove('text-red-600', 'text-green-600');
                });
            } catch (error) {
                // Handle submission error
                alert('Registration failed. Please try again.');
            }
        }
    });
});