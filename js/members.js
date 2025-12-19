// members.js - Handles member management

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    const isAdmin = currentUser && currentUser.role === "admin";
    let members = JSON.parse(localStorage.getItem("members")) || [];

    // Add Member
    if (window.location.pathname.includes("add_members.html")) {
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const fullname = document.querySelector("input[name='fullname']").value.trim();
                const phone = document.querySelector("input[name='phone']").value.trim();
                const idno = document.querySelector("input[name='idno']").value.trim();

                if (!fullname || !phone || !idno) {
                    alert("Please fill all fields.");
                    return;
                }
                if (!isValidPhone(phone)) {
                    alert("Please enter a valid phone number.");
                    return;
                }

                const newMember = {
                    id: Date.now(),
                    fullname,
                    phone,
                    idno,
                    contribution: 0,
                    registeredAt: new Date().toLocaleDateString()
                };
                members.push(newMember);
                localStorage.setItem("members", JSON.stringify(members));
                alert("Member added!");
                form.reset();
                window.location.href = "view_members.html";
            });
        }
    }

    // View Members
    if (window.location.pathname.includes("view_members.html")) {
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            members.forEach((member, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${member.fullname}</td>
                    <td>${member.phone}</td>
                    <td>${member.idno}</td>
                    <td>${member.contribution}</td>
                    <td>${member.registeredAt}</td>
                    <td>${isAdmin ? `<a href="edit_member.html?id=${member.id}">Edit</a> | <a href="#" onclick="deleteMember(${member.id})">Delete</a>` : ""}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    }

    // Edit Member
    if (window.location.pathname.includes("edit_member.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get("id"));
        const member = members.find(m => m.id === id);
        if (member && isAdmin) {
            document.querySelector("input[name='fullname']").value = member.fullname;
            document.querySelector("input[name='phone']").value = member.phone;
            document.querySelector("input[name='idno']").value = member.idno;
            document.querySelector("input[name='contribution']").value = member.contribution;
            const form = document.querySelector("form");
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                member.fullname = document.querySelector("input[name='fullname']").value.trim();
                member.phone = document.querySelector("input[name='phone']").value.trim();
                member.idno = document.querySelector("input[name='idno']").value.trim();
                member.contribution = parseFloat(document.querySelector("input[name='contribution']").value) || 0;
                localStorage.setItem("members", JSON.stringify(members));
                alert("Member updated!");
                window.location.href = "view_members.html";
            });
        }
    }

    // Update Dashboard Total Members
    if (window.location.pathname.includes("dashboard.html")) {
        const totalMembersEl = document.getElementById("totalMembers");
        if (totalMembersEl) {
            totalMembersEl.textContent = members.length;
        }
    }
});

// Delete Member Function
window.deleteMember = function(id) {
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    const isAdmin = currentUser && currentUser.role === "admin";
    if (isAdmin && confirm("Delete member?")) {
        let members = JSON.parse(localStorage.getItem("members")) || [];
        members = members.filter(m => m.id !== id);
        localStorage.setItem("members", JSON.stringify(members));
        location.reload();
    }
};

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}