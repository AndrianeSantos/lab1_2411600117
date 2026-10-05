document.addEventListener('DOMContentLoaded', function() {

    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackDiv = document.getElementById('loginFeedback');

    function showFeedback(message, type) {
        if (feedbackDiv) {
            feedbackDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
        }
    }

    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }

    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (feedbackDiv) {
            feedbackDiv.innerHTML = '';
        }

        if (username === '' || password === '') {
            showFeedback('Please enter both username and password.', 'danger');
            return;
        }

        const validUsername = 'admin';
        const validPassword = 'password123';

        if (username === validUsername && password === validPassword) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', username);

            showFeedback('Login successful! Redirecting...', 'success');

            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1000);

        } else {
            showFeedback('Invalid username or password. Please try again.', 'danger');
        }
    });

});