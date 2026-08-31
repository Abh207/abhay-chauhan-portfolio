/* =========================================================
   IMPORT DATA
========================================================= */

import projectsData from "../data/projects.json";
import skillsData from "../data/skills.json";
import journeyData from "../data/journey.json";


/* =========================================================
   IMPORT PROJECT IMAGES
========================================================= */

import ksamDealImage from "../assets/projects/ksam-deal.png";
import ecommerceImage from "../assets/projects/e-commerce.png";


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

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


$$(".certificate-view").forEach((button) => {

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
    (event) => {

        if (
            event.target ===
            event.currentTarget
        ) {

            event.currentTarget.close();

        }

    }
);


/* =========================================================
   PROJECT DATA
========================================================= */

/*
   projects.json is imported at the top.

   IMPORTANT:
   Do NOT use:

   fetch("./src/data/projects.json")

   Do NOT use:

   let projects = [];

   and then assign projects later.

   We directly create the projects array here.
*/

const projects =
    Array.isArray(projectsData)
        ? projectsData
        : Array.isArray(projectsData?.projects)
            ? projectsData.projects
            : [];


let activeFilter = "All";


/* =========================================================
   PROJECT ELEMENTS
========================================================= */

const projectGrid =
    $("#projectGrid");

const filters =
    $("#projectFilters");

const search =
    $("#projectSearch");


/* =========================================================
   PROJECT IMAGE MAP
========================================================= */

/*
   Because project images are inside:

   src/assets/projects/

   Vite needs to process them.

   These imports are converted into the
   correct hashed production URLs during build.
*/

const projectImages = {

    "ksam-deal.png":
        ksamDealImage,

    "e-commerce.png":
        ecommerceImage

};


/* =========================================================
   GET PROJECT IMAGE
========================================================= */

function getProjectImage(path) {

    if (!path) {
        return "";
    }

    /*
       Get only the filename.

       This allows all of these to work:

       src/assets/projects/ksam-deal.png
       assets/projects/ksam-deal.png
       ./src/assets/projects/ksam-deal.png
       ksam-deal.png
    */

    const filename =
        path
            .split("/")
            .pop()
            ?.trim();

    if (
        filename &&
        projectImages[filename]
    ) {

        return projectImages[filename];

    }

    /*
       Fallback for assets that may already
       exist in public/.
    */

    const cleanPath =
        path.replace(/^\.?\//, "");

    return `${import.meta.env.BASE_URL}${cleanPath}`;

}


/* =========================================================
   RENDER PROJECT FILTERS
========================================================= */

function renderFilters() {

    if (!filters) {
        return;
    }


    const categories = [
        "All",

        ...new Set(
            projects
                .map(
                    (project) =>
                        project.category
                )
                .filter(Boolean)
        ),

        "Frontend",
        "JavaScript"
    ];


    filters.innerHTML =
        categories
            .map(
                (category) => `

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

                `
            )
            .join("");


    $$(".filter-btn").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    activeFilter =
                        button.dataset.filter;

                    renderFilters();

                    renderProjects();

                }
            );

        }
    );

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

    if (!projectGrid) {
        return;
    }


    const query =
        search?.value
            ?.trim()
            .toLowerCase() || "";


    const list =
        projects.filter(
            (project) => {

                const technologies =
                    project.technologies || [];


                /* -----------------------------------------
                   CATEGORY FILTER
                ----------------------------------------- */

                const matchesCategory =
                    activeFilter === "All" ||

                    project.category ===
                        activeFilter ||

                    (
                        activeFilter ===
                        "Frontend" &&

                        technologies.some(
                            (technology) =>
                                /html|css|javascript/i
                                    .test(technology)
                        )
                    ) ||

                    (
                        activeFilter ===
                        "JavaScript" &&

                        technologies.some(
                            (technology) =>
                                /javascript/i
                                    .test(technology)
                        )
                    );


                /* -----------------------------------------
                   SEARCH
                ----------------------------------------- */

                const searchableText = `

                    ${project.title || ""}

                    ${project.description || ""}

                    ${technologies.join(" ")}

                    ${project.category || ""}

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

            }
        );


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
            .map(
                (project) => {

                    const projectIndex =
                        projects.indexOf(
                            project
                        );


                    const image =
                        getProjectImage(
                            project.image
                        );


                    return `

                        <article
                            class="project-card reveal visible"
                        >

                            <!-- PROJECT IMAGE -->

                            <div
                                class="project-preview"
                            >

                                ${
                                    image
                                        ? `

                                            <img
                                                src="${image}"
                                                alt="${project.title || "Project image"}"
                                                class="project-preview-image"
                                                loading="lazy"
                                            >

                                        `
                                        : `

                                            <div
                                                class="project-preview-placeholder"
                                            >

                                                <span>
                                                    ${
                                                        project.title ||
                                                        "Project"
                                                    }
                                                </span>

                                            </div>

                                        `
                                }

                            </div>


                            <!-- PROJECT CONTENT -->

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
                                    ${
                                        project.title ||
                                        "Untitled Project"
                                    }
                                </h3>


                                ${
                                    project.tagline
                                        ? `
                                            <p class="project-tagline">
                                                ${project.tagline}
                                            </p>
                                        `
                                        : ""
                                }


                                <p>
                                    ${
                                        project.description ||
                                        ""
                                    }
                                </p>


                                <!-- TECHNOLOGIES -->

                                <div
                                    class="tags"
                                >

                                    ${
                                        (
                                            project.technologies ||
                                            []
                                        )
                                            .map(
                                                (technology) => `

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


                                <!-- ACTIONS -->

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

                }
            )
            .join("");


    /* =====================================================
       DETAILS BUTTONS
    ===================================================== */

    $$(".details").forEach(
        (button) => {

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

        }
    );

}


/* =========================================================
   PROJECT DETAILS MODAL
========================================================= */

function openModal(project) {

    const modal =
        $("#projectModal");

    const modalBody =
        $("#modalBody");


    if (
        !modal ||
        !modalBody ||
        !project
    ) {

        return;

    }


    modalBody.innerHTML = `

        <p class="eyebrow">
            Project details
        </p>


        <h2>
            ${project.title || ""}
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

                    <h3>
                        Problem
                    </h3>

                    <p>
                        ${project.problem}
                    </p>

                `
                : ""
        }


        ${
            project.solution
                ? `

                    <h3>
                        Solution
                    </h3>

                    <p>
                        ${project.solution}
                    </p>

                `
                : ""
        }


        ${
            project.features?.length
                ? `

                    <h3>
                        Features
                    </h3>

                    <ul>

                        ${project.features
                            .map(
                                (feature) => `

                                    <li>
                                        ${feature}
                                    </li>

                                `
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

            ${
                (project.technologies || [])
                    .map(
                        (technology) => `

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
                                (item) => `

                                    <li>
                                        ${item}
                                    </li>

                                `
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
   PROJECT MODAL CLOSE
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
    (event) => {

        if (
            event.target ===
            event.currentTarget
        ) {

            event.currentTarget.close();

        }

    }
);


/* =========================================================
   PROJECT SEARCH
========================================================= */

search?.addEventListener(
    "input",
    renderProjects
);


/* =========================================================
   INITIALIZE SKILLS + JOURNEY
========================================================= */

function initData() {

    try {

        /*
           PROJECTS

           No assignment is required here.

           projects already contains projectsData.
        */

        renderFilters();

        renderProjects();


        /* -----------------------------------------
           SKILLS
        ----------------------------------------- */

        const skillCategories =
            $("#skillCategories");


        if (skillCategories) {

            skillCategories.innerHTML =
                skillsData
                    .map(
                        (skill) => `

                            <div
                                class="skill-category reveal"
                            >

                                <h3>
                                    ${skill.category}
                                </h3>


                                ${
                                    (skill.items || [])
                                        .map(
                                            ([name, description]) => `

                                                <div
                                                    class="skill-card"
                                                >

                                                    <b>
                                                        ${name}
                                                    </b>

                                                    <span>
                                                        ${description}
                                                    </span>

                                                </div>

                                            `
                                        )
                                        .join("")
                                }

                            </div>

                        `
                    )
                    .join("");

        }


        /* -----------------------------------------
           JOURNEY
        ----------------------------------------- */

        const timeline =
            $("#timeline");


        if (timeline) {

            timeline.innerHTML =
                journeyData
                    .map(
                        (journey) => `

                            <article
                                class="timeline-item reveal"
                            >

                                <span
                                    class="year"
                                >
                                    ${journey.year}
                                </span>


                                <h3>
                                    ${journey.title}
                                </h3>


                                <p>
                                    ${journey.description}
                                </p>


                                <div
                                    class="tags"
                                >

                                    ${
                                        (
                                            journey.technologies ||
                                            []
                                        )
                                            .map(
                                                (technology) => `

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

                        `
                    )
                    .join("");

        }


        observeReveals();


    } catch (error) {

        console.error(
            "Error initializing portfolio:",
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
            (entries) => {

                entries.forEach(
                    (entry) => {

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
        (element) =>
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
            String(Boolean(isOpen))
        );

    }
);


$$(".nav-links a").forEach(
    (link) => {

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
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        navItems.forEach(
                            (link) => {

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
    (section) =>
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

/*
   IMPORTANT:

   Do NOT handle contact form submission here.

   contact.js handles Formspree.

   Therefore there is NO:

   event.preventDefault()

   here.
*/


/* =========================================================
   START APPLICATION
========================================================= */

initData();