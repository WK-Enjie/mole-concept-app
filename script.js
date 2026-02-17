// --- DATA & CONFIG ---
const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "H₂SO₄", mr: 98 }, 
    { name: "CaCO₃", mr: 100 }, { name: "HCl", mr: 36.5 },
    { name: "CO₂", mr: 44 }, { name: "MgO", mr: 40.3 }
];

// The 8 requested concepts
const CONCEPTS = [
    { id: 'mass', title: '1. Moles & Mass', desc: 'n = m / Mr' },
    { id: 'gas', title: '2. Gas Volume', desc: 'n = Vol / 24 (RTP)' },
    { id: 'conc', title: '3. Concentration', desc: 'n = c × V' },
    { id: 'limit', title: '4. Limiting & Excess', desc: 'Reactant Ratios' },
    { id: 'purity', title: '5. % Purity & Yield', desc: '(Actual / Theo) × 100' },
    { id: 'emp', title: '6. Empirical Formula', desc: 'Simplest Ratios' },
    { id: 'titrate', title: '7. Titration', desc: 'C₁V₁ = C₂V₂' },
    { id: 'ionic', title: '8. Ionic Mole Ratio', desc: 'Stoichiometry' }
];

let state = {
    score: 0,
    total: 0,
    hits: 0,
    currentAns: 0,
    activeMode: 'mass', // Default
    quizData: [],
    quizIdx: 0
};

// --- INITIALIZATION ---
window.onload = function() {
    renderTopics();
};

function renderTopics() {
    const grid = document.getElementById('topics-container');
    grid.innerHTML = CONCEPTS.map(c => `
        <button class="topic-btn" onclick="startPractice('${c.id}', '${c.title}')">
            <h4>${c.title}</h4>
            <small>${c.desc}</small>
        </button>
    `).join('');
}

// --- NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    
    // Highlight correct nav button
    const btns = document.querySelectorAll('.nav-btn');
    if(tabId === 'learn') btns[0].classList.add('active');
    if(tabId === 'practice') {
        btns[1].classList.add('active');
        startPractice('random', 'Randomized Practice');
    }
    if(tabId === 'quiz') btns[2].classList.add('active');
}

function startPractice(mode, title) {
    // If coming from learning hub, switch tab
    if (mode !== 'random') {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.getElementById('practice').classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-btn')[0].classList.add('active'); // Keep 'Learn' highlighted
    }
    
    document.getElementById('mode-title').innerText = title;
    state.activeMode = mode;
    nextQuestion();
}

// --- QUESTION ENGINE (The Core Logic) ---
function nextQuestion() {
    // Reset UI
    document.getElementById('user-input').value = '';
    document.getElementById('feedback-area').innerHTML = '';
    
    let mode = state.activeMode;
    // If random, pick one of the 8 IDs
    if (mode === 'random') {
        const keys = CONCEPTS.map(c => c.id);
        mode = keys[Math.floor(Math.random() * keys.length)];
    }

    const chem = CHEMICALS[Math.floor(Math.random() * CHEMICALS.length)];
    let q = "", ans = 0, unit = "";

    // 1. Mass
    if (mode === 'mass') {
        const m = (Math.random() * 20 + 1).toFixed(1);
        q = `Calculate moles in <b>${m}g</b> of <b>${chem.name}</b> (Mr = ${chem.mr}).`;
        ans = m / chem.mr;
        unit = "mol";
    }
    // 2. Gas Volume (RTP)
    else if (mode === 'gas') {
        const v = (Math.random() * 48 + 2).toFixed(1);
        q = `Find moles in <b>${v} dm³</b> of gas at RTP (24 dm³/mol).`;
        ans = v / 24;
        unit = "mol";
    }
    // 3. Concentration
    else if (mode === 'conc') {
        const vol = (Math.random() * 200 + 50).toFixed(0); // cm3
        const conc = (Math.random() * 1 + 0.1).toFixed(2); // mol/dm3
        q = `Moles in <b>${vol} cm³</b> of <b>${conc} mol/dm³</b> solution?`;
        ans = (conc * vol) / 1000;
        unit = "mol";
    }
    // 4. Limiting & Excess
    else if (mode === 'limit') {
        // Scenario: 2H2 + O2 -> 2H2O (Ratio 2:1)
        q = `Reaction: <b>2H₂ + O₂ → 2H₂O</b>.<br>You have <b>4.0 mol H₂</b> and <b>3.0 mol O₂</b>.<br>How many moles of O₂ remain in excess?`;
        ans = 1.0; // 4mol H2 uses 2mol O2. 3 - 2 = 1.
        unit = "mol";
    }
    // 5. % Purity & Yield
    else if (mode === 'purity') {
        const theo = 10;
        const actual = (Math.random() * 4 + 5).toFixed(1); // between 5 and 9
        q = `Theoretical yield is <b>${theo}g</b>. Actual yield obtained is <b>${actual}g</b>.<br>Calculate percentage yield.`;
        ans = (actual / theo) * 100;
        unit = "%";
    }
    // 6. Empirical Formula
    else if (mode === 'emp') {
        q = `A hydrocarbon contains <b>80% Carbon</b> and <b>20% Hydrogen</b> by mass.<br>Find 'x' in the formula <b>CHₓ</b>.`;
        // C=12, H=1. 80/12 = 6.66. 20/1 = 20. Ratio 1:3.
        ans = 3; 
        unit = "x";
    }
    // 7. Titration
    else if (mode === 'titrate') {
        // C1V1 = C2V2
        const v1 = 25, c1 = 0.1;
        const v2 = (Math.random() * 10 + 15).toFixed(1);
        q = `<b>${v1} cm³</b> of <b>${c1}M HCl</b> neutralizes <b>${v2} cm³</b> of NaOH.<br>Calculate [NaOH].`;
        ans = (c1 * v1) / v2;
        unit = "M";
    }
    // 8. Ionic Mole Ratio
    else {
        // MnO4 + 5Fe2+ -> ...
        const moles = (Math.random() * 0.5 + 0.1).toFixed(2);
        q = `Equation: <b>MnO₄⁻ + 5Fe²⁺ → Mn²⁺ + ...</b><br>If you react <b>${moles} mol</b> of MnO₄⁻, how many moles of Fe²⁺ are required?`;
        ans = moles * 5;
        unit = "mol";
    }

    document.getElementById('q-text').innerHTML = q;
    document.getElementById('unit-display').innerText = unit;
    state.currentAns = ans;
}

