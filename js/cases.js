// cases.js - Handles cases management

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    const isAdmin = currentUser && currentUser.role === "admin";
    let cases = JSON.parse(localStorage.getItem("cases")) || [];

    // Add Case
    if (window.location.pathname.includes("add_case.html")) {
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const caseName = document.querySelector("input[name='case_name']").value.trim();
                if (!caseName) {
                    alert("Please enter a case name.");
                    return;
                }
                const newCase = {
                    id: Date.now(),
                    name: caseName,
                    members: [],
                    contributions: []
                };
                cases.push(newCase);
                localStorage.setItem("cases", JSON.stringify(cases));
                localStorage.setItem("currentCase", JSON.stringify(newCase));
                window.location.href = "view_case_details.html";
            });
        }
    }

    // View Cases
    if (window.location.pathname.includes("view_cases.html")) {
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            cases.forEach((caseItem, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${caseItem.name}</td>
                    <td>${caseItem.contributions.length}</td>
                    <td>${caseItem.contributions.reduce((sum, c) => sum + c.contribution, 0)}</td>
                    <td><a href="#" onclick="viewCase(${caseItem.id})">View</a></td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    }

    // View Case Details
    if (window.location.pathname.includes("view_case_details.html")) {
        const currentCase = JSON.parse(localStorage.getItem("currentCase"));
        if (currentCase) {
            document.querySelector("h2 b").textContent = `Contributions for: ${currentCase.name}`;
            const tbody = document.querySelector("tbody");
            if (tbody) {
                tbody.innerHTML = "";
                currentCase.contributions.forEach((contrib, index) => {
                    const row = `<tr>
                        <td>${index + 1}</td>
                        <td>${contrib.name}</td>
                        <td>${contrib.contribution}</td>
                        <td>${contrib.gap || 0}</td>
                        <td>${contrib.date}</td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
            }
        }
    }

    // Add Member to Case
    if (window.location.pathname.includes("add_case_member.html")) {
        const currentCase = JSON.parse(localStorage.getItem("currentCase"));
        if (currentCase && isAdmin) {
            const form = document.querySelector("form");
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const name = document.querySelector("input[name='member_name']").value.trim();
                const contribution = parseFloat(document.querySelector("input[name='contribution']").value) || 0;
                const gap = parseFloat(document.querySelector("input[name='gap']").value) || 0;
                if (!name) {
                    alert("Please enter a name.");
                    return;
                }
                const newMember = { name, contribution, gap, date: new Date().toLocaleDateString() };
                currentCase.contributions.push(newMember);
                localStorage.setItem("cases", JSON.stringify(cases));
                localStorage.setItem("currentCase", JSON.stringify(currentCase));
                alert("Member added to case!");
                window.location.href = "view_case_details.html";
            });
        }
    }

    // Add Case Contribution
    if (window.location.pathname.includes("add_case_contributions.html")) {
        const currentCase = JSON.parse(localStorage.getItem("currentCase"));
        if (currentCase && isAdmin) {
            document.querySelector("h2").textContent = `For: ${currentCase.name}`;
            const form = document.querySelector("form");
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const name = document.querySelector("input[name='contributor_name']").value.trim();
                const amount = parseFloat(document.querySelector("input[name='amount']").value);
                if (!name || amount <= 0) {
                    alert("Please enter name and valid amount.");
                    return;
                }
                currentCase.contributions.push({ name, contribution: amount, gap: 0, date: new Date().toLocaleDateString() });
                localStorage.setItem("cases", JSON.stringify(cases));
                localStorage.setItem("currentCase", JSON.stringify(currentCase));
                alert("Contribution added!");
                window.location.href = "view_case_details.html";
            });
        }
    }

    // Add Gap
    if (window.location.pathname.includes("add_gap.html")) {
        const currentCase = JSON.parse(localStorage.getItem("currentCase"));
        if (currentCase && isAdmin) {
            // Populate select with case members
            const select = document.querySelector("select[name='member_id']");
            if (select) {
                select.innerHTML = "<option value=''>-- Select Member --</option>";
                currentCase.contributions.forEach((contrib, index) => {
                    select.innerHTML += `<option value="${index}">${contrib.name}</option>`;
                });
            }
            const form = document.querySelector("form");
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const memberIndex = parseInt(document.querySelector("select[name='member_id']").value);
                const gapAmount = parseFloat(document.querySelector("input[name='gap_amount']").value);
                if (memberIndex < 0 || gapAmount <= 0) {
                    alert("Please select a member and enter a valid gap amount.");
                    return;
                }
                currentCase.contributions[memberIndex].gap += gapAmount;
                localStorage.setItem("cases", JSON.stringify(cases));
                localStorage.setItem("currentCase", JSON.stringify(currentCase));
                alert("Gap added!");
                window.location.href = "view_case_details.html";
            });
        }
    }
});

// View Case Function
window.viewCase = function(id) {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    const caseItem = cases.find(c => c.id === id);
    if (caseItem) {
        localStorage.setItem("currentCase", JSON.stringify(caseItem));
        window.location.href = "view_case_details.html";
    }
};