// Courses Data
const coursesData = [
    {
        id: '1',
        title: 'Web Development Bootcamp',
        instructor: 'Sarah Johnson',
        image: 'img/image 1.jpeg',
        rating: 4.9,
        students: 12500,
        duration: '40 hours',
        price: 49.99,
        description: 'Learn web development from scratch to professional level. HTML, CSS, JavaScript, React, Node.js and more.',
        lessons: [
            { id: 1, title: 'Introduction to Web Development', duration: '30 min', video: '#' },
            { id: 2, title: 'HTML Basics', duration: '45 min', video: '#' },
            { id: 3, title: 'Advanced CSS', duration: '60 min', video: '#' },
            { id: 4, title: 'JavaScript Fundamentals', duration: '90 min', video: '#' },
            { id: 5, title: 'React Framework', duration: '120 min', video: '#' }
        ]
    },
    {
        id: '2',
        title: 'Cyper Security',
        instructor: 'Eman Johnson',
        image: 'img/OIP.png',
        rating: 4.9,
        students: 12500,
        duration: '40 hours',
        price: 49.99,
        description: 'Learn cybersecurity fundamentals and how to protect systems and networks from attacks.',
        lessons: [
            { id: 1, title: 'Introduction to Cybersecurity', duration: '30 min', video: '#' },
            { id: 2, title: 'Types of Threats', duration: '45 min', video: '#' },
            { id: 3, title: 'Network Protection', duration: '60 min', video: '#' }
        ]
    },
    {
        id: '3',
        title: 'Data Science',
        instructor: 'Ali Shahein',
        image: 'img/OIP2.png',
        rating: 4.2,
        students: 12500,
        duration: '40 hours',
        price: 49.99,
        description: 'Learn data science using Python, data analysis, Machine Learning and more.',
        lessons: [
            { id: 1, title: 'Introduction to Data Science', duration: '30 min', video: '#' },
            { id: 2, title: 'Python for Data', duration: '45 min', video: '#' },
            { id: 3, title: 'Data Analysis', duration: '60 min', video: '#' }
        ]
    },
    {
        id: '4',
        title: 'UI/UX Design Mastery',
        instructor: 'Michael Chen',
        image: 'img/image 2.jpeg',
        rating: 4.8,
        students: 8300,
        duration: '30 hours',
        price: 39.99,
        description: 'Master user interface and user experience design using the latest tools and techniques.',
        lessons: [
            { id: 1, title: 'Introduction to UI/UX', duration: '30 min', video: '#' },
            { id: 2, title: 'Design Principles', duration: '45 min', video: '#' }
        ]
    },
    {
        id: '5',
        title: 'Data Science with Python',
        instructor: 'Emily Rodriguez',
        image: 'img/image 3.jpeg',
        rating: 4.9,
        students: 15200,
        duration: '50 hours',
        price: 59.99,
        description: 'Comprehensive course in data science using Python.',
        lessons: []
    },
    {
        id: '6',
        title: 'Digital Marketing Strategy',
        instructor: 'Michael Chen',
        image: 'img/image 4.jpeg',
        rating: 4.7,
        students: 9800,
        duration: '25 hours',
        price: 44.99,
        description: 'Learn effective digital marketing strategies.',
        lessons: []
    },
    {
        id: '7',
        title: 'Mobile App Development',
        instructor: 'Lisa Anderson',
        image: 'img/image 5.jpeg',
        rating: 4.8,
        students: 11400,
        duration: '45 hours',
        price: 54.99,
        description: 'Learn mobile application development.',
        lessons: []
    },
    {
        id: '8',
        title: 'Machine Learning Fundamentals',
        instructor: 'James Wilson',
        image: 'img/imge 6.jpeg',
        rating: 4.9,
        students: 13600,
        duration: '55 hours',
        price: 64.99,
        description: 'Learn machine learning and artificial intelligence fundamentals.',
        lessons: []
    }
];

// Get course by ID
function getCourseById(id) {
    return coursesData.find(course => course.id === id);
}

