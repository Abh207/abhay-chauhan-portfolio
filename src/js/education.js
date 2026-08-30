/* =========================================================
   EDUCATION DATA
   CHANGE YOUR DETAILS HERE IN THE FUTURE
========================================================= */

// const educationData = {

//     current: {

//         status: "CURRENT",

//         startYear: 2025,

//         endYear: 2029,

//         degree:
//             "B.Tech — Computer Science & Engineering",

//         university:
//             "Lovely Professional University",

//         semester:
//             "3rd Semester",

//         semesterNumber:
//             3,

//         cgpa:
//             8.94,

//         description:
//             "B.Tech CSE student, developing skills across programming, web development, databases, algorithms, and data-oriented problem solving."

//     }

// };


// /* =========================================================
//    INITIALIZE EDUCATION CARD
// ========================================================= */

// function initEducationCard() {

//     const data = educationData.current;


//     const elements = {

//         status:
//             document.getElementById("eduStatus"),

//         startYear:
//             document.getElementById("eduStartYear"),

//         endYear:
//             document.getElementById("eduEndYear"),

//         degree:
//             document.getElementById("eduDegree"),

//         university:
//             document.getElementById("eduUniversity"),

//         semester:
//             document.getElementById("eduSemester"),

//         semesterMini:
//             document.getElementById("eduSemesterMini"),

//         cgpa:
//             document.getElementById("eduCgpa"),

//         progress:
//             document.getElementById("eduProgress"),

//         progressValue:
//             document.getElementById("eduProgressValue"),

//         description:
//             document.getElementById("eduDescription")

//     };


//     /* =====================================================
//        UPDATE TEXT
//     ===================================================== */

//     elements.status.textContent =
//         data.status;

//     elements.startYear.textContent =
//         data.startYear;

//     elements.endYear.textContent =
//         data.endYear;

//     elements.degree.textContent =
//         data.degree;

//     elements.university.textContent =
//         data.university;

//     elements.semester.textContent =
//         data.semester;

//     elements.semesterMini.textContent =
//         `Semester ${data.semesterNumber}`;

//     elements.cgpa.textContent =
//         Number(data.cgpa).toFixed(2);

//     elements.description.textContent =
//         data.description;


//     /* =====================================================
//        CALCULATE CGPA PERCENTAGE
//     ===================================================== */

//     const cgpa =
//         Math.min(
//             10,
//             Math.max(
//                 0,
//                 Number(data.cgpa) || 0
//             )
//         );


//     const percentage =
//         cgpa * 10;


//     /* =====================================================
//        UPDATE PROGRESS RING
//     ===================================================== */

//     elements.progress.style
//         .setProperty(
//             "--progress",
//             `${percentage}%`
//         );


//     elements.progressValue.textContent =
//         `${Math.round(percentage)}%`;


//     elements.progress.setAttribute(
//         "aria-label",
//         `Current CGPA ${cgpa.toFixed(2)} out of 10`
//     );

// }


// /* =========================================================
//    ANIMATED NUMBER
// ========================================================= */

// function animateCgpa() {

//     const element =
//         document.getElementById("eduCgpa");

//     if (!element) return;


//     const target =
//         Number(educationData.current.cgpa) || 0;


//     const duration = 1100;

//     const startTime =
//         performance.now();


//     function update(currentTime) {

//         const elapsed =
//             currentTime - startTime;


//         const progress =
//             Math.min(
//                 elapsed / duration,
//                 1
//             );


//         /* Ease out */
//         const eased =
//             1 - Math.pow(
//                 1 - progress,
//                 3
//             );


//         const value =
//             target * eased;


//         element.textContent =
//             value.toFixed(2);


//         if (progress < 1) {

//             requestAnimationFrame(update);

//         } else {

//             element.textContent =
//                 target.toFixed(2);

//         }

//     }


//     requestAnimationFrame(update);

// }


// /* =========================================================
//    MOUSE TILT EFFECT
// ========================================================= */

// function initEducationTilt() {

//     const card =
//         document.getElementById(
//             "currentEducationCard"
//         );


//     if (!card) return;


//     /* Don't run tilt on touch devices */

//     if (
//         window.matchMedia(
//             "(hover: hover) and (pointer: fine)"
//         ).matches === false
//     ) {
//         return;
//     }


//     card.addEventListener(
//         "pointermove",
//         event => {

//             const rect =
//                 card.getBoundingClientRect();


//             const x =
//                 event.clientX - rect.left;


//             const y =
//                 event.clientY - rect.top;


//             const rotateY =
//                 ((x / rect.width) - .5) * 5;


//             const rotateX =
//                 ((y / rect.height) - .5) * -5;


//             card.style.transform =
//                 `perspective(1200px)
//                  rotateX(${rotateX}deg)
//                  rotateY(${rotateY}deg)
//                  translateY(-8px)`;

//         }
//     );


//     card.addEventListener(
//         "pointerleave",
//         () => {

//             card.style.transform = "";

//         }
//     );

// }


// /* =========================================================
//    START
// ========================================================= */

// function initEducation() {

//     initEducationCard();

//     animateCgpa();

//     initEducationTilt();

// }


// if (
//     document.readyState === "loading"
// ) {

//     document.addEventListener(
//         "DOMContentLoaded",
//         initEducation
//     );

// } else {

//     initEducation();

// }










const educationData = {

    current: {

        status: "CURRENT",

        startYear: 2025,
        endYear: 2029,

        degree:
            "B.Tech — Computer Science & Engineering",

        university:
            "Lovely Professional University",

        semester:
            "3rd Semester",

        semesterNumber:
            3,

        cgpa:
            8.94,

        description:
            "B.Tech CSE student, developing skills across programming, web development, databases, algorithms, and data-oriented problem solving."

    },


    class12: {

        label:
            "CLASS 12",

        title:
            "Senior Secondary",

        school:
            "Balaji Global Academy",

        location:
            "Mainpuri, Uttar Pradesh",

        startYear:
            2022,

        endYear:
            2024,

        score:
            95,

        description:
            "Completed senior secondary education with a strong academic performance and foundation for higher studies."

    },


    class10: {

        label:
            "CLASS 10",

        title:
            "Secondary Education",

        school:
            "Balaji Global Academy",

        location:
            "Mainpuri, Uttar Pradesh",

        startYear:
            2021,

        endYear:
            2022,

        score:
            86,

        description:
            "Completed secondary education with a solid academic record and strong foundation in core subjects."

    }

};
