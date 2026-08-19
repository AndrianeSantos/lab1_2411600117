document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackDiv = document.getElementById('loginFeedback');

    // Redirect if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }

    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        feedbackDiv.innerHTML = '';

        if (username === '' || password === '') {
            showFeedback('Please enter both student ID/username and password.', 'danger');
            return;
        }

        const validUsername = 'admin';
        const validPassword = 'password123';

        if (username === validUsername && password === validPassword) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', username);

            showFeedback('Login successful! Redirecting to grade portal...', 'success');

            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showFeedback('Invalid credentials. Please use demo account (admin / password123).', 'danger');
        }
    });

    function showFeedback(message, type) {
        const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
        feedbackDiv.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Trigger click on Enter key
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    });
});