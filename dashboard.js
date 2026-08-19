document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const username = localStorage.getItem('user') || 'Student';

    updateGreeting(username);
    updateStatistics();
    populateActivityTable();
    setUpLogout();

    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) {
        userNameSpan.textContent = username;
    }
});

function updateGreeting(username) {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    let timeOfDay = '';

    if (hour >= 5 && hour < 12) {
        timeOfDay = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
        timeOfDay = 'Good Evening';
    } else {
        timeOfDay = 'Good Night';
    }

    greetingElement.textContent = `${timeOfDay}, ${username}!`;
}

function updateStatistics() {
    const stats = [
        { title: 'Overall GPA', value: '3.85', color: 'text-success' },
        { title: 'Active Courses', value: '6 Subjects', color: 'text-primary' },
        { title: 'Pending Tasks', value: '3 Due', color: 'text-warning' },
        { title: 'Attendance Rate', value: '96%', color: 'text-info' }
    ];

    stats.forEach((stat, index) => {
        const titleElement = document.getElementById(`stat${index + 1}-title`);
        const valueElement = document.getElementById(`stat${index + 1}-value`);

        if (titleElement) titleElement.textContent = stat.title;
        if (valueElement) {
            valueElement.textContent = stat.value;
            valueElement.className = `card-text fw-bold ${stat.color}`;
        }
    });
}

function populateActivityTable() {
    const tableBody = document.getElementById('activityTableBody');
    if (!tableBody) return;

    const activities = [
        { date: '2026-08-18 14:30', activity: 'Submitted Lab Exercise 2 (Web Dev)', status: 'success', text: 'Graded (100%)' },
        { date: '2026-08-17 11:00', activity: 'Quiz 1: Database Management Systems', status: 'info', text: 'Graded (92%)' },
        { date: '2026-08-16 09:15', activity: 'Submitted Proposal: Software Engineering', status: 'warning', text: 'Under Review' },
        { date: '2026-08-15 23:59', activity: 'Assignment 3: Data Structures', status: 'danger', text: 'Late Submission' },
        { date: '2026-08-14 10:00', activity: 'Midterm Exam: Network Administration', status: 'success', text: 'Completed' }
    ];

    tableBody.innerHTML = '';

    activities.forEach(item => {
        const row = document.createElement('tr');

        let badgeClass = 'bg-secondary';
        if (item.status === 'success') badgeClass = 'bg-success';
        else if (item.status === 'warning') badgeClass = 'bg-warning text-dark';
        else if (item.status === 'danger') badgeClass = 'bg-danger';
        else if (item.status === 'info') badgeClass = 'bg-info text-dark';

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.activity}</td>
            <td><span class="badge ${badgeClass}">${item.text}</span></td>
        `;

        tableBody.appendChild(row);
    });
}

function setUpLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutLink = document.getElementById('logoutLink');

    function performLogout(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    if (logoutBtn) logoutBtn.addEventListener('click', performLogout);
    if (logoutLink) logoutLink.addEventListener('click', performLogout);
}