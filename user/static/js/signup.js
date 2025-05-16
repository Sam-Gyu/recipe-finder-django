document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('id_username').value;
        const email = document.getElementById('id_email').value;
        const password = document.getElementById('id_password1').value;
        const password2 = document.getElementById('id_password2').value;
        const is_admin = document.getElementById('id_is_admin').checked;

        const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (!username || !email || !password || !password2) {
            alert('Please fill out all fields.');
            return;
        }

        if (password !== password2) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        

        if (!/\d/.test(password)) {
            alert('Password must contain at least one number.');
            return;
        }

        fetch('/ajax-signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                is_admin: is_admin
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect_url;
            } else {
                alert(data.message || 'Signup failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during signup. Please try again.');
        });
    });
});
