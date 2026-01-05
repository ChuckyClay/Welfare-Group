// auth.js - Handles authentication (register, login, logout)

document.addEventListener("DOMContentLoaded", () => {
    // Registration Form Handler
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const fullname = document.getElementById("fullname").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const Idno = document.getElementById("idno").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const message = document.getElementById("registermessage");

            // Enhanced validation
            if (!fullname || !phone || !Idno || !email || !password) {
                showMessage(message, "Please fill in all fields.", "red");
                return;
            }
            if (!isValidEmail(email)) {
                showMessage(message, "Please enter a valid email.", "red");
                return;
            }
            if (password.length < 6) {
                showMessage(message, "Password must be at least 6 characters.", "red");
                return;
            }

            const member = { fullname, phone, Idno, email, password, role: localStorage.getItem("registeredMember") ? "member" : "admin" };
            localStorage.setItem("registeredMember", JSON.stringify(member));

            showMessage(message, `Registration successful for ${fullname}!`, "green");

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const message = document.getElementById("loginmessage");

            const storedMember = JSON.parse(localStorage.getItem("registeredMember"));
            if (!storedMember) {
                showMessage(message, "No user found. Please register first.", "red");
                return;
            }

            if (email === storedMember.email && password === storedMember.password) {
                showMessage(message, `Login successful! Welcome ${storedMember.fullname}!`, "green");
                loginForm.reset();
                localStorage.setItem("currentMember", JSON.stringify(storedMember));
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);
            } else {
                showMessage(message, "Invalid email or password!", "red");
            }
        });
    }

    // Logout Functionality
    const logoutLink = document.getElementById("logout");
    if (logoutLink) {
        logoutLink.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("currentMember");
            window.location.href = "index.html";
        });
    }

    // Dashboard Greeting
    const greeting = document.getElementById("greeting");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));

    if (currentUser && greeting) {
        const firstName = currentUser.fullname.split(" ")[0];
        greeting.textContent = `Hello, ${firstName}!`;
        greeting.classList.add("typing-effect");
    }
    if (welcomeMessage) {
        welcomeMessage.textContent = "Welcome to Kiamuringa Welfare Group";
        welcomeMessage.classList.add("typing-effect");
        welcomeMessage.style.fontSize = "25px";
        welcomeMessage.style.fontStyle = "italic";
    }
});

// Utility function for messages
function showMessage(element, text, color) {
    if (element) {
        element.textContent = text;
        element.style.color = color;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Menu Toggle for Mobile
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector('.site-header nav');
if (menuToggle && nav) {
    menuToggle.addEventListener ('click', () => {
        nav.classList.toggle('open');
    });
}

document.body.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && e.target !== menuToggle) {
        nav.classList.remove('open');
    }
});