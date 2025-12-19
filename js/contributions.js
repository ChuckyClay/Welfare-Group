// contributions.js - Handles contributions and payments

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    const isAdmin = currentUser && currentUser.role === "admin";
    let members = JSON.parse(localStorage.getItem("members")) || [];
    let contributions = JSON.parse(localStorage.getItem("contributions")) || [];
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

    // Add Contribution (general)
    if (window.location.pathname.includes("contributions.html")) {
        // Populate member select
        const select = document.querySelector("select[name='member_id']");
        if (select) {
            select.innerHTML = "<option value=''>-- Select Member --</option>";
            members.forEach(member => {
                select.innerHTML += `<option value="${member.id}">${member.fullname}</option>`;
            });
        }
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const memberId = parseInt(document.querySelector("select[name='member_id']").value);
                const amount = parseFloat(document.querySelector("input[name='amount']").value);
                if (!memberId || amount <= 0) {
                    alert("Please select a member and enter a valid amount.");
                    return;
                }
                const member = members.find(m => m.id === memberId);
                if (member) {
                    member.contribution += amount;
                    contributions.push({ memberId, amount, date: new Date().toLocaleDateString() });
                    localStorage.setItem("members", JSON.stringify(members));
                    localStorage.setItem("contributions", JSON.stringify(contributions));
                    alert("Contribution added!");
                    form.reset();
                    location.reload();
                }
            });
        }
        // View contributions
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            contributions.forEach((contrib, index) => {
                const member = members.find(m => m.id === contrib.memberId);
                const row = `<tr>
                    <td>${member ? member.fullname : "Unknown"}</td>
                    <td>KES ${contrib.amount}</td>
                    <td>${contrib.date}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    }

    // Update Dashboard total contributions
    if (window.location.pathname.includes("dashboard.html")) {
        const cards = document.querySelectorAll(".card p");
        if (cards[1]) { // Assuming second card is contributions
            const total = contributions.reduce((sum, c) => sum + c.amount, 0);
            cards[1].textContent = `KES ${total}`;
        }
    }

    // Add Payment
    if (window.location.pathname.includes("add_payment.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const memberId = parseInt(urlParams.get("id"));
        const member = members.find(m => m.id === memberId);
        if (member && isAdmin) {
            document.querySelector("h2").textContent = `Add Payment for: ${member.fullname}`;
            const form = document.querySelector("form");
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const amount = parseFloat(document.querySelector("input[name='amount']").value);
                if (amount <= 0) {
                    alert("Please enter a valid amount.");
                    return;
                }
                payments.push({ memberId, amount, date: new Date().toLocaleDateString() });
                localStorage.setItem("payments", JSON.stringify(payments));
                alert("Payment added!");
                window.location.href = "view_members.html";
            });
        }
    }

    // View Payments
    if (window.location.pathname.includes("view_payments.html")) {
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            payments.forEach((payment, index) => {
                const member = members.find(m => m.id === payment.memberId);
                const row = `<tr>
                    <td>${member ? member.fullname : "Unknown"}</td>
                    <td>KES ${payment.amount}</td>
                    <td>${payment.date}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    }
});