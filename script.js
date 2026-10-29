document.addEventListener("DOMContentLoaded", function() {
    
    // --- FORMULÁRIO DE CONTACTO (contact.html) ---
    const contactForm = document.getElementById("contactForm");
    const contactError = document.getElementById("formError");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede recarregar
            contactError.innerHTML = "";
            contactError.style.color = "red";

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === "") {
                contactError.innerHTML = "Error: Please fill in all required fields.";
                return;
            }
            contactError.style.color = "green";
            contactError.innerHTML = "Message sent successfully!";
            contactForm.reset();
        });
    }

    // --- FORMULÁRIO DE PESQUISA (enquiry.html) ---
    const enquiryForm = document.getElementById("enquiry-form");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede recarregar
            
            const fullName = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            
            // Cria a caixa de erro se ela não existir
            let errorBox = document.getElementById("enquiryError");
            if (!errorBox) {
                errorBox = document.createElement("div");
                errorBox.id = "enquiryError";
                enquiryForm.appendChild(errorBox);
            }
            
            errorBox.innerHTML = "";
            errorBox.style.color = "red";
            errorBox.style.marginTop = "10px";

            if (fullName === "" || email === "") {
                errorBox.innerHTML = "Error: Please fill in all required fields.";
                return;
            }

            if (!email.includes("@")) {
                errorBox.innerHTML = "Error: Please enter a valid email address.";
                return;
            }

            errorBox.style.color = "green";
            errorBox.innerHTML = "Enquiry sent successfully! We will contact you shortly.";
            enquiryForm.reset();
        });
    }
});