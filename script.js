const LOGO_SRC = "logo.jpeg";

function esc(str){
  const d = document.createElement('div');
  d.innerText = str;
  return d.innerHTML;
}

function levelFor(pct){
  if(pct >= 75) return {label:'EXCELLENT', color:'#2D6A4F'};
  if(pct >= 60) return {label:'SATISFACTORY', color:'#1D4ED8'};
  return {label:'NEEDS IMPROVEMENT', color:'#E76F00'};
}

function parseTimeToSec(str){
  if(!str) return 0;
  const parts = str.split(':').map(s=>parseInt(s,10)||0);
  if(parts.length===2) return parts[0]*60+parts[1];
  if(parts.length===1) return parts[0];
  return 0;
}
function secToTimeStr(sec){
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec/60), s = sec%60;
  return m + ' Min ' + s + ' Sec';
}
function secToMin(sec){ return sec/60; }

function buildCoverPage(data){
  const subjRows = data.subjects.map(s=>{
    const pct = (s.scored/s.total*100);
    const lvl = levelFor(pct);
    return `<tr>
      <td style="text-align:left;font-weight:600;">${esc(s.name)}</td>
      <td>${s.scored} / ${s.total}</td>
      <td>${pct.toFixed(2)}%</td>
      <td><span class="level-tag" style="background:${lvl.color}">${lvl.label}</span></td>
    </tr>`;
  }).join('');

  const cards = data.subjects.map(s=>{
    return `<div class="subj-card">
      <div class="icon-title">
        <div class="icon" style="background:${esc(s.color)}"></div>
        <b style="color:${esc(s.color)}">${esc(s.name.toUpperCase())}</b>
      </div>
      <p>${esc(s.note)}</p>
    </div>`;
  }).join('');

  const strengthsLi = data.strengths.map(x=>`<li>${esc(x)}</li>`).join('');
  const attentionLi = data.attentions.map(x=>`<li>${esc(x)}</li>`).join('');

  return `
  <div class="page cover-page">
    <div class="cover-header">
      <div class="brandrow">
        <img src="${LOGO_SRC}">
        <div class="titles">
          <h1>LAKSHYA</h1>
          <p>FELLOWSHIP PROGRAMME</p>
        </div>
      </div>
      <div class="subtitle-bar">BASELINE ASSESSMENT REPORT &ndash; ${esc(data.studentName).toUpperCase()}</div>
    </div>

    <div class="info-row">
      <div class="col"><b>Student Name:</b> ${esc(data.studentName)}<br><b>Assessment Type:</b> ${esc(data.assessmentType)}</div>
      <div class="col"><b>Subjects Assessed:</b> ${esc(data.subjectsAssessed)}<br><b>Purpose:</b> ${esc(data.purpose)}</div>
    </div>

    <div class="section-title"><span class="num">1</span><span class="t">EXECUTIVE SUMMARY</span></div>
    <div class="two-col">
      <div class="exec-box">${esc(data.execSummary)}</div>
      <table class="perf-table">
        <tr><th>Subject</th><th>Marks</th><th>Accuracy</th><th>Level</th></tr>
        ${subjRows}
      </table>
    </div>

    <div class="section-title"><span class="num">2</span><span class="t">SUBJECT ANALYSIS</span></div>
    <div class="cards-row">${cards}</div>

    <div class="section-title"><span class="num">3</span><span class="t">STRENGTHS &amp; AREAS TO IMPROVE</span></div>
    <div class="two-col-boxes">
      <div class="box-strength"><h4>STRENGTHS</h4><ul>${strengthsLi}</ul></div>
      <div class="box-attention"><h4>AREAS REQUIRING ATTENTION</h4><ul>${attentionLi}</ul></div>
    </div>

    <div class="plan-box"><b>Recommended Academic Support Plan:</b> ${esc(data.supportPlan)}</div>
    <div class="eval-box"><b>Overall Evaluation:</b> ${esc(data.overallEval)}</div>
    <div class="footer-tag">&#9733; Stay Focused. Keep Learning. Achieve Your Dreams. &#9733;</div>
  </div>`;
}

