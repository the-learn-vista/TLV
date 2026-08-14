
const exams = [
  {name:"JEE Main",type:"Engineering Entrance",level:"National",status:"Annual",tag:"Engineering"},
  {name:"NEET UG",type:"Medical Entrance",level:"National",status:"Annual",tag:"Medical"},
  {name:"CUET UG",type:"University Entrance",level:"National",status:"Annual",tag:"University"},
  {name:"NDA & NA",type:"Defence Entrance",level:"National",status:"Multiple cycles",tag:"Defence"},
  {name:"Assam HSLC",type:"Board Examination",level:"Assam",status:"Annual",tag:"Board"},
  {name:"Assam HS 1st Year",type:"Higher Secondary",level:"Assam",status:"Annual",tag:"Board"}
];
const scholarships = [
  {name:"National Scholarship Portal",type:"Government",eligibility:"Students meeting the relevant scheme criteria",deadline:"Check official portal",tag:"Government"},
  {name:"PM-USP Scholarship",type:"Government",eligibility:"Eligible higher-education students under the scheme",deadline:"Check official notification",tag:"Higher Education"},
  {name:"State Scholarship Opportunities",type:"State",eligibility:"Assam students meeting individual scheme rules",deadline:"Varies by scheme",tag:"Assam"},
  {name:"Institutional Scholarships",type:"Institutional",eligibility:"Varies by institution",deadline:"Varies",tag:"Institutional"}
];
const updates = [
  {title:"Welcome to the new TLV platform",date:"Coming soon",text:"The Learn Vista is being rebuilt as a focused digital learning and opportunity hub."},
  {title:"Exam & scholarship information",date:"Ongoing",text:"Use the dedicated sections to discover opportunities and preparation resources."},
  {title:"Events archive",date:"Ongoing",text:"Academic and general event media will be organized separately for easy access."}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function renderExams(list=exams){
  const grid=$("#examGrid");
  grid.innerHTML=list.length ? list.map((e,i)=>`
    <article class="exam-card">
      <span class="number">0${i+1}</span>
      <h3>${e.name}</h3>
      <p>${e.type}</p>
      <div class="exam-meta"><span>${e.level}</span><span class="exam-tag">${e.tag}</span></div>
      <div class="exam-meta"><span>Status</span><span>${e.status}</span></div>
    </article>`).join("") : `<div class="exam-card"><h3>No matching exam</h3><p>Try another search or category.</p></div>`;
}
function renderScholarships(list=scholarships){
  $("#scholarGrid").innerHTML=list.map(s=>`
    <article class="scholar-card">
      <div><h3>${s.name}</h3><p>${s.eligibility}</p><div class="scholar-deadline">Deadline: ${s.deadline}</div></div>
      <span class="scholar-badge">${s.tag}</span>
    </article>`).join("");
}
function renderUpdates(){
  $("#updatesGrid").innerHTML=updates.map(u=>`
    <article class="update-card"><span class="date">${u.date}</span><h3>${u.title}</h3><p>${u.text}</p></article>`).join("");
}
renderExams(); renderScholarships(); renderUpdates();
$("#year").textContent=new Date().getFullYear();

const loader=$("#loader");
window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("hide"),550));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
$$(".reveal").forEach(el=>observer.observe(el));

const menu=$(".menu-toggle"), nav=$("#mainNav");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
$$(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const resourceSearch=$("#resourceSearch");
let resourceFilter="all";
function filterResources(){
  const q=resourceSearch.value.toLowerCase().trim();
  $$(".resource-card").forEach(card=>{
    const matchType=resourceFilter==="all"||card.dataset.type===resourceFilter;
    const matchText=card.dataset.search.includes(q);
    card.classList.toggle("hidden",!(matchType&&matchText));
  });
}
resourceSearch.addEventListener("input",filterResources);
$$(".pill").forEach(p=>p.addEventListener("click",()=>{$$(".pill").forEach(x=>x.classList.remove("active"));p.classList.add("active");resourceFilter=p.dataset.filter;filterResources()}));

function filterExams(){
  const q=$("#examSearch").value.toLowerCase().trim();
  const f=$("#examFilter").value;
  renderExams(exams.filter(e=>(f==="all"||e.tag===f)&&(`${e.name} ${e.type} ${e.level} ${e.tag}`).toLowerCase().includes(q)));
}
$("#examSearch").addEventListener("input",filterExams);
$("#examFilter").addEventListener("change",filterExams);

$$(".event-tab").forEach(tab=>tab.addEventListener("click",()=>{
  $$(".event-tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
  const academic=tab.dataset.event==="academic";
  $("#academicEvents").classList.toggle("active",academic);
  $("#generalEvents").classList.toggle("active",!academic);
}));

const toast=$("#toast");
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove("show"),2500)}
$$("[data-toast]").forEach(b=>b.addEventListener("click",()=>showToast(b.dataset.toast)));

const modal=$("#searchModal");
$("#searchOpen").addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");$("#globalSearch").focus()});
$("#searchClose").addEventListener("click",()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")});
modal.addEventListener("click",e=>{if(e.target===modal)$("#searchClose").click()});

const globalItems=[
  ...exams.map(x=>({title:x.name,type:"Exam",href:"#exams",text:`${x.type} • ${x.level}`})),
  ...scholarships.map(x=>({title:x.name,type:"Scholarship",href:"#scholarships",text:x.tag})),
  {title:"Learning Resources",type:"Learning",href:"#learn",text:"Notes, tools and guides"},
  {title:"Academic Events",type:"Events",href:"#events",text:"Photos and videos"},
  {title:"General Events",type:"Events",href:"#events",text:"Photos and videos"},
  {title:"TLV Updates",type:"Updates",href:"#updates",text:"Latest platform updates"}
];
function globalSearch(){
  const q=$("#globalSearch").value.toLowerCase().trim();
  const results=q?globalItems.filter(x=>(x.title+" "+x.type+" "+x.text).toLowerCase().includes(q)):globalItems.slice(0,5);
  $("#globalResults").innerHTML=results.length?results.map(x=>`<a class="global-result" href="${x.href}" onclick="document.querySelector('#searchClose').click()"><div><b>${x.title}</b><br><small>${x.text}</small></div><span>${x.type}</span></a>`).join(""):`<p>No matching TLV result. Try another keyword.</p>`;
}
$("#globalSearch").addEventListener("input",globalSearch);
