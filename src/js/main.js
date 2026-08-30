/* =========================================================
   IMPORT PROJECT DATA
   projects.json is inside:
   src/data/projects.json
========================================================= */

import projectData from "../data/projects.json";


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    [...document.querySelectorAll(selector)];


/* =========================================================
   CERTIFICATE MODAL
========================================================= */

const certificateModal =
    $("#certificateModal");

const certificateClose =
    $("#certificateClose");

const certificateModalImage =
    $("#certificateModalImage");


$$(".certificate-view").forEach(button => {

    button.addEventListener("click", () => {

        const image =
            button.dataset.certificate;

        if (!certificateModalImage) return;

        certificateModalImage.src = image;

        certificateModalImage.alt =
            "Full certificate preview";

        certificateModal?.showModal();

    });

});


certificateClose?.addEventListener(
    "click",
    () => certificateModal?.close()
);


certificateModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            event.currentTarget
        ) {
            event.currentTarget.close();
        }

    }
);


/* =========================================================
   PROJECTS
========================================================= */

const projectGrid =
    $("#projectGrid");

const filters =
    $("#projectFilters");

const search =
    $("#projectSearch");


/*
   IMPORTANT:

   Do NOT write:

   let projects = [];

   because projects is already imported above.
*/

const projects =
    Array.isArray(projectData)
        ? projectData
        : projectData.projects || [];


let activeFilter = "All";


/* =========================================================
   PROJECT IMAGE PATH
========================================================= */

function getAssetPath(path) {

    if (!path) {
        return "";
    }

    /*
       Vite GitHub Pages base path
    */

    return `${import.meta.env.BASE_URL}${path}`;

}


/* =========================================================
   RENDER FILTERS
========================================================= */