// Display courses
function displayCourses(courses = coursesData) {
    const coursesContainer = document.querySelector('.courses .boxs');
    if (!coursesContainer) return;

    coursesContainer.innerHTML = courses.map(course => `
        <div class="box" data-course-id="${course.id}">
            <div class="img">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <h2>${course.title}</h2>
            <p>by ${course.instructor}</p>
            <div class="signs">
                <i style="color: gold;" class="fa-solid fa-star"></i>
                <span>${course.rating}</span>
                <i class="fa-solid fa-people-line"></i>
                <span>${course.students.toLocaleString()}</span>
                <i class="fa-solid fa-clock"></i>
                <span>${course.duration}</span>
            </div>
            <div class="register">
                <p>$${course.price}</p>
                <button onclick="handleEnroll('${course.id}')">Enroll Now</button>
            </div>
        </div>
    `).join('');

    // Add click event to course
    coursesContainer.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                const courseId = box.dataset.courseId;
                window.location.href = `course.html?id=${courseId}`;
            }
        });
    });
}

// Handle course enrollment
function handleEnroll(courseId) {
    if (!auth.isAuthenticated()) {
        if (confirm('Please login first. Do you want to go to the login page?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const result = auth.enrollInCourse(courseId);
    
    if (result.success) {
        alert('Successfully enrolled in the course!');
        if (window.location.pathname.includes('dashboard.html')) {
            loadUserCourses();
        }
        // Reload page if on course page
        if (window.location.pathname.includes('course.html')) {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    } else {
        alert(result.message);
    }
}

// Make function globally available
window.handleEnroll = handleEnroll;
window.getCourseById = getCourseById;

// Load user enrolled courses
function loadUserCourses() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = auth.getCurrentUser();
    const enrolledCourses = coursesData.filter(course => 
        user.enrolledCourses.includes(course.id)
    );

    const coursesContainer = document.getElementById('enrolledCourses');
    if (coursesContainer) {
        if (enrolledCourses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-book-open"></i>
                    <p>You haven't enrolled in any course yet</p>
                    <a href="index.html" class="btn-primary">Browse Courses</a>
                </div>
            `;
        } else {
            coursesContainer.innerHTML = enrolledCourses.map(course => `
                <div class="course-card" onclick="window.location.href='course.html?id=${course.id}'">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-info">
                        <h3>${course.title}</h3>
                        <p>by ${course.instructor}</p>
                        <div class="course-meta">
                            <span><i class="fa-solid fa-star"></i> ${course.rating}</span>
                            <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                        </div>
                        <button class="btn-continue" onclick="event.stopPropagation(); window.location.href='course.html?id=${course.id}'">
                            Continue Learning <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Update user info in dashboard
function updateUserInfo() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = auth.getCurrentUser();
    
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const enrolledCountEl = document.getElementById('enrolledCount');
    const completedCountEl = document.getElementById('completedCount');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (enrolledCountEl) enrolledCountEl.textContent = user.enrolledCourses.length;
    if (completedCountEl) completedCountEl.textContent = user.completedCourses ? user.completedCourses.length : 0;
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        const result = auth.logout();
        if (result.success) {
            window.location.href = 'index.html';
        }
    }
}

// Make function globally available
window.handleLogout = handleLogout;

// Check authentication on page load
function checkAuth() {
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('course.html')) {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/') {
        displayCourses();
    }
    
    if (window.location.pathname.includes('dashboard.html')) {
        updateUserInfo();
        loadUserCourses();
    }
    
    if (window.location.pathname.includes('course.html')) {
        loadCourseDetails();
    }
});

// Update login buttons on home page
function updateAuthButtons() {
    const signInBtn = document.querySelector('.nav-buttons .button1');
    const getStartedBtn = document.querySelector('.nav-buttons .button2');
    
    if (auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        if (signInBtn) {
            signInBtn.textContent = user.name;
            signInBtn.onclick = () => window.location.href = 'dashboard.html';
        }
        if (getStartedBtn) {
            getStartedBtn.textContent = 'Control';
            getStartedBtn.onclick = () => window.location.href = 'dashboard.html';
        }
    } else {
        if (signInBtn) {
            signInBtn.textContent = 'Sign in';
            signInBtn.onclick = () => window.location.href = 'login.html';
        }
        if (getStartedBtn) {
            getStartedBtn.textContent = 'Get Started';
            getStartedBtn.onclick = () => window.location.href = 'login.html';
        }
    }
}

// Call update buttons on home page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthButtons);
} else {
    updateAuthButtons();
}

