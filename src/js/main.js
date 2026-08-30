const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const certificateModal=$("#certificateModal"), certificateClose=$("#certificateClose"), certificateModalImage=$("#certificateModalImage");
$$(".certificate-view").forEach(button=>button.addEventListener("click",()=>{certificateModalImage.src=button.dataset.certificate;certificateModalImage.alt="Full certificate preview";certificateModal.showModal()}));
certificateClose?.addEventListener("click",()=>certificateModal.close());
certificateModal?.addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});

async function loadJSON(path){const r=await fetch(path);if(!r.ok)throw new Error(`Could not load ${path}`);return r.json()}

const projectGrid=$("#projectGrid"), filters=$("#projectFilters"), search=$("#projectSearch");
let projects=[], activeFilter="All";

function renderFilters(){
  const cats=["All",...new Set(projects.map(p=>p.category)),"Frontend","JavaScript"];
  filters.innerHTML=cats.map(c=>`<button class="filter-btn ${c===activeFilter?"active":""}" data-filter="${c}">${c}</button>`).join("");
  $$(".filter-btn").forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;renderFilters();renderProjects()});
}
function renderProjects(){
  const q=search.value.trim().toLowerCase();
  const list=projects.filter(p=>{
    const matchCat=activeFilter==="All"||p.category===activeFilter||(activeFilter==="Frontend"&&p.technologies.some(t=>/html|css|javascript/i.test(t)))||(activeFilter==="JavaScript"&&p.technologies.some(t=>/javascript/i.test(t)));
    return matchCat && (`${p.title} ${p.description} ${p.technologies.join(" ")}`.toLowerCase().includes(q));
  });
  projectGrid.innerHTML=list.length?list.map((p,i)=>`
    <article class="project-card reveal visible">
      <div class="project-preview"><div class="project-preview-inner"></div></div>
      <div class="project-content"><span class="status">${p.status||"Project"}</span><h3>${p.title}</h3><p>${p.description}</p>
      <div class="tags">${p.technologies.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="project-actions"><a class="small-btn" href="${p.github}" target="_blank" rel="noreferrer">GitHub ↗</a><a class="small-btn" href="${p.liveDemo}" target="_blank" rel="noreferrer">Live Demo ↗</a><button class="small-btn details" data-index="${projects.indexOf(p)}">View Details</button></div></div>
    </article>`).join(""):`<p class="muted">No projects match your search.</p>`;
  $$(".details").forEach(b=>b.onclick=()=>openModal(projects[+b.dataset.index]));
}
function openModal(p){
  $("#modalBody").innerHTML=`<p class="eyebrow">Project details</p><h2>${p.title}</h2><p>${p.description}</p>
  <h3>Problem</h3><p>${p.problem}</p><h3>Solution</h3><p>${p.solution}</p><h3>Features</h3><ul>${p.features.map(x=>`<li>${x}</li>`).join("")}</ul>
  <h3>Technologies</h3><div class="tags">${p.technologies.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
  <h3>Development process</h3><p>${p.process}</p><h3>Challenges</h3><p>${p.challenges}</p><h3>Future improvements</h3><ul>${p.future.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="project-actions"><a class="small-btn" href="${p.github}" target="_blank" rel="noreferrer">GitHub ↗</a><a class="small-btn" href="${p.liveDemo}" target="_blank" rel="noreferrer">Live Demo ↗</a></div>`;
  $("#projectModal").showModal();
}
$("#modalClose").onclick=()=>$("#projectModal").close();
$("#projectModal").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
search.oninput=renderProjects;

async function initData(){
  try{
    [projects]=await Promise.all([loadJSON("/src/data/projects.json")]);
    renderFilters();renderProjects();
    const skills=await loadJSON("/src/data/skills.json");
    $("#skillCategories").innerHTML=skills.map(s=>`<div class="skill-category reveal">${`<h3>${s.category}</h3>`}${s.items.map(([n,d])=>`<div class="skill-card"><b>${n}</b><span>${d}</span></div>`).join("")}</div>`).join("");
    const journey=await loadJSON("/src/data/journey.json");
    $("#timeline").innerHTML=journey.map(j=>`<article class="timeline-item reveal"><span class="year">${j.year}</span><h3>${j.title}</h3><p>${j.description}</p><div class="tags">${j.technologies.map(t=>`<span class="tag">${t}</span>`).join("")}</div></article>`).join("");
    observeReveals();
  }catch(err){console.error(err)}
}

function observeReveals(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));
}
const nav=$("#navbar");
window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30),{passive:true});

const menu=$("#menuToggle"), navLinks=$("#navLinks");
menu.onclick=()=>{const open=navLinks.classList.toggle("open");menu.setAttribute("aria-expanded",open)};
$$(".nav-links a").forEach(a=>a.onclick=()=>navLinks.classList.remove("open"));

const saved=localStorage.getItem("theme"), system=matchMedia("(prefers-color-scheme: light)").matches;
document.documentElement.dataset.theme=saved||(system?"light":"dark");
$("#themeToggle").onclick=()=>{const next=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=next;localStorage.setItem("theme",next)};

const sections=$$("main section[id]"), navItems=$$(".nav-links a");
const sectionObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navItems.forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${e.target.id}`))}}),{rootMargin:"-35% 0px -55%"});
sections.forEach(s=>sectionObserver.observe(s));

$("#backTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
$("#contactForm").onsubmit=(e)=>{
  e.preventDefault();
  const status=$("#formStatus"), name=$("#name"), email=$("#email"), message=$("#message");
  if(!name.value.trim()||!email.validity.valid||!message.value.trim()){status.textContent="Please complete all fields correctly.";return}
  status.textContent="Form validated. Connect your preferred form/email endpoint in contact.js to send it.";
};

initData();