/**
 * MOLE MASTER - ADVANCED LOGIC
 */

const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "H₂SO₄", mr: 98.1 }, { name: "CaCO₃", mr: 100.1 }, 
    { name: "MgO", mr: 40.3 }, { name: "HCl", mr: 36.5 }, { name: "CuSO₄", mr: 159.6 }
];

const ION_POOL = [
    { salt: "AlCl₃", ion: "Cl⁻", ratio: 3 }, { salt: "Na₂SO₄", ion: "Na⁺", ratio: 2 },
    { salt: "Mg(NO₃)₂", ion: "NO₃⁻", ratio: 2 }, { salt: "K₂CO₃", ion: "K⁺", ratio: 2 }
];

const TOPICS = {
    basic: [{ id: 'm-mr', title: 'Mass & Mr', desc: 'n = m / Mr' }, { id: 'gas', title: 'Gas Vol', desc: 'n = V / 24' }],
    intermediate: [{ id: 'emp', title: 'Empirical', desc: 'Ratio finding' }, { id: 'yield', title: '% Yield', desc: 'Actual/Theo' }],
    advanced: [{ id: 'ions', title: 'Ions', desc: 'Molar ratios' }]
};

let currentTier = 'basic', currentAnswer = null, stats = { points: 0, correct: 0, total: 0 };
let quizData = [], quizIdx = 0;

// NAV
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
            <button class="btn-cta" onclick="startLearn('${t.id}')">Practice This</button>
        </div>
    `).join('');
}

// LEARNING HUB (Specific)
function startLearn(id) {
    navigate(null, 'practice');
    generateLogic(id, 'random-question-box');
}

// RANDOM PRACTICE (Mixed)
function generateMegaRandomQuestion() {
    const allIds = ['m-mr', 'gas', 'emp', 'yield', 'ions'];
    const randomId = allIds[Math.floor(Math.random() * allIds.length)];
    generateLogic(randomId, 'random-question-box');
}



function generateLogic(id, targetBoxId) {
    const box = document.getElementById(targetBoxId);
    let q = "", u = "";
    const chem = CHEMICALS[Math.floor(Math.random()*CHEMICALS.length)];

    if (id === 'm-mr') {
        const m = (Math.random()*20 + 5).toFixed(1);
        q = `Find moles in ${m}g of ${chem.name} (Mr: ${chem.mr})`;
        currentAnswer = (m/chem.mr).toFixed(2); u = "mol";
    } else if (id === 'gas') {
        const v = (Math.random()*48 + 1).toFixed(1);
        q = `Find moles in ${v}dm³ of gas at RTP.`;
        currentAnswer = (v/24).toFixed(2); u = "mol";
    } else if (id === 'ions') {
        const s = ION_POOL[Math.floor(Math.random()*ION_POOL.length)];
        const c = (Math.random()*0.5 + 0.1).toFixed(2);
        q = `Concentration of ${s.ion} in ${c}M ${s.salt}?`;
        currentAnswer = (c * s.ratio).toFixed(2); u = "M";
    } else {
        q = "Calculate % Yield: Theo=10g, Actual=8g";
        currentAnswer = "80"; u = "%";
    }

    box.innerHTML = `<h3>${q}</h3>
        <div class="input-row"><input type="number" id="ans-inp"><span style="color:#a855f7">${u}</span></div>
        <div id="fb" style="margin-bottom:10px"></div>
        <button class="btn-cta" onclick="checkAnswer('${targetBoxId}')">Check Answer</button>`;
}

function checkAnswer(boxId) {
    const user = document.getElementById('ans-inp').value;
    const isCorrect = (Math.abs(parseFloat(user) - parseFloat(currentAnswer)) < 0.1);
    const fb = document.getElementById('fb');
    
    if(isCorrect) {
        fb.innerHTML = "<b style='color:#22c55e'>Correct!</b>";
        stats.points += 10; stats.correct++;
        setTimeout(() => {
            if(boxId === 'random-question-box') generateMegaRandomQuestion();
        }, 1200);
    } else {
        fb.innerHTML = `<b style='color:#ef4444'>Incorrect. Answer: ${currentAnswer}</b>`;
    }
    stats.total++;
    updateStats();
}

function updateStats() {
    document.getElementById('points').innerText = stats.points;
    const acc = stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// QUIZ ENGINE
async function fetchQuizJSON() {
    const file = document.getElementById('quiz-input').value;
    try {
        const res = await fetch(`./worksheets/${file}.json`);
        const data = await res.json();
        quizData = data.questions; quizIdx = 0;
        document.getElementById('quiz-status').innerText = "Quiz Loaded!";
        renderQuiz();
    } catch(e) { document.getElementById('quiz-status').innerText = "File not found!"; }
}

function renderQuiz() {
    const area = document.getElementById('active-quiz-area');
    area.style.display = 'block';
    const q = quizData[quizIdx];
    area.innerHTML = `<h3>Quiz: ${q.question}</h3>
        <div class="input-row"><input id="q-ans"></div>
        <button class="btn-cta" onclick="nextQuiz()">Next Question</button>`;
}

function nextQuiz() {
    quizIdx++;
    if(quizIdx < quizData.length) renderQuiz();
    else document.getElementById('active-quiz-area').innerHTML = "<h2>Quiz Completed!</h2>";
}

renderGrid();