function buildPerfPage(t, canvasIdDonut, canvasIdBar){
  const total = t.totalQ, attempted = t.attemptedQ, correct = t.correctQ;
  const incorrect = Math.max(0, attempted - correct);
  const unattempted = Math.max(0, total - attempted);
  const scorePct = total>0 ? (correct/total*100) : 0;
  const accuracyPct = attempted>0 ? (correct/attempted*100) : 0;
  const sectionTimeSec = parseTimeToSec(t.sectionTime);
  const unattemptedTimeSec = parseTimeToSec(t.unattemptedTime);
  const utilisedTimeSec = Math.max(0, sectionTimeSec - unattemptedTimeSec);
  const perQSec = total>0 ? Math.round(sectionTimeSec/total) : 0;

  const overviewNote = `You attempted ${Math.round((attempted>0?correct/attempted*100:0))}% questions correct in ${esc(t.sectionName)}.<br>Keep practicing to increase your score!<br><br>Your overall performance for the test.`;

  return {
    html: `
    <div class="page perf-page">
      <div class="perf-page-title">
        <h1>PERFORMANCE REPORT</h1>
        <h2>${esc(t.testName)}</h2>
        <div class="rule"></div>
      </div>

      <div class="info-bar">
        <div class="cell"><div class="lab">SUBJECT</div><div class="val">${esc(t.subject)}</div></div>
        <div class="cell"><div class="lab">TEST</div><div class="val">${esc(t.testName)}</div></div>
        <div class="cell"><div class="lab">TIME/QUESTION</div><div class="val">${secToTimeStr(perQSec)}</div></div>
      </div>

      <div class="stats-bar">
        <div class="cell"><div class="lab">SCORE</div><div class="val" style="color:#1D4ED8">${correct.toFixed(2)} / ${total}</div></div>
        <div class="cell"><div class="lab">ACCURACY</div><div class="val" style="color:#0E9F6E">${accuracyPct.toFixed(2)}%</div></div>
        <div class="cell"><div class="lab">ATTEMPTED</div><div class="val" style="color:#7C3AED">${attempted} / ${total}</div></div>
        <div class="cell"><div class="lab">CORRECT</div><div class="val" style="color:#0E9F6E">${correct} / ${total}</div></div>
        <div class="cell"><div class="lab">INCORRECT</div><div class="val" style="color:#DC2626">${incorrect} / ${total}</div></div>
        <div class="cell"><div class="lab">TIME/QUES</div><div class="val" style="color:#D97706">${secToTimeStr(perQSec)}</div></div>
      </div>

      <div class="overview-title">OVERVIEW</div>
      <div class="overview-row">
        <div class="donut-wrap">${t.overviewImage ? `<img class="overview-uploaded" src="${t.overviewImage}">` : `<canvas id="${canvasIdDonut}" width="240" height="220"></canvas>`}</div>
        <div class="overview-note">${overviewNote}</div>
      </div>

      <div class="section-perf-title">SECTION-WISE PERFORMANCE</div>
      <table class="section-table">
        <tr><th>SECTION</th><th>ATTEMPTED</th><th>CORRECT</th><th>ACCURACY</th><th>TIME TAKEN</th></tr>
        <tr>
          <td style="color:#1D4ED8;font-weight:700;">${esc(t.sectionName)}</td>
          <td style="color:#7C3AED;">${attempted} / ${total}</td>
          <td style="color:#0E9F6E;">${correct} / ${total}</td>
          <td style="color:#1D4ED8;">${accuracyPct.toFixed(2)}%</td>
          <td>${t.sectionTime}</td>
        </tr>
      </table>

      <div class="time-title">TIME ANALYSIS (SECTION-WISE)</div>
      <div class="time-chart-wrap"><canvas id="${canvasIdBar}" width="700" height="100"></canvas></div>
    </div>`,
    chartData: { correct, incorrect, unattempted, utilisedTimeMin: secToMin(utilisedTimeSec), unattemptedTimeMin: secToMin(unattemptedTimeSec), sectionName: t.sectionName }
  };
}

