// sms.js - Handles SMS management

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    const isAdmin = currentUser && currentUser.role === "admin";
    let smsHistory = JSON.parse(localStorage.getItem("smsHistory")) || [];

    // Send SMS
    if (window.location.pathname.includes("send_sms.html")) {
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const message = document.querySelector("textarea[name='message']").value.trim();
                if (!message) {
                    alert("Please enter a message.");
                    return;
                }
                smsHistory.push({ message, date: new Date().toLocaleString() });
                localStorage.setItem("smsHistory", JSON.stringify(smsHistory));
                alert("SMS sent to all members!");
                form.reset();
            });
        }
    }

    // SMS History
    if (window.location.pathname.includes("sms_history.html")) {
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            smsHistory.forEach((sms, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${sms.message}</td>
                    <td>Sent</td>
                    <td>${sms.date}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    }
});