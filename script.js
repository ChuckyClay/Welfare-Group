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
            const password=document.getElementById("password").value.trim();
            const message=document.getElementById("registermessage");

            //DISPLAY MESSAGE IF NO INPUT FOUND
            if(!fullname || !phone || !Idno || !email || !password){
                if(message){
                    message.textContent = "Please fill in all fields.";
                    message.style.color = "red";
                }
                return;
            }

            const member = {fullname, phone, Idno, email, password, role: localStorage.getItem("registeredMember") ? "member" : "admin" };
            localStorage.setItem("registeredMember", JSON.stringify(member));
            
            //verification message
            if (message) {
                message.textContent = `Registration successful for ${fullname}!`;
                message.style.color ="green";
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
            const message=document.getElementById("loginmessage");

            const storedMember=JSON.parse(localStorage.getItem("registeredMember"));
            //error message if not registered
            if(!storedMember){
                if(message){
                    message.textContent="No User found. Please register first.";
                    message.style.color="red";
                }
                return;
            }
            
            if(email===storedMember.email && password===storedMember.password){
                if(message){
                    message.textContent=`Login successful! Welcome ${storedMember.fullname}!`;
                    message.style.color="green";
                }
                loginForm.reset();
                localStorage.setItem("currentMember", JSON.stringify(storedMember));
                setTimeout(function(){
                    window.location.href="dashboard.html";
                }, 2000);
            }else{
                message.textContent="Invalid email or Password!";
                message.style.color="red";
                return;
            }

        });
    }
    // Dashboard Greeting and Messages
    const greeting = document.getElementById("greeting");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const currentUser = JSON.parse(localStorage.getItem("currentMember"));
    
    if(currentUser && greeting){
        const firstName=currentUser.fullname.split(" ")[0];
        greeting.textContent=`Hello, ${firstName}!`;
        greeting.classList.add("typing-effect");
    }
    if(welcomeMessage){
        welcomeMessage.textContent="Welcome to Kiamuringa Welfare Group";
        welcomeMessage.classList.add("typing-effect");
        welcomeMessage.style.fontSize="25px";
        welcomeMessage.style.fontStyle="italic";
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

    // Get Current User Role
    const isAdmin = currentUser && currentUser.role === "admin";

    // Member Management
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
                if (fullname && phone && idno) {
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
                } else {
                    alert("Fill all fields");
                }
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

    // Delete Member Function
    window.deleteMember = function(id) {
        if (isAdmin && confirm("Delete member?")) {
            members = members.filter(m => m.id !== id);
            localStorage.setItem("members", JSON.stringify(members));
            location.reload();
        }
    };

    // Update Dashboard Total Members
    if (window.location.pathname.includes("dashboard.html")) {
        const totalMembersEl = document.getElementById("totalMembers");
        if (totalMembersEl) {
            totalMembersEl.textContent = members.length;
        }
    }

    // Cases Management
    let cases = JSON.parse(localStorage.getItem("cases")) || [];

    // Add Case
    if (window.location.pathname.includes("add_case.html")) {
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const caseName = document.querySelector("input[name='case_name']").value.trim();
                if (caseName) {
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
                } else {
                    alert("Enter case name");
                }
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

    // View Case Function
    window.viewCase = function(id) {
        const caseItem = cases.find(c => c.id === id);
        if (caseItem) {
            localStorage.setItem("currentCase", JSON.stringify(caseItem));
            window.location.href = "view_case_details.html";
        }
    };

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
                if (name) {
                    const newMember = { name, contribution, gap, date: new Date().toLocaleDateString() };
                    currentCase.contributions.push(newMember);
                    localStorage.setItem("cases", JSON.stringify(cases));
                    localStorage.setItem("currentCase", JSON.stringify(currentCase));
                    alert("Member added to case!");
                    window.location.href = "view_case_details.html";
                } else {
                    alert("Enter name");
                }
            });
        }
    }

    // Contributions Management
    let contributions = JSON.parse(localStorage.getItem("contributions")) || [];

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
                if (memberId && amount > 0) {
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
                } else {
                    alert("Select member and enter amount");
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

    // Payments Management
    let payments = JSON.parse(localStorage.getItem("payments")) || [];

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
                if (amount > 0) {
                    payments.push({ memberId, amount, date: new Date().toLocaleDateString() });
                    localStorage.setItem("payments", JSON.stringify(payments));
                    alert("Payment added!");
                    window.location.href = "view_members.html";
                } else {
                    alert("Enter amount");
                }
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

    // SMS Management
    let smsHistory = JSON.parse(localStorage.getItem("smsHistory")) || [];

    // Send SMS
    if (window.location.pathname.includes("send_sms.html")) {
        const form = document.querySelector("form");
        if (form && isAdmin) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const message = document.querySelector("textarea[name='message']").value.trim();
                if (message) {
                    smsHistory.push({ message, date: new Date().toLocaleString() });
                    localStorage.setItem("smsHistory", JSON.stringify(smsHistory));
                    alert("SMS sent to all members!");
                    form.reset();
                } else {
                    alert("Enter message");
                }
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
                if (name && amount > 0) {
                    currentCase.contributions.push({ name, contribution: amount, gap: 0, date: new Date().toLocaleDateString() });
                    localStorage.setItem("cases", JSON.stringify(cases));
                    localStorage.setItem("currentCase", JSON.stringify(currentCase));
                    alert("Contribution added!");
                    window.location.href = "view_case_details.html";
                } else {
                    alert("Enter name and amount");
                }
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
                if (memberIndex >= 0 && gapAmount > 0) {
                    currentCase.contributions[memberIndex].gap += gapAmount;
                    localStorage.setItem("cases", JSON.stringify(cases));
                    localStorage.setItem("currentCase", JSON.stringify(currentCase));
                    alert("Gap added!");
                    window.location.href = "view_case_details.html";
                } else {
                    alert("Select member and enter gap");
                }
            });
        }
    }

})