function guardTextSpacing(root){
  if(!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let node;
  while((node = walker.nextNode())) nodes.push(node);
  nodes.forEach(n=>{
    if(n.nodeValue && n.nodeValue.indexOf(' ') !== -1){
      // Insert a real extra non-breaking-space character next to every normal
      // space between two words. This guarantees a visible gap at the DOM/text
      // level, independent of font metrics, kerning, ligatures, or word-spacing —
      // so it cannot be defeated by any font-rendering rounding bug.
      n.nodeValue = n.nodeValue.replace(/ (?=\S)/g, ' \u00A0');
    }
  });
}

function collectSubjects(){
  const blocks = document.querySelectorAll('.subject-block[data-subject]');
  const subjects = [];
  blocks.forEach(b=>{
    const name = b.getAttribute('data-subject');
    const label = b.getAttribute('data-label') || (name.charAt(0).toUpperCase()+name.slice(1));
    subjects.push({
      name: label,
      scored: parseFloat(b.querySelector('.marksScored').value)||0,
      total: parseFloat(b.querySelector('.totalMarks').value)||1,
      color: b.querySelector('.cardColor').value || '#2D6A4F',
      note: b.querySelector('.analysisNote').value
    });
  });
  return subjects;
}

function collectTests(){
  const blocks = document.querySelectorAll('.subject-block[data-testblock]');
  const tests = [];
  blocks.forEach(b=>{
    const subject = b.getAttribute('data-testblock');
    const subjectLabel = b.getAttribute('data-label') || (subject.charAt(0).toUpperCase()+subject.slice(1));
    tests.push({
      subject: subjectLabel,
      testName: b.querySelector('.testName').value,
      sectionName: b.querySelector('.sectionName').value,
      totalQ: parseInt(b.querySelector('.totalQ').value)||1,
      attemptedQ: parseInt(b.querySelector('.attemptedQ').value)||0,
      correctQ: parseInt(b.querySelector('.correctQ').value)||0,
      sectionTime: b.querySelector('.sectionTime').value,
      unattemptedTime: b.querySelector('.unattemptedTime').value,
      overviewImage: b.querySelector('.overviewImageInput') ? b.querySelector('.overviewImageInput')._imgData || null : null
    });
  });
  return tests;
}

// ---------------- AUTO ANALYSIS NOTES (NEET / JEE, based on marks) ----------------
const ANALYSIS_NOTES = {
  neet: {
    physics: {
      excellent: "Physics is a clear strength for NEET, with strong conceptual understanding and analytical ability. Continued practice with higher-order numerical and NEET-pattern questions is recommended to sustain this edge.",
      satisfactory: "Physics shows a fair grasp of concepts for NEET, but consistency needs work. Regular practice with NEET-pattern numericals and revisiting weaker chapters will help raise the score.",
      needsImprovement: "Physics needs focused attention for NEET — core concepts require revision along with daily practice of NCERT-based and NEET-level questions to build both speed and accuracy."
    },
    chemistry: {
      excellent: "Chemistry performance is excellent, reflecting strong retention of NCERT concepts across Physical, Organic and Inorganic sections. Continue reinforcing with NEET-level MCQ practice.",
      satisfactory: "Chemistry shows reasonable understanding but requires more structured revision, especially in Organic and Inorganic reactions, along with regular NCERT-based practice for NEET.",
      needsImprovement: "Chemistry is the highest priority area for improvement. Daily NCERT revision, chapter-wise MCQ practice, and maintaining an error notebook are strongly recommended for NEET."
    },
    biology: {
      excellent: "Biology is a strong area, showing excellent recall of NCERT content — the largest scoring section in NEET. Continue reinforcing with diagram-based and assertion-reason practice.",
      satisfactory: "Biology performance is satisfactory, but since it carries the highest weightage in NEET, more focused NCERT revision and regular practice tests are recommended.",
      needsImprovement: "Biology needs significant improvement — since it is the highest-weightage section in NEET, daily NCERT reading, diagram practice and topic-wise tests are strongly recommended."
    }
  },
  jee: {
    physics: {
      excellent: "Physics is a clear strength for JEE, with strong conceptual clarity and problem-solving speed on multi-concept questions. Continue practicing advanced and JEE Advanced-level problems to sustain this edge.",
      satisfactory: "Physics shows fair conceptual understanding for JEE, but speed and application on tougher, multi-step problems need more practice, particularly in Mechanics and Electrodynamics.",
      needsImprovement: "Physics needs focused attention for JEE — fundamentals require revision along with daily practice of JEE-pattern numericals to build both speed and accuracy."
    },
    chemistry: {
      excellent: "Chemistry performance is excellent for JEE, reflecting strong command over Physical Chemistry numericals along with Organic and Inorganic concepts. Continue with JEE-level mixed practice sets.",
      satisfactory: "Chemistry shows reasonable understanding for JEE but requires more structured revision, especially Physical Chemistry numericals and Organic reaction mechanisms.",
      needsImprovement: "Chemistry is the highest priority area for improvement. Daily concept revision, formula practice in Physical Chemistry, and reaction-based practice are strongly recommended for JEE."
    },
    maths: {
      excellent: "Mathematics is a clear strength for JEE, with strong problem-solving speed and conceptual clarity. Focus on maintaining accuracy on advanced-level and multi-concept problems.",
      satisfactory: "Mathematics shows fair understanding for JEE, but speed and application on JEE-level problems need more practice, especially in Calculus and Coordinate Geometry.",
      needsImprovement: "Mathematics needs focused attention for JEE — daily practice of JEE-pattern problems along with revisiting fundamentals in Algebra, Calculus and Trigonometry is recommended."
    }
  }
};

const THIRD_SUBJECT_CONFIG = {
  neet: {
    subjectKey: 'biology', label: 'Biology', color: '#5B2C87', totalMarks: 15,
    test: { testName: 'Living World Test - 1', sectionName: 'Living world', totalQ: 15 }
  },
  jee: {
    subjectKey: 'maths', label: 'Mathematics', color: '#0F4C81', totalMarks: 100,
    test: { testName: 'Sets, Relations and Functions Test - 1', sectionName: 'Sets and Relations', totalQ: 30 }
  }
};

function tierFor(pct){
  if(pct >= 75) return 'excellent';
  if(pct >= 60) return 'satisfactory';
  return 'needsImprovement';
}

function updateNoteForBlock(block){
  const examType = document.getElementById('examType').value;
  const subjectKey = block.getAttribute('data-subject');
  const scoredEl = block.querySelector('.marksScored');
  const totalEl = block.querySelector('.totalMarks');
  const noteEl = block.querySelector('.analysisNote');
  if(!scoredEl || !totalEl || !noteEl) return;
  const scored = parseFloat(scoredEl.value)||0;
  const total = parseFloat(totalEl.value)||1;
  const pct = total>0 ? (scored/total*100) : 0;
  const tier = tierFor(pct);
  const note = (ANALYSIS_NOTES[examType] && ANALYSIS_NOTES[examType][subjectKey] && ANALYSIS_NOTES[examType][subjectKey][tier]) || noteEl.value;
  noteEl.value = note;
}

function updateAllNotes(){
  document.querySelectorAll('.subject-block[data-subject]').forEach(updateNoteForBlock);
}

function applyExamType(examType){
  const third = THIRD_SUBJECT_CONFIG[examType] || THIRD_SUBJECT_CONFIG.neet;

  const subjBlock = document.querySelector('.subject-block[data-subject-slot="third"]');
  if(subjBlock){
    subjBlock.setAttribute('data-subject', third.subjectKey);
    subjBlock.setAttribute('data-label', third.label);
    subjBlock.querySelector('h3').textContent = third.label;
    subjBlock.querySelector('.cardColor').value = third.color;
    subjBlock.querySelector('.totalMarks').value = third.totalMarks;
  }

  const testBlock = document.querySelector('.subject-block[data-testblock-slot="third"]');
  if(testBlock){
    testBlock.setAttribute('data-testblock', third.subjectKey);
    testBlock.setAttribute('data-label', third.label);
    testBlock.querySelector('h3').textContent = third.label + ' — Test Report';
    testBlock.querySelector('.testName').value = third.test.testName;
    testBlock.querySelector('.sectionName').value = third.test.sectionName;
    testBlock.querySelector('.totalQ').value = third.test.totalQ;
  }

  const subjAssessedEl = document.getElementById('subjectsAssessed');
  if(subjAssessedEl){
    subjAssessedEl.value = examType === 'jee' ? 'Physics, Chemistry & Mathematics' : 'Physics, Chemistry & Biology';
  }

  const purposeEl = document.getElementById('purpose');
  if(purposeEl){
    purposeEl.value = 'Evaluate current academic preparedness and identify areas requiring focused intervention for ' + examType.toUpperCase() + '.';
  }

  document.querySelectorAll('#autofillTarget .opt-neet').forEach(o=> o.style.display = examType==='neet' ? '' : 'none');
  document.querySelectorAll('#autofillTarget .opt-jee').forEach(o=> o.style.display = examType==='jee' ? '' : 'none');
  const autofillSel = document.getElementById('autofillTarget');
  if(autofillSel && ((examType==='jee' && autofillSel.value==='biology') || (examType==='neet' && autofillSel.value==='maths'))){
    autofillSel.value = 'auto';
  }

  updateAllNotes();
}

document.getElementById('examType').addEventListener('change', function(){
  applyExamType(this.value);
});

document.querySelectorAll('.subject-block[data-subject]').forEach(block=>{
  block.querySelector('.marksScored').addEventListener('input', ()=>updateNoteForBlock(block));
  block.querySelector('.totalMarks').addEventListener('input', ()=>updateNoteForBlock(block));
});

applyExamType(document.getElementById('examType').value);

// ---------------- AUTO-FILL FROM SCREENSHOT (OCR) ----------------
function parseReportText(text){
  const clean = text.replace(/\r/g,'');
  const result = {};
  let m;

  m = clean.match(/SUBJECT\s*[:\-]?\s*\n?\s*(Physics|Chemistry|Biology|Mathematics|Maths)/i);
  if(m){
    const raw = m[1].toLowerCase();
    result.subject = (raw === 'mathematics' || raw === 'maths') ? 'maths' : raw;
  }

  m = clean.match(/TEST\s*[:\-]?\s*\n+\s*([^\n]{4,80})/i);
  if(m) result.testName = m[1].trim();

  m = clean.match(/SCORE\s*[:\-]?\s*\n?\s*([\d.]+)\s*\/\s*(\d+)/i);
  if(m){ result.total = parseInt(m[2],10); }

  m = clean.match(/ATTEMPTED\s*[:\-]?\s*\n?\s*(\d+)\s*\/\s*(\d+)/i);
  if(m){ result.attempted = parseInt(m[1],10); result.total = result.total || parseInt(m[2],10); }

  m = clean.match(/CORRECT\s*[:\-]?\s*\n?\s*(\d+)\s*\/\s*(\d+)/i);
  if(m){ result.correct = parseInt(m[1],10); result.total = result.total || parseInt(m[2],10); }

  m = clean.match(/INCORRECT\s*[:\-]?\s*\n?\s*(\d+)\s*\/\s*(\d+)/i);
  if(m){ result.incorrect = parseInt(m[1],10); }

  m = clean.match(/SECTION\s*-?\s*[:\-]?\s*\n?\s*(Section\s*-?\s*\d+|Living\s*world|[A-Za-z][A-Za-z\s]{2,30})\b/i);
  if(m && !/SECTION\s*-?\s*WISE/i.test(m[0])) result.sectionName = m[1].trim();

  const minSecMatches = [...clean.matchAll(/(\d{1,3})\s*Min\s*(\d{1,2})\s*Sec/gi)];
  const colonMatches = [...clean.matchAll(/\b(\d{1,3}):(\d{2})\b/g)];
  if(minSecMatches.length || colonMatches.length){
    // The section's total time is usually the larger value and/or the one
    // appearing later in the document (after the per-question time stat).
    const candidates = [
      ...minSecMatches.map(mm => parseInt(mm[1],10)*60+parseInt(mm[2],10)),
      ...colonMatches.map(mm => parseInt(mm[1],10)*60+parseInt(mm[2],10)),
    ];
    result.sectionTimeSec = Math.max(...candidates);
  }

  if(result.correct != null && result.incorrect != null && result.attempted == null){
    result.attempted = result.correct + result.incorrect;
  }
  if(result.total == null && result.attempted != null){
    result.total = result.attempted;
  }

  return result;
}

function secToMinSecStr(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return m + ':' + String(s).padStart(2,'0');
}

document.getElementById('autofillBtn').addEventListener('click', async function(){
  const fileInput = document.getElementById('autofillImage');
  const targetSel = document.getElementById('autofillTarget').value;
  const statusEl = document.getElementById('autofillStatus');
  const file = fileInput.files && fileInput.files[0];

  if(!file){
    statusEl.textContent = 'Please choose a screenshot first.';
    statusEl.className = 'error';
    return;
  }
  if(typeof Tesseract === 'undefined'){
    statusEl.textContent = 'OCR engine could not load (no internet connection?). Please fill the fields manually.';
    statusEl.className = 'error';
    return;
  }

  this.disabled = true;
  statusEl.className = '';
  statusEl.textContent = 'Reading screenshot… 0%';

  try{
    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: (info)=>{
        if(info.status === 'recognizing text'){
          statusEl.textContent = 'Reading screenshot… ' + Math.round(info.progress*100) + '%';
        } else {
          statusEl.textContent = (info.status || 'Working…');
        }
      }
    });

    const parsed = parseReportText(data.text || '');

    const currentExamType = document.getElementById('examType').value;
    const allowedSubjects = ['physics','chemistry', currentExamType==='jee' ? 'maths' : 'biology'];

    let subjectKey = targetSel;
    if(subjectKey === 'auto'){
      subjectKey = parsed.subject && allowedSubjects.includes(parsed.subject) ? parsed.subject : null;
    }
    if(!subjectKey){
      statusEl.textContent = 'Could not detect the subject automatically — please pick it from the dropdown and try again.';
      statusEl.className = 'error';
      this.disabled = false;
      return;
    }

    const block = document.querySelector(`.subject-block[data-testblock="${subjectKey}"]`);
    if(!block){
      statusEl.textContent = 'Matching subject block not found.';
      statusEl.className = 'error';
      this.disabled = false;
      return;
    }

    const filled = [];
    if(parsed.testName){ block.querySelector('.testName').value = parsed.testName; filled.push('Test name'); }
    if(parsed.sectionName){ block.querySelector('.sectionName').value = parsed.sectionName; filled.push('Section name'); }
    if(parsed.total){ block.querySelector('.totalQ').value = parsed.total; filled.push('Total questions'); }
    if(parsed.attempted != null){ block.querySelector('.attemptedQ').value = parsed.attempted; filled.push('Attempted'); }
    if(parsed.correct != null){ block.querySelector('.correctQ').value = parsed.correct; filled.push('Correct'); }
    if(parsed.sectionTimeSec != null){ block.querySelector('.sectionTime').value = secToMinSecStr(parsed.sectionTimeSec); filled.push('Section time'); }

    block.scrollIntoView({behavior:'smooth', block:'center'});
    block.style.transition = 'box-shadow 0.3s';
    block.style.boxShadow = '0 0 0 3px #C9A227';
    setTimeout(()=>{ block.style.boxShadow = 'none'; }, 2000);

    if(filled.length){
      statusEl.textContent = `Filled into ${subjectKey.charAt(0).toUpperCase()+subjectKey.slice(1)}: ${filled.join(', ')}. Please review the values before generating the report.`;
      statusEl.className = 'success';
    } else {
      statusEl.textContent = 'Could not confidently read the values from this screenshot. Please fill the fields manually.';
      statusEl.className = 'error';
    }
  } catch(err){
    console.error(err);
    statusEl.textContent = 'Something went wrong reading the screenshot. Please try a clearer image or fill manually.';
    statusEl.className = 'error';
  } finally {
    this.disabled = false;
  }
});

