/**
 * MOLE MASTER - QUIZ ENGINE
 */

const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "H₂SO₄", mr: 98.1 }, { name: "CaCO₃", mr: 100.1 }, 
    { name: "MgO", mr: 40.3 }, { name: "CuSO₄", mr: 159.6 }, { name: "KMnO₄", mr: 158.0 }
];

const ION_SALTS = [
    { salt: "AlCl₃", ion: "Cl⁻", ratio: 3 }, { salt: "Na₂SO₄", ion: "Na⁺", ratio: 2 },
    { salt: "MgCl₂", ion: "Cl⁻", ratio: 2 }, { salt: "K₃PO₄", ion: "K⁺", ratio: 3 }
];

const TOPICS = {
    basic: [
        { id: 'm-mr', title: 'Mass & Mr', desc: 'n = mass / Mr' },
        { id: 'gas', title: 'Gas Volume', desc: 'n = Vol / 24' },
        { id: 'conc', title: 'Concentration', desc: 'n = c × V' }
    ],
    intermediate: [
        { id: 'emp', title: 'Empirical Formula', desc: 'Simplest ratio' },
        { id: 'yield', title: '% Yield & Purity', desc: 'Efficiency' }
    ],
    advanced: [
        { id: 'ions', title: 'Ion Concentration', desc: 'Ratios in salts' },
        { id: 'limit', title: 'Limiting Reagents', desc: 'Reactant ratios' }
    ]
};

let currentTier = 'basic', activeId = null, currentAnswer = null, stats = { points: 0, attempted: 0, correct: 0, streak: 0 };
let quizQuestions = [], quizIndex = 0;

function navigate(e, id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

function setTier(t) {
    currentTier = t;
    document.querySelectorAll('.tier-link').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('topic-grid');
    grid.innerHTML = TOPICS[currentTier].map(t => `
        <div class="topic-card">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <button class="btn-cta" onclick="startPractice('${t.id}', '${t.title}')">Start</button>
        </div>
    `).join('');
}

function startPractice(id, title) {
    activeId = id;
    document.getElementById('topic-header').innerText = title;
    navigate(null, 'practice');
    generateQuestion();
}



function generateQuestion() {
    const box = document.getElementById('question-box');
    let q = "", u = "", type = "number";
    const chem = CHEMICALS[Math.floor(Math.random()*CHEMICALS.length)];

    if (activeId === 'm-mr') {
        const m = (Math.random()*40 + 2).toFixed(1);
        q = `How many moles are in ${m}g of ${chem.name}? (Mr=${chem.mr})`;
        currentAnswer = (m/chem.mr).toFixed(2); u = "mol";
    } else if (activeId === 'gas') {
        const n = (Math.random()*2).toFixed(2);
        q = `What is the volume (dm³) of ${n} mol of gas at RTP?`;
        currentAnswer = (n*24).toFixed(1); u = "dm³";
    } else if (activeId === 'ions') {
        const s = ION_SALTS[Math.floor(Math.random()*ION_SALTS.length)];
        const c = (Math.random()*0.5 + 0.1).toFixed(2);
        q = `Calculate [${s.ion}] in a ${c}M solution of ${s.salt}.`;
        currentAnswer = (c * s.ratio).toFixed(2); u = "mol/dm³";
    }

    box.innerHTML = `
        <h3 style="margin-bottom:15px">${q}</h3>
        <div class="input-row">
            <input type="${type}" id="ans-inp" autofocus placeholder="Answer...">
            <span style="font-weight:bold; color:#a855f7">${u}</span>
        </div>
        <div id="fb" style="height:25px; margin-bottom:15px"></div>
        <button class="btn-cta" onclick="checkAnswer()">Submit Answer</button>
    `;
}

function checkAnswer() {
    const user = document.getElementById('ans-inp').value.trim();
    const fb = document.getElementById('fb');
    const isCorrect = (Math.abs(parseFloat(user) - parseFloat(currentAnswer)) < 0.1);
    
    if(isCorrect) {
        stats.points += 10; stats.streak++; stats.correct++;
        fb.innerHTML = "<span style='color:#22c55e; font-weight:bold'>✅ Correct!</span>";
        setTimeout(generateQuestion, 1200);
    } else {
        stats.streak = 0;
        fb.innerHTML = `<span style='color:#ef4444; font-weight:bold'>❌ Incorrect. Answer: ${currentAnswer}</span>`;
    }
    stats.attempted++;
    updateUI();
}

function updateUI() {
    document.getElementById('points').innerText = stats.points;
    const acc = stats.attempted > 0 ? Math.round((stats.correct/stats.attempted)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// QUIZ MODE LOGIC
async function fetchQuizJSON() {
    const file = document.getElementById('quiz-input').value;
    const path = `./worksheets/${file.endsWith('.json') ? file : file + '.json'}`;
    const status = document.getElementById('quiz-status');

    try {
        const res = await fetch(path);
        if(!res.ok) throw new Error();
        const data = await res.json();
        quizQuestions = data.questions;
        quizIndex = 0;
        status.innerText = "✅ Quiz Loaded!";
        runQuiz();
    } catch(e) {
        status.innerText = "❌ File not found in /worksheets/";
    }
}

function runQuiz() {
    const area = document.getElementById('active-quiz-area');
    area.style.display = 'block';
    const q = quizQuestions[quizIndex];

    area.innerHTML = `
        <h3>Question ${quizIndex + 1} of ${quizQuestions.length}</h3>
        <p style="font-size:1.2rem; margin:15px 0;">${q.question}</p>
        <div class="input-row"><input id="quiz-ans" placeholder="Type answer..."></div>
        <button class="btn-cta" onclick="checkQuizAns()">Next Question</button>
    `;
}

function checkQuizAns() {
    quizIndex++;
    if(quizIndex < quizQuestions.length) runQuiz();
    else document.getElementById('active-quiz-area').innerHTML = "<h2>Quiz Finished! Well done.</h2>";
}

renderGrid();
