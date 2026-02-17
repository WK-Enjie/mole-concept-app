const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "HCl", mr: 36.5 }, { name: "H₂SO₄", mr: 98 }, { name: "CaCO₃", mr: 100 }
];

const TOPICS_DATA = {
    basic: [
        { id: 'mass', title: 'Mass & Mr', desc: 'n = m / Mr' },
        { id: 'gas', title: 'Gas Volume', desc: 'n = V / 24' }
    ],
    intermediate: [
        { id: 'yield', title: '% Yield', desc: 'Efficiency' },
        { id: 'emp', title: 'Empirical', desc: 'Ratios' }
    ],
    advanced: [
        { id: 'titrate', title: 'Titration', desc: 'Neutralization' },
        { id: 'redox', title: 'Redox', desc: 'Oxidation States' }
    ]
};

let currentAns = null;
let stats = { pts: 0, tries: 0, hits: 0 };
let quizQs = [], quizIdx = 0;

// 1. Tab Navigation
function showPanel(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(panelId).classList.add('active');
    
    // Highlight correct button
    if(panelId === 'learn-section') document.getElementById('nav-learn').classList.add('active');
    if(panelId === 'practice-section') document.getElementById('nav-practice').classList.add('active');
    if(panelId === 'quiz-section') document.getElementById('nav-quiz').classList.add('active');
}

// 2. Learning Hub Logic
function updateTier(tier) {
    document.querySelectorAll('.tier-link').forEach(l => l.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('learning-grid');
    grid.innerHTML = TOPICS_DATA[tier].map(t => `
        <div class="interactive-card">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <button class="btn-primary" onclick="startSpecificPractice('${t.id}')">Practice This</button>
        </div>
    `).join('');
}

function startSpecificPractice(id) {
    showPanel('practice-section');
    generateLogic(id);
}

// 3. Question Logic
function generateMegaRandomQuestion() {
    const ids = ['mass', 'gas', 'titrate', 'redox'];
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    generateLogic(randomId);
}



function generateLogic(id) {
    const display = document.getElementById('practice-box-content');
    let q = ""; let unit = ""; let isText = false;
    const chem = CHEMICALS[Math.floor(Math.random()*CHEMICALS.length)];

    if(id === 'titrate') {
        const v2 = (Math.random()*10 + 20).toFixed(1);
        q = `25cm³ of 0.1M HCl neutralizes ${v2}cm³ of NaOH. Find [NaOH].`;
        currentAns = (2.5 / v2).toFixed(3); unit = "M";
    } else if(id === 'redox') {
        q = `Oxidation state of Mn in MnO₄⁻?`;
        currentAns = "+7"; unit = ""; isText = true;
    } else if(id === 'gas') {
        const v = (Math.random()*12 + 1).toFixed(1);
        q = `Moles in ${v}dm³ of gas at RTP?`;
        currentAns = (v/24).toFixed(2); unit = "mol";
    } else {
        const m = (Math.random()*20 + 2).toFixed(1);
        q = `Moles in ${m}g of ${chem.name} (Mr=${chem.mr})?`;
        currentAns = (m/chem.mr).toFixed(2); unit = "mol";
    }

    display.innerHTML = `
        <p style="font-size:1.1rem; margin-bottom:10px;">${q}</p>
        <div class="input-row">
            <input type="${isText?'text':'number'}" id="user-input-ans">
            <span style="color:#a855f7; font-weight:bold">${unit}</span>
        </div>
        <div id="feedback-msg" style="height:20px; margin-bottom:10px;"></div>
        <button class="btn-primary" onclick="checkAnswer('${id}')">Submit Answer</button>
    `;
}



function checkAnswer(id) {
    const userVal = document.getElementById('user-input-ans').value.trim();
    const fb = document.getElementById('feedback-msg');
    let isCorrect = (userVal == currentAns || Math.abs(userVal - currentAns) < 0.02);

    stats.tries++;
    if(isCorrect) {
        stats.pts += 10; stats.hits++;
        fb.innerHTML = "<span style='color:green'>✅ Correct!</span>";
        setTimeout(() => generateLogic(id), 1000);
    } else {
        fb.innerHTML = `<span style='color:red'>❌ Wrong. Answer: ${currentAns}</span>`;
    }
    updateStats();
}

function updateStats() {
    document.getElementById('points').innerText = stats.pts;
    const acc = stats.tries ? Math.round((stats.hits/stats.tries)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// 4. Quiz Logic
async function fetchQuizJSON() {
    const filename = document.getElementById('quiz-file-input').value;
    const status = document.getElementById('quiz-status-msg');
    try {
        const res = await fetch(`./worksheets/${filename}.json`);
        const data = await res.json();
        quizQs = data.questions; quizIdx = 0;
        status.innerText = "✅ Quiz Loaded Successfully";
        renderQuizStep();
    } catch(e) { status.innerText = "❌ File not found in /worksheets/"; }
}

function renderQuizStep() {
    const area = document.getElementById('active-quiz-area');
    area.style.display = 'block';
    const q = quizQs[quizIdx];
    area.innerHTML = `
        <p><b>Question ${quizIdx+1}:</b> ${q.question}</p>
        <input id="q-ans-input" class="btn-primary" style="background:#000; text-align:left; cursor:text;">
        <button class="btn-primary" onclick="nextQuizStep()">Next Question</button>
    `;
}

function nextQuizStep() {
    quizIdx++;
    if(quizIdx < quizQs.length) renderQuizStep();
    else document.getElementById('active-quiz-area').innerHTML = "<h3>Quiz Complete!</h3>";
}

// Initialize
updateTier('advanced');