function checkAnswer() {
    const userVal = parseFloat(document.getElementById('user-input').value);
    const correctVal = parseFloat(state.currentAns);
    const fb = document.getElementById('feedback-area');

    if (isNaN(userVal)) {
        fb.innerHTML = "<span style='color:#facc15'>⚠ Please enter a number</span>";
        return;
    }

    // 5% margin of error
    const margin = Math.max(0.05, correctVal * 0.05);
    const isCorrect = Math.abs(userVal - correctVal) <= margin;

    state.total++;
    if (isCorrect) {
        state.score += 10;
        state.hits++;
        fb.innerHTML = "<span style='color:#4ade80'>✅ Correct! Good job.</span>";
    } else {
        fb.innerHTML = `<span style='color:#f87171'>❌ Incorrect. Answer: ${correctVal.toFixed(3)}</span>`;
    }
    
    updateStats();
}

function updateStats() {
    document.getElementById('score').innerText = state.score;
    const acc = state.total === 0 ? 0 : Math.round((state.hits / state.total) * 100);
    document.getElementById('accuracy').innerText = acc + "%";
}

// --- QUIZ FILE LOADER ---
async function loadQuiz() {
    const filename = document.getElementById('quiz-filename').value;
    const status = document.getElementById('quiz-status');

    if (!filename) {
        status.innerText = "⚠ Please type a filename first.";
        return;
    }

    try {
        // Assumes file is in a 'worksheets' folder at the root
        const path = `./worksheets/${filename.endsWith('.json') ? filename : filename + '.json'}`;
        const res = await fetch(path);
        
        if (!res.ok) throw new Error("File not found");

        const data = await res.json();
        state.quizData = data.questions || [];
        state.quizIdx = 0;

        if (state.quizData.length === 0) throw new Error("No questions in file");

        status.innerText = "✅ Loaded successfully!";
        status.style.color = "#4ade80";
        document.getElementById('quiz-display').style.display = 'block';
        showQuizQuestion();

    } catch (e) {
        status.innerText = `❌ Error: ${e.message}`;
        status.style.color = "#f87171";
    }
}

function showQuizQuestion() {
    if (state.quizIdx >= state.quizData.length) {
        document.getElementById('quiz-q-text').innerHTML = "<b>Quiz Complete!</b>";
        document.getElementById('quiz-input').style.display = "none";
        return;
    }
    
    const q = state.quizData[state.quizIdx];
    document.getElementById('quiz-q-num').innerText = `Question ${state.quizIdx + 1}`;
    document.getElementById('quiz-q-text').innerText = q.question;
    document.getElementById('quiz-input').value = "";
    document.getElementById('quiz-input').style.display = "block";
}

function nextQuizQuestion() {
    state.quizIdx++;
    showQuizQuestion();
}
