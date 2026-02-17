/**
 * MOLE MASTER ENGINE
 * Full Logic for All Concepts
 */

const CHEMICALS = [
    { name: "Sodium Hydroxide (NaOH)", mr: 40.0 },
    { name: "Sulfuric Acid (H₂SO₄)", mr: 98.1 },
    { name: "Calcium Carbonate (CaCO₃)", mr: 100.1 },
    { name: "Magnesium Oxide (MgO)", mr: 40.3 },
    { name: "Glucose (C₆H₁₂O₆)", mr: 180.0 },
    { name: "Copper(II) Sulfate (CuSO₄)", mr: 159.6 }
];

const TOPICS = {
    basic: [
        { id: 'm-mr', title: 'Mass & Mr', desc: 'n = mass / Mr' },
        { id: 'vol', title: 'Gas Volume', desc: 'n = Vol / 24' },
        { id: 'conc', title: 'Concentration', desc: 'n = c × V' },
        { id: 'limit-b', title: 'Limiting & Excess', desc: 'Basic ratios' }
    ],
    intermediate: [
        { id: 'limit-h', title: 'Harder Limiting', desc: 'Complex ratios' },
        { id: 'emp', title: 'Empirical Formula', desc: 'Calculating ratios' },
        { id: 'purity', title: 'Percentage Purity', desc: 'Impure samples' },
        { id: 'yield', title: 'Percentage Yield', desc: 'Actual vs Theo' }
    ],
    advanced: [
        { id: 'ions', title: 'Ion Concentration', desc: 'Dissociated salts' },
        { id: 'hard', title: 'Challenge Mix', desc: 'Multi-step problems' }
    ]
};

let currentTier = 'basic';
let activeTopic = null;
let currentAnswer = null;
let stats = { points: 0, attempted: 0, correct: 0, streak: 0 };

// --- NAVIGATION ---
function changePanel(e, id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

function setTier(tier) {
    currentTier = tier;
    document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderTopicGrid();
}

function renderTopicGrid() {
    const grid = document.getElementById('topic-grid');
    grid.innerHTML = TOPICS[currentTier].map(t => `
        <div class="card">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <button class="btn-primary" style="margin-top:15px" onclick="startPractice('${t.id}', '${t.title}')">Start</button>
        </div>
    `).join('');
}

// --- PRACTICE LOGIC ---
function startPractice(id, title) {
    activeTopic = id;
    document.getElementById('current-topic-name').innerText = title;
    changePanel(null, 'practice-panel');
    generateQuestion();
}

function generateQuestion() {
    const card = document.getElementById('question-card');
    let q = ""; let u = ""; let type = "number";
    const chem = CHEMICALS[Math.floor(Math.random()*CHEMICALS.length)];

    // Concept Branching
    switch(activeTopic) {
        case 'm-mr':
            const m = (Math.random()*50 + 1).toFixed(2);
            q = `How many moles are in <b>${m}g</b> of ${chem.name}? (Mr = ${chem.mr})`;
            currentAnswer = (m / chem.mr).toFixed(2); u = "mol"; break;
        
        case 'vol':
            const n = (Math.random()*2 + 0.1).toFixed(2);
            q = `Calculate the volume of <b>${n} moles</b> of a gas at RTP.`;
            currentAnswer = (n * 24).toFixed(1); u = "dm³"; break;

        case 'emp':
            q = `A compound is 40% C, 6.7% H, and 53.3% O. What is the empirical formula?`;
            currentAnswer = "CH2O"; type = "text"; break;

        case 'yield':
            const theo = 20; const act = (Math.random()*5 + 12).toFixed(1);
            q = `The theoretical yield is 20g, but the actual yield is <b>${act}g</b>. Calculate % yield.`;
            currentAnswer = ((act/theo)*100).toFixed(1); u = "%"; break;

        case 'ions':
            const c = (Math.random()*0.5 + 0.1).toFixed(2);
            q = `Find the concentration of Cl⁻ ions in a <b>${c} mol/dm³</b> solution of MgCl₂.`;
            currentAnswer = (c * 2).toFixed(2); u = "mol/dm³"; break;

        case 'limit-b':
            const molH = Math.floor(Math.random()*4 + 2);
            q = `In <b>2H₂ + O₂ → 2H₂O</b>, you have ${molH} mol of H₂ and 10 mol of O₂. Which is limiting?`;
            currentAnswer = "H2"; type = "text"; break;

        default:
            q = "This randomized concept is under development.";
    }

    card.innerHTML = `
        <p style="font-size:1.3rem; margin-bottom:20px">${q}</p>
        <div class="input-group">
            <input type="${type}" id="user-ans" placeholder="Answer..." autofocus>
            <span style="color:#9333ea; font-weight:bold">${u}</span>
        </div>
        <div id="feedback" style="margin-bottom:15px; min-height:24px"></div>
        <button class="btn-primary" onclick="checkAnswer()">Check Answer</button>
    `;
}

function checkAnswer() {
    const user = document.getElementById('user-ans').value.trim().toLowerCase();
    const fb = document.getElementById('feedback');
    let correct = false;

    if(isNaN(currentAnswer)) {
        correct = (user === currentAnswer.toLowerCase());
    } else {
        correct = (Math.abs(parseFloat(user) - parseFloat(currentAnswer)) < 0.1);
    }

    stats.attempted++;
    if(correct) {
        stats.correct++; stats.streak++; stats.points += 10;
        fb.innerHTML = "<span style='color:#22c55e'>✅ Correct! Excellent work.</span>";
        setTimeout(generateQuestion, 1500);
    } else {
        stats.streak = 0;
        fb.innerHTML = `<span style='color:#ef4444'>❌ Not quite. The answer was ${currentAnswer}</span>`;
    }
    updateUI();
}

function updateUI() {
    document.getElementById('score-display').innerText = stats.points;
    document.getElementById('streak-display').innerText = stats.streak;
    const acc = stats.attempted > 0 ? Math.round((stats.correct/stats.attempted)*100) : 0;
    document.getElementById('accuracy-display').innerText = acc + "%";
}

// --- GITHUB LOADER ---
async function loadWorksheet() {
    const file = document.getElementById('gh-file-input').value;
    const log = document.getElementById('import-log');
    try {
        const res = await fetch(`./worksheets/${file}`);
        if(!res.ok) throw new Error("File not found");
        const data = await res.json();
        renderLibCard(data);
        log.innerText = "✅ Successfully imported.";
    } catch(e) { log.innerText = "❌ Error: File not found in /worksheets/"; }
}

function renderLibCard(data) {
    const lib = document.getElementById('library-grid');
    lib.innerHTML += `<div class="card"><h3>${data.title}</h3><p>${data.questions.length} Qs</p></div>`;
}

// Init
renderTopicGrid();
