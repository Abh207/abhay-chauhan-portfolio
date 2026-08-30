/* =========================================================
   EVENT GALLERY LIGHTBOX
========================================================= */

const galleryItems = [

    {
        src: "src/assets/events/mehfil-e-mushaira-group.jpg",
        caption: "Mehfil-E-Mushaira — Event"
    },

    {
        src: "src/assets/events/Eventclub.png",
        caption: "Mehfil-E-Mushaira — Crew"
    },

    {
        src: "src/assets/events/mehfil-e-mushaira-crew.jpg",
        caption: "Mehfil-E-Mushaira — Audience"
    },

    {
        src: "src/assets/events/Eventbanner.png",
        caption: "Mehfil-E-Mushaira — Event Posters"
    }

];


const lightbox =
    document.getElementById(
        "galleryLightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const lightboxCounter =
    document.getElementById(
        "lightboxCounter"
    );

const lightboxCaption =
    document.getElementById(
        "lightboxCaption"
    );

const closeButton =
    document.getElementById(
        "lightboxClose"
    );

const previousButton =
    document.getElementById(
        "lightboxPrev"
    );

const nextButton =
    document.getElementById(
        "lightboxNext"
    );

const galleryButtons =
    document.querySelectorAll(
        "[data-gallery-index]"
    );


let currentGalleryIndex = 0;


/* =========================================================
   SHOW IMAGE
========================================================= */

function showGalleryImage(index) {

    if (!galleryItems.length) return;


    currentGalleryIndex =
        (index + galleryItems.length)
        % galleryItems.length;


    const item =
        galleryItems[
            currentGalleryIndex
        ];


    lightboxImage.src =
        item.src;

    lightboxImage.alt =
        item.caption;

    lightboxCaption.textContent =
        item.caption;

    lightboxCounter.textContent =
        `${currentGalleryIndex + 1} / ${galleryItems.length}`;


    /* Update thumbnails */

    document
        .querySelectorAll(
            ".gallery-thumb"
        )
        .forEach(
            (thumb, index) => {

                thumb.classList.toggle(
                    "active",
                    index === currentGalleryIndex
                );

            }
        );
}


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openGallery(index) {

    showGalleryImage(index);

    lightbox.classList.add(
        "active"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    closeButton.focus();
}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeGallery() {

    lightbox.classList.remove(
        "active"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   GALLERY CLICK
========================================================= */

galleryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset
                            .galleryIndex
                    );

                openGallery(index);

            }
        );

    }
);


/* =========================================================
   CLOSE
========================================================= */

closeButton.addEventListener(
    "click",
    closeGallery
);


/* =========================================================
   NEXT
========================================================= */

nextButton.addEventListener(
    "click",
    () => {

        showGalleryImage(
            currentGalleryIndex + 1
        );

    }
);


/* =========================================================
   PREVIOUS
========================================================= */

previousButton.addEventListener(
    "click",
    () => {

        showGalleryImage(
            currentGalleryIndex - 1
        );

    }
);


/* =========================================================
   CLICK BACKDROP TO CLOSE
========================================================= */

lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            closeGallery();

        }

    }
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList.contains(
                "active"
            )
        ) {
            return;
        }


        if (event.key === "Escape") {

            closeGallery();

        }


        if (event.key === "ArrowRight") {

            showGalleryImage(
                currentGalleryIndex + 1
            );

        }


        if (event.key === "ArrowLeft") {

            showGalleryImage(
                currentGalleryIndex - 1
            );

        }

    }
);