// auth.js - Handles authentication (register, login, logout)

document.addEventListener("DOMContentLoaded", () => {
   // Registration Form Handler
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const message = document.getElementById("registermessage");

            // Enhanced validation
            if (!fullname || !email || !password) {
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

            // Store as admin if no admins exist, else as member (for legacy, but only admins should register)
            let admins = JSON.parse(localStorage.getItem("admins")) || [];
            // If no admins exist, this is the first admin
            if (admins.length === 0) {
                admins.push({ fullname, email, password, role: "admin" });
                localStorage.setItem("admins", JSON.stringify(admins));
                showMessage(message, `Admin registration successful for ${fullname}!`, "green");
            } else {
                // Only allow admin registration from admin_add_admin.html
                showMessage(message, `Registration is only allowed for admins.`, "red");
                return;
            }
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

            // Check against all admins
            let admins = JSON.parse(localStorage.getItem("admins")) || [];
            const foundAdmin = admins.find(a => a.email === email && a.password === password);
            if (!foundAdmin) {
                showMessage(message, "Invalid email or password, or no admin found. Please contact the system owner.", "red");
                return;
            }
            showMessage(message, `Login successful! Welcome ${foundAdmin.fullname}!`, "green");
            loginForm.reset();
            localStorage.setItem("currentMember", JSON.stringify(foundAdmin));
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 2000);
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
        welcomeMessage.textContent = "Welcome back to K.W.G!";
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