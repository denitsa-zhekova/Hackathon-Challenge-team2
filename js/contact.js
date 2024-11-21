document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const errorDiv = document.getElementById('formError');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Sanitization function to prevent XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Get error container for a field
    function getErrorContainer(field) {
        return field.nextElementSibling;
    }

    // Validation function with enhanced checks
    function validateField(field) {
        let errorMessage = '';
        const value = field.value.trim();
        const errorContainer = getErrorContainer(field);
        
        switch(field.id) {
            case 'name':
                if (value.length === 0) {
                    errorMessage = 'Name is required.';
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters.';
                } else if (value.length > 50) {
                    errorMessage = 'Name cannot exceed 50 characters.';
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
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
            
            case 'message':
                if (value.length === 0) {
                    errorMessage = 'Message is required.';
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters.';
                } else if (value.length > 500) {
                    errorMessage = 'Message cannot exceed 500 characters.';
                }
                break;
        }

        // Show or hide error message
        errorContainer.textContent = errorMessage;
        
        // Adds shake animation for errors
        if (errorMessage) {
            field.classList.add('border-red-500');
            errorContainer.classList.add('error-shake');
        } else {
            field.classList.remove('border-red-500');
            errorContainer.classList.remove('error-shake');
        }
        
        return errorMessage;
    }

    // Real-time validation
    ['name', 'email', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        field.addEventListener('input', debounce(function() {
            validateField(this);
        }, 300));
    });

    // Debounce function
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        errorDiv.textContent = '';
        let hasErrors = false;

        // Validate all fields
        const inputs = [nameInput, emailInput, messageInput];
        inputs.forEach(field => {
            const errorMessage = validateField(field);
            if (errorMessage) {
                hasErrors = true;
            }
        });

        if (hasErrors) {
            errorDiv.textContent = 'Please correct the errors before submitting.';
            return;
        }

        // Sanitize inputs before processing
        const sanitizedName = sanitizeInput(nameInput.value);
        const sanitizedEmail = sanitizeInput(emailInput.value);
        const sanitizedMessage = sanitizeInput(messageInput.value);

        // Simulated form submission
        try {

            console.log('Submitting:', {
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage
            });

            alert('Message sent successfully!');
            form.reset();
            
            // Remove validation classes and error messages after reset
            inputs.forEach(field => {
                field.classList.remove('border-red-500');
                const errorContainer = field.nextElementSibling;
                errorContainer.textContent = '';
                errorContainer.classList.remove('error-shake');
            });
        } catch (error) {
            errorDiv.textContent = 'Failed to send message. Please try again.';
        }
    });

    // Add blur validation to catch errors when leaving a field
    ['name', 'email', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
});