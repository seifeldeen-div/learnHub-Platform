// Authentication and User Management System
class Auth {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('learnHubUsers');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('learnHubUsers', JSON.stringify(this.users));
    }

    // Load current user
    loadCurrentUser() {
        const user = localStorage.getItem('learnHubCurrentUser');
        return user ? JSON.parse(user) : null;
    }

    // Save current user
    saveCurrentUser(user) {
        if (user) {
            localStorage.setItem('learnHubCurrentUser', JSON.stringify(user));
            this.currentUser = user;
        } else {
            localStorage.removeItem('learnHubCurrentUser');
            this.currentUser = null;
        }
    }

    // Sign up new user
    signup(name, email, password) {
        // Check if user exists
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Email is already registered' };
        }

        // Check password strength
        if (password.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // In real app, password should be hashed
            enrolledCourses: [],
            completedCourses: [],
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        this.saveCurrentUser(newUser);

        return { success: true, message: 'Account created successfully!', user: newUser };
    }

    // Login
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        this.saveCurrentUser(user);
        return { success: true, message: 'Login successful!', user: user };
    }

    // Logout
    logout() {
        this.saveCurrentUser(null);
        return { success: true, message: 'Logout successful' };
    }

    // Check if authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user data
    updateUser(userData) {
        if (!this.currentUser) return { success: false, message: 'Unauthorized' };

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) return { success: false, message: 'User not found' };

        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        this.saveUsers();
        this.saveCurrentUser(this.users[userIndex]);

        return { success: true, message: 'Data updated successfully', user: this.users[userIndex] };
    }

    // Enroll in course
    enrollInCourse(courseId) {
        if (!this.currentUser) return { success: false, message: 'Please login first' };

        if (this.currentUser.enrolledCourses.includes(courseId)) {
            return { success: false, message: 'You are already enrolled in this course' };
        }

        this.currentUser.enrolledCourses.push(courseId);
        return this.updateUser({ enrolledCourses: this.currentUser.enrolledCourses });
    }

    // Unenroll from course
    unenrollFromCourse(courseId) {
        if (!this.currentUser) return { success: false, message: 'Unauthorized' };

        this.currentUser.enrolledCourses = this.currentUser.enrolledCourses.filter(id => id !== courseId);
        return this.updateUser({ enrolledCourses: this.currentUser.enrolledCourses });
    }
}

// Create Auth instance
const auth = new Auth();

// Handle login form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = auth.login(email, password);
        
        showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    });
}

// Handle signup form
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Check password match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        const result = auth.signup(name, email, password);
        
        showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    });
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.textContent = message;
    
    // Insert message in active form
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        activeForm.insertBefore(messageDiv, activeForm.firstChild);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
