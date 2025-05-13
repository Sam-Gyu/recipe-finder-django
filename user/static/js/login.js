document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        email: this.email.value,
        password: this.password.value,
        is_admin_login: this.adminLogin.checked,
        remember_me: this.rememberMe.checked
    };
    
    fetch('/ajax-login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect_url;
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
