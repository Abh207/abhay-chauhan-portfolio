/* =========================================================
   CONTACT FORM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("contactForm");

    const success =
        document.getElementById("formSuccess");

    const submitButton =
        document.getElementById("contactSubmit");

    const year =
        document.getElementById("currentYear");


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function showError(input, message) {

        const group =
            input.closest(".form-group");

        if (!group) return;

        group.classList.add("has-error");

        const error =
            group.querySelector(".form-error");

        if (error) {
            error.textContent = message;
        }
    }


    function clearError(input) {

        const group =
            input.closest(".form-group");

        if (!group) return;

        group.classList.remove("has-error");
    }


    function validateRequired(input, message) {

        if (!input.value.trim()) {

            showError(
                input,
                message
            );

            return false;
        }

        clearError(input);

        return true;
    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function validateEmail(input) {

        const email =
            input.value.trim();

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(email)) {

            showError(
                input,
                "Please enter a valid email."
            );

            return false;
        }

        clearError(input);

        return true;
    }


    /* =====================================================
       LIVE ERROR REMOVAL
    ===================================================== */

    form
        ?.querySelectorAll(
            "input, textarea, select"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {
                    clearError(input);
                }
            );

            input.addEventListener(
                "change",
                () => {
                    clearError(input);
                }
            );

        });


    /* =====================================================
       FORM SUBMISSION
       FORMSPREE
    ===================================================== */

    form?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /* =================================================
               GET FORM ELEMENTS
            ================================================= */

            const firstName =
                document.getElementById(
                    "firstName"
                );

            const lastName =
                document.getElementById(
                    "lastName"
                );

            const email =
                document.getElementById(
                    "email"
                );

            const projectType =
                document.getElementById(
                    "projectType"
                );

            const message =
                document.getElementById(
                    "message"
                );


            /* =================================================
               VALIDATION
            ================================================= */

            let valid = true;


            /* First Name */

            if (
                !validateRequired(
                    firstName,
                    "Please enter your first name."
                )
            ) {
                valid = false;
            }


            /* Last Name */

            if (
                !validateRequired(
                    lastName,
                    "Please enter your last name."
                )
            ) {
                valid = false;
            }


            /* Email */

            if (
                !validateRequired(
                    email,
                    "Please enter your email."
                )
            ) {

                valid = false;

            } else if (
                !validateEmail(email)
            ) {

                valid = false;

            }


            /* Project Type */

            if (
                !validateRequired(
                    projectType,
                    "Please select a project type."
                )
            ) {
                valid = false;
            }


            /* Message */

            if (
                !validateRequired(
                    message,
                    "Please tell me about your project."
                )
            ) {
                valid = false;
            }


            /* =================================================
               STOP IF INVALID
            ================================================= */

            if (!valid) {
                return;
            }


            /* =================================================
               BUTTON LOADING
            ================================================= */

            const originalHTML =
                submitButton.innerHTML;

            submitButton.disabled = true;

            submitButton.innerHTML = `
                <span>Sending...</span>
                <span class="submit-arrow">✦</span>
            `;


            /* =================================================
               SEND DATA TO FORMSPREE
            ================================================= */
try {

    const formData = new FormData(form);

    console.log("Submitting to:", form.action);

    const response = await fetch(
        form.action,
        {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        }
    );


    /* =====================================================
       READ FORMSPREE RESPONSE
    ===================================================== */

    const result = await response.json();

    console.log("Formspree response:", result);


    /* =====================================================
       SUCCESS
    ===================================================== */

    if (response.ok) {

        success.classList.add("show");

        submitButton.innerHTML = `
            <span>Message Sent</span>
            <span class="submit-arrow">✓</span>
        `;

        form.reset();


        setTimeout(() => {

            success.classList.remove("show");

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalHTML;

        }, 3000);

        return;
    }


    /* =====================================================
       FORMSPREE ERROR
    ===================================================== */

    console.error(
        "Formspree rejected the submission:",
        result
    );


    let errorMessage =
        "Formspree rejected the submission.";


    if (
        result &&
        result.errors &&
        result.errors.length
    ) {

        errorMessage =
            result.errors
                .map(error =>
                    `${error.field || "Form"}: ${error.message}`
                )
                .join("\n");

    } else if (result && result.error) {

        errorMessage =
            result.error;

    }


    alert(
        "Formspree Error:\n\n" +
        errorMessage
    );


    submitButton.disabled = false;

    submitButton.innerHTML = `
        <span>Try Again</span>
        <span class="submit-arrow">↻</span>
    `;


} catch (error) {

    console.error(
        "Network / JavaScript error:",
        error
    );


    submitButton.disabled = false;

    submitButton.innerHTML = `
        <span>Try Again</span>
        <span class="submit-arrow">↻</span>
    `;


    alert(
        "Could not connect to Formspree.\n\n" +
        error.message
    );

}
        }
    );

});





/* =========================================================
   FLOATING PROJECT BUTTON
========================================================= */

const floatingProjectBtn =
    document.querySelector(
        ".floating-project-btn"
    );


window.addEventListener(
    "scroll",
    () => {

        if (!floatingProjectBtn) return;

        if (window.scrollY > 300) {

            floatingProjectBtn.classList.add(
                "scrolled"
            );

        } else {

            floatingProjectBtn.classList.remove(
                "scrolled"
            );

        }

    },
    { passive: true }
);