document.querySelectorAll('.overviewImageInput').forEach(input=>{
  input.addEventListener('change', function(){
    const file = this.files && this.files[0];
    const wrap = this.closest('.field').querySelector('.img-preview-wrap');
    if(!file){ wrap.innerHTML=''; this._imgData = null; return; }
    const reader = new FileReader();
    reader.onload = (e)=>{
      this._imgData = e.target.result;
      wrap.innerHTML = `<img src="${e.target.result}"><button type="button" class="clear-img-btn">Remove image</button>`;
      wrap.querySelector('.clear-img-btn').addEventListener('click', ()=>{
        input.value = '';
        input._imgData = null;
        wrap.innerHTML = '';
      });
    };
    reader.readAsDataURL(file);
  });
});

let chartInstances = [];

function destroyCharts(){
  chartInstances.forEach(c=>c.destroy());
  chartInstances = [];
}

document.getElementById('reportForm').addEventListener('submit', function(e){
  e.preventDefault();
  destroyCharts();

  const data = {
    studentName: document.getElementById('studentName').value,
    assessmentType: document.getElementById('assessmentType').value,
    subjectsAssessed: document.getElementById('subjectsAssessed').value,
    purpose: document.getElementById('purpose').value,
    execSummary: document.getElementById('execSummary').value,
    subjects: collectSubjects(),
    strengths: document.getElementById('strengths').value.split('\n').map(s=>s.trim()).filter(Boolean),
    attentions: document.getElementById('attentions').value.split('\n').map(s=>s.trim()).filter(Boolean),
    supportPlan: document.getElementById('supportPlan').value,
    overallEval: document.getElementById('overallEval').value
  };

  const tests = collectTests();

  const wrap = document.getElementById('pagesWrap');
  wrap.innerHTML = '';

  const coverHtml = buildCoverPage(data);
  const coverDiv = document.createElement('div');
  coverDiv.innerHTML = coverHtml;
  wrap.appendChild(coverDiv.firstElementChild);
  guardTextSpacing(wrap.lastElementChild);

  const chartDatas = [];
  tests.forEach((t, i)=>{
    const donutId = 'donut_'+i;
    const barId = 'bar_'+i;
    const built = buildPerfPage(t, donutId, barId);
    const div = document.createElement('div');
    div.innerHTML = built.html;
    wrap.appendChild(div.firstElementChild);
    guardTextSpacing(wrap.lastElementChild);
    chartDatas.push({donutId, barId, cd: built.chartData});
  });

  document.getElementById('previewSection').classList.add('show');

  // draw charts after DOM insertion
  requestAnimationFrame(()=>{
    chartDatas.forEach(({donutId, barId, cd})=>{
      try{
        const donutCanvas = document.getElementById(donutId);
        if(donutCanvas){
          const donutCtx = donutCanvas.getContext('2d');
          const total = (cd.correct || 0) + (cd.incorrect || 0) + (cd.unattempted || 0);
          const centerPct = total ? Math.round((cd.correct/total)*100) : 0;
          try{
            chartInstances.push(new Chart(donutCtx, {
              type: 'doughnut',
              data: {
                labels: ['Correct','Wrong','Unattempted'],
                datasets: [{ data: [cd.correct, cd.incorrect, cd.unattempted], backgroundColor: ['#16A34A','#DC2626','#9CA3AF'], borderWidth: 0 }]
              },
              options: {
                responsive: false,
                cutout: '60%',
                plugins: {
                  legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true } },
                  tooltip: { enabled: true, callbacks: { label: (ctx) => { const v = ctx.parsed; const p = total ? (v/total*100).toFixed(1) : '0.0'; return ctx.label + ': ' + v + ' (' + p + '%)'; } } }
                }
              },
              plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                  const ctx = chart.ctx;
                  ctx.save();
                  const x = chart.width / 2;
                  const y = chart.height / 2;
                  ctx.font = 'bold 20px "Segoe UI", Arial';
                  ctx.fillStyle = '#1D4ED8';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(centerPct + '%', x, y);
                  ctx.restore();
                }
              }]
            }));
          }catch(err){
            console.error('Doughnut chart failed, drawing fallback:', err);
            // fallback: draw simple donut-like circle and center text
            try{
              const ctx = donutCanvas.getContext('2d');
              const w = donutCanvas.width, h = donutCanvas.height, cx = w/2, cy = h/2, r = Math.min(w,h)/2 * 0.75;
              ctx.clearRect(0,0,w,h);
              // background ring
              ctx.beginPath(); ctx.fillStyle = '#9CA3AF'; ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
              // correct slice
              const a = (cd.correct||0)/Math.max(1,total) * Math.PI*2;
              ctx.beginPath(); ctx.fillStyle = '#16A34A'; ctx.moveTo(cx,cy); ctx.arc(cx,cy,r, -Math.PI/2, -Math.PI/2 + a); ctx.closePath(); ctx.fill();
              // inner circle to create donut
              ctx.beginPath(); ctx.fillStyle = '#ffffff'; ctx.arc(cx,cy,r*0.6,0,Math.PI*2); ctx.fill();
              // center text
              ctx.font = 'bold 20px "Segoe UI", Arial'; ctx.fillStyle = '#1D4ED8'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(centerPct + '%', cx, cy);
            }catch(e2){ console.error('Fallback draw also failed', e2); }
          }
        }
      }catch(e){ console.error('Error creating donut chart for', donutId, e); }

      try{
        const barEl = document.getElementById(barId);
        if(barEl && barEl.getContext){
          const barCtx = barEl.getContext('2d');
          chartInstances.push(new Chart(barCtx, {
            type:'bar',
            data:{
              labels:[cd.sectionName],
              datasets:[
                {label:'Time utilised (min)', data:[cd.utilisedTimeMin], backgroundColor:'#8FD19E'},
                {label:'Un-attempted (min)', data:[cd.unattemptedTimeMin], backgroundColor:'#F4A6A0'}
              ]
            },
            options:{
              indexAxis:'y',
              responsive:false,
              scales:{ x:{stacked:true, beginAtZero:true, title:{display:true,text:'Time (Minutes)',font:{size:10}}}, y:{stacked:true} },
              plugins:{ legend:{position:'bottom', labels:{font:{size:10}}} }
            }
          }));
        }
      }catch(err){ console.error('Bar chart creation failed for', barId, err); }
    });

    document.getElementById('previewSection').scrollIntoView({behavior:'smooth'});
  });
});

