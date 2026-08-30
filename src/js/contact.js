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

    function showError(
        input,
        message
    ) {

        const group =
            input.closest(".form-group");

        if (!group) return;

        group.classList.add(
            "has-error"
        );

        const error =
            group.querySelector(
                ".form-error"
            );

        if (error) {

            error.textContent =
                message;

        }

    }


    function clearError(input) {

        const group =
            input.closest(".form-group");

        if (!group) return;

        group.classList.remove(
            "has-error"
        );

    }


    function validateRequired(
        input,
        message
    ) {

        if (
            !input.value.trim()
        ) {

            showError(
                input,
                message
            );

            return false;

        }

        clearError(input);

        return true;

    }


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
       SUBMIT
    ===================================================== */

    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


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


            let valid = true;


            /* First name */

            if (
                !validateRequired(
                    firstName,
                    "Please enter your first name."
                )
            ) {

                valid = false;

            }


            /* Last name */

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


            /* Project */

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


            if (!valid) {

                return;

            }


            /* =================================================
               BUTTON ANIMATION
            ================================================= */

            const originalHTML =
                submitButton.innerHTML;

            submitButton.disabled =
                true;

            submitButton.innerHTML = `
                <span>Preparing...</span>
                <span class="submit-arrow">✦</span>
            `;


            /* Simulate submission */

            setTimeout(() => {

                success.classList.add(
                    "show"
                );


                submitButton.innerHTML = `
                    <span>Message Prepared</span>
                    <span class="submit-arrow">✓</span>
                `;


                /* =================================================
                   CREATE EMAIL
                   Replace your email below
                ================================================= */

                const recipient =
                    "ac804781@gmail.com";


                const fullName =
                    `${firstName.value.trim()}
                     ${lastName.value.trim()}`;


                const subject =
                    encodeURIComponent(
                        `New Project Inquiry — ${fullName}`
                    );


                const body =
                    encodeURIComponent(
`
Hello Abhay,

My name is ${fullName}.

Email:
${email.value.trim()}

Project Type:
${projectType.value}

Phone:
${document.getElementById("phone").value.trim() || "Not provided"}

Project Details:
${message.value.trim()}

Looking forward to hearing from you.

Regards,
${fullName}
`
                    );


                /*
                 * Open user's email client.
                 */

                window.location.href =
                    `mailto:${recipient}?subject=${subject}&body=${body}`;


                setTimeout(() => {

                    form.reset();

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        originalHTML;

                }, 1500);


            }, 900);

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