function renderFilters() {

    if (!filters) return;

    const categories = [
        "All",
        ...new Set(
            projects
                .map(project => project.category)
                .filter(Boolean)
        ),
        "Frontend",
        "JavaScript"
    ];


    filters.innerHTML =
        categories
            .map(category => `

                <button
                    class="filter-btn ${
                        category === activeFilter
                            ? "active"
                            : ""
                    }"
                    data-filter="${category}"
                >
                    ${category}
                </button>

            `)
            .join("");


    $$(".filter-btn").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                activeFilter =
                    button.dataset.filter;

                renderFilters();

                renderProjects();

            }
        );

    });

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

    if (!projectGrid) return;


    const query =
        search?.value
            ?.trim()
            .toLowerCase() || "";


    const list =
        projects.filter(project => {

            const technologies =
                project.technologies || [];


            const matchesCategory =
                activeFilter === "All" ||

                project.category ===
                    activeFilter ||

                (
                    activeFilter ===
                    "Frontend" &&

                    technologies.some(
                        technology =>
                            /html|css|javascript/i
                                .test(technology)
                    )
                ) ||

                (
                    activeFilter ===
                    "JavaScript" &&

                    technologies.some(
                        technology =>
                            /javascript/i
                                .test(technology)
                    )
                );


            const searchableText = `

                ${project.title || ""}

                ${project.description || ""}

                ${technologies.join(" ")}

            `
                .toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    query
                );


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!list.length) {

        projectGrid.innerHTML = `

            <p class="muted">
                No projects match your search.
            </p>

        `;

        return;

    }


    /* =====================================================
       PROJECT CARDS
    ===================================================== */

    projectGrid.innerHTML =
        list
            .map(project => {

                const projectIndex =
                    projects.indexOf(
                        project
                    );


                const image =
                    getAssetPath(
                        project.image
                    );


                return `

                    <article
                        class="project-card reveal visible"
                    >

                        <div
                            class="project-preview"
                        >

                            ${
                                image
                                    ? `
                                        <img
                                            src="${image}"
                                            alt="${project.title}"
                                            class="project-preview-image"
                                            loading="lazy"
                                        >
                                    `
                                    : `
                                        <div
                                            class="project-preview-placeholder"
                                        >
                                            <span>
                                                ${project.title}
                                            </span>
                                        </div>
                                    `
                            }

                        </div>


                        <div
                            class="project-content"
                        >

                            <span
                                class="status"
                            >
                                ${
                                    project.status ||
                                    "Project"
                                }
                            </span>


                            <h3>
                                ${project.title}
                            </h3>


                            <p>
                                ${project.description}
                            </p>


                            <div
                                class="tags"
                            >

                                ${
                                    (project.technologies || [])
                                        .map(
                                            technology => `
                                                <span
                                                    class="tag"
                                                >
                                                    ${technology}
                                                </span>
                                            `
                                        )
                                        .join("")
                                }

                            </div>


                            <div
                                class="project-actions"
                            >

                                ${
                                    project.github
                                        ? `
                                            <a
                                                class="small-btn"
                                                href="${project.github}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                GitHub ↗
                                            </a>
                                        `
                                        : ""
                                }


                                ${
                                    project.liveDemo &&
                                    project.liveDemo !== "#"
                                        ? `
                                            <a
                                                class="small-btn"
                                                href="${project.liveDemo}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Live Demo ↗
                                            </a>
                                        `
                                        : ""
                                }


                                <button
                                    class="small-btn details"
                                    data-index="${projectIndex}"
                                >
                                    View Details
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            })
            .join("");


    /* =====================================================
       DETAILS BUTTONS
    ===================================================== */

    $$(".details").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.index
                    );

                openModal(
                    projects[index]
                );

            }
        );

    });

}


/* =========================================================
   PROJECT DETAILS MODAL
========================================================= */

function openModal(project) {

    const modal =
        $("#projectModal");

    const modalBody =
        $("#modalBody");


    if (!modal || !modalBody) {
        return;
    }


    modalBody.innerHTML = `

        <p class="eyebrow">
            Project details
        </p>


        <h2>
            ${project.title}
        </h2>


        ${
            project.tagline
                ? `
                    <p>
                        <strong>
                            ${project.tagline}
                        </strong>
                    </p>
                `
                : ""
        }


        <p>
            ${project.description || ""}
        </p>


        ${
            project.problem
                ? `
                    <h3>Problem</h3>
                    <p>
                        ${project.problem}
                    </p>
                `
                : ""
        }


        ${
            project.solution
                ? `
                    <h3>Solution</h3>
                    <p>
                        ${project.solution}
                    </p>
                `
                : ""
        }


        ${
            project.features?.length
                ? `
                    <h3>Features</h3>

                    <ul>
                        ${project.features
                            .map(
                                feature =>
                                    `<li>${feature}</li>`
                            )
                            .join("")}
                    </ul>
                `
                : ""
        }


        <h3>
            Technologies
        </h3>


        <div class="tags">

            ${(project.technologies || [])
                .map(
                    technology =>
                        `
                        <span
                            class="tag"
                        >
                            ${technology}
                        </span>
                        `
                )
                .join("")}

        </div>


        ${
            project.process
                ? `
                    <h3>
                        Development process
                    </h3>

                    <p>
                        ${project.process}
                    </p>
                `
                : ""
        }


        ${
            project.challenges
                ? `
                    <h3>
                        Challenges
                    </h3>

                    <p>
                        ${project.challenges}
                    </p>
                `
                : ""
        }


        ${
            project.future?.length
                ? `
                    <h3>
                        Future improvements
                    </h3>

                    <ul>
                        ${project.future
                            .map(
                                item =>
                                    `<li>${item}</li>`
                            )
                            .join("")}
                    </ul>
                `
                : ""
        }


        <div
            class="project-actions"
        >

            ${
                project.github
                    ? `
                        <a
                            class="small-btn"
                            href="${project.github}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub ↗
                        </a>
                    `
                    : ""
            }


            ${
                project.liveDemo &&
                project.liveDemo !== "#"
                    ? `
                        <a
                            class="small-btn"
                            href="${project.liveDemo}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live Demo ↗
                        </a>
                    `
                    : ""
            }

        </div>

    `;


    modal.showModal();

}


/* =========================================================
   MODAL CLOSE
========================================================= */

const modalClose =
    $("#modalClose");

const projectModal =
    $("#projectModal");


modalClose?.addEventListener(
    "click",
    () => projectModal?.close()
);


projectModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            event.currentTarget
        ) {

            event.currentTarget.close();

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

search?.addEventListener(
    "input",
    renderProjects
);


/* =========================================================
   LOAD OTHER JSON DATA
========================================================= */

async function loadJSON(path) {

    const response =
        await fetch(
            `${import.meta.env.BASE_URL}${path}`
        );


    if (!response.ok) {

        throw new Error(
            `Could not load ${path}`
        );

    }


    return response.json();

}


/* =========================================================
   INITIALIZE SKILLS + JOURNEY
========================================================= */

async function initData() {

    try {

        /* ================================================
           PROJECTS
        ================================================= */

        renderFilters();

        renderProjects();


        /* ================================================
           SKILLS
        ================================================= */

        const skills =
            await loadJSON(
                "src/data/skills.json"
            );


        const skillCategories =
            $("#skillCategories");


        if (
            skillCategories &&
            Array.isArray(skills)
        ) {

            skillCategories.innerHTML =
                skills
                    .map(skill => `

                        <div
                            class="skill-category reveal"
                        >

                            <h3>
                                ${skill.category}
                            </h3>


                            ${
                                (skill.items || [])
                                    .map(
                                        item => {

                                            const name =
                                                Array.isArray(item)
                                                    ? item[0]
                                                    : item.name;

                                            const description =
                                                Array.isArray(item)
                                                    ? item[1]
                                                    : item.description;

                                            return `

                                                <div
                                                    class="skill-card"
                                                >

                                                    <b>
                                                        ${name}
                                                    </b>

                                                    <span>
                                                        ${description || ""}
                                                    </span>

                                                </div>

                                            `;

                                        }
                                    )
                                    .join("")
                            }

                        </div>

                    `)
                    .join("");

        }


        /* ================================================
           JOURNEY
        ================================================= */

        const journey =
            await loadJSON(
                "src/data/journey.json"
            );


        const timeline =
            $("#timeline");


        if (
            timeline &&
            Array.isArray(journey)
        ) {

            timeline.innerHTML =
                journey
                    .map(item => `

                        <article
                            class="timeline-item reveal"
                        >

                            <span
                                class="year"
                            >
                                ${item.year}
                            </span>


                            <h3>
                                ${item.title}
                            </h3>


                            <p>
                                ${item.description}
                            </p>


                            <div
                                class="tags"
                            >

                                ${
                                    (item.technologies || [])
                                        .map(
                                            technology =>
                                                `
                                                <span
                                                    class="tag"
                                                >
                                                    ${technology}
                                                </span>
                                                `
                                        )
                                        .join("")
                                }

                            </div>

                        </article>

                    `)
                    .join("");

        }


        /* ================================================
           REVEAL ELEMENTS
        ================================================= */

        observeReveals();


    } catch (error) {

        console.error(
            "Portfolio data error:",
            error
        );

    }

}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

function observeReveals() {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    $$(".reveal").forEach(
        element =>
            observer.observe(element)
    );

}


/* =========================================================
   NAVBAR SCROLL
========================================================= */

const navbar =
    $("#navbar");


window.addEventListener(
    "scroll",
    () => {

        navbar?.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const menu =
    $("#menuToggle");

const navLinks =
    $("#navLinks");


menu?.addEventListener(
    "click",
    () => {

        const isOpen =
            navLinks?.classList.toggle(
                "open"
            );


        menu.setAttribute(
            "aria-expanded",
            isOpen
        );

    }
);


$$(".nav-links a").forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navLinks?.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* =========================================================
   THEME
========================================================= */

const savedTheme =
    localStorage.getItem("theme");

const systemLight =
    window.matchMedia(
        "(prefers-color-scheme: light)"
    ).matches;


document.documentElement.dataset.theme =
    savedTheme ||
    (
        systemLight
            ? "light"
            : "dark"
    );


$("#themeToggle")?.addEventListener(
    "click",
    () => {

        const nextTheme =
            document.documentElement
                .dataset
                .theme === "light"
                ? "dark"
                : "light";


        document.documentElement.dataset.theme =
            nextTheme;


        localStorage.setItem(
            "theme",
            nextTheme
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    $$("main section[id]");

const navItems =
    $$(".nav-links a");


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        navItems.forEach(
                            link => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                );

                            }
                        );

                    }

                }
            );

        },
        {
            rootMargin:
                "-35% 0px -55%"
        }
    );


sections.forEach(
    section =>
        sectionObserver.observe(section)
);


/* =========================================================
   BACK TO TOP
========================================================= */

$("#backTop")?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    $("#contactForm");


contactForm?.addEventListener(
    "submit",
    event => {

        /*
           contact.js handles the actual
           Formspree submission.

           Therefore main.js should NOT
           prevent the submission here.
        */

        console.log(
            "Contact form submitted"
        );

    }
);


/* =========================================================
   START APPLICATION
========================================================= */

initData();