document.getElementById('downloadBtn').addEventListener('click', async function(){
  const statusEl = document.getElementById('pdfStatus');
  const btn = this;
  btn.disabled = true;
  statusEl.textContent = 'Generating PDF…';

  const pages = document.querySelectorAll('#pagesWrap .page');
  const { jsPDF } = window.jspdf;
  let pdf = null;

  if(document.fonts && document.fonts.ready){
    statusEl.textContent = 'Loading fonts…';
    await document.fonts.ready;
  }

  for(let i=0;i<pages.length;i++){
    statusEl.textContent = `Rendering page ${i+1} of ${pages.length}…`;
    const canvas = await html2canvas(pages[i], {scale:3, useCORS:true, backgroundColor:'#ffffff', letterRendering:true});
    const imgData = canvas.toDataURL('image/png');
    const pxW = canvas.width, pxH = canvas.height;
    const pdfWidth = 210; // mm A4
    const pdfHeight = pdfWidth * (pxH/pxW);

    if(!pdf){
      pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:[pdfWidth, pdfHeight] });
    } else {
      pdf.addPage([pdfWidth, pdfHeight], 'portrait');
    }
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  }

  statusEl.textContent = 'Saving…';
  const studentName = document.getElementById('studentName').value.trim().replace(/\s+/g,'_') || 'Report';
  pdf.save(`${studentName}_Lakshya_Report.pdf`);
  statusEl.textContent = 'Done ✓';
  btn.disabled = false;
  setTimeout(()=>{statusEl.textContent='';}, 3000);
});