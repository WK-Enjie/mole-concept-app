// ==========================================
// 1. DATA & CONSTANTS
// ==========================================
const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "HCl", mr: 36.5 },
    { name: "H₂SO₄", mr: 98 }, { name: "CaCO₃", mr: 100 },
    { name: "MgO", mr: 40 }, { name: "NaCl", mr: 58.5 },
    { name: "CO₂", mr: 44 }, { name: "H₂O", mr: 18 },
    { name: "NH₃", mr: 17 }, { name: "KOH", mr: 56 }
];

const TOPICS = [
    { id: 'mass', title: 'Moles & Mass', desc: 'Convert mass to moles', formula: 'n = m / Mr' },
    { id: 'gas', title: 'Gas Volumes', desc: 'RTP conversions', formula: 'n = V / 24' },
    { id: 'conc', title: 'Concentration', desc: 'Moles in solution', formula: 'n = c × V' },
    { id: 'limit', title: 'Limiting Reagent', desc: 'Reactant ratios', formula: 'Compare moles' },
    { id: 'yield', title: '% Yield & Purity', desc: 'Efficiency calcs', formula: 'Act / Theo' },
    { id: 'empirical', title: 'Empirical Formula', desc: 'Simplest ratio', formula: 'Divide by smallest' },
    { id: 'titration', title: 'Titration', desc: 'Neutralization', formula: 'c₁V₁ = c₂V₂' },
    { id: 'stoich', title: 'Stoichiometry', desc: 'Mole ratios', formula: 'Coefficients' }
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
const state = {
    score: 0,
    streak: 0,
    currentTopic: null,
    currentQ: null, // { answer: 10, unit: 'g', hint: '...', solution: '...' }
    qCount: 0,
    quiz: { data: [], index: 0, score: 0 }
};

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderTopics();
    
    // Navigation Listeners
    document.getElementById('nav-learn').onclick = () => switchTab('learn');
    document.getElementById('nav-random').onclick = () => startPractice('random');
    document.getElementById('nav-quiz').onclick = () => switchTab('quiz');
    
    // Practice Controls
    document.getElementById('btn-exit').onclick = () => switchTab('learn');
    document.getElementById('btn-submit').onclick = checkAnswer;
    document.getElementById('btn-next').onclick = nextQuestion;
    document.getElementById('btn-hint').onclick = showHint;
    
    // Input Enter Key
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Quiz Controls
    document.getElementById('btn-load-json').onclick = loadQuizFile;
    document.getElementById('btn-quiz-submit').onclick = submitQuizAnswer;
}

// ==========================================
// 4. NAVIGATION LOGIC
// ==========================================
function switchTab(tab) {
    // Hide all sections
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (tab === 'learn') {
        document.getElementById('section-learn').classList.remove('hidden');
        document.getElementById('nav-learn').classList.add('active');
    } else if (tab === 'practice') {
        document.getElementById('section-practice').classList.remove('hidden');
        // Nav highlight depends on if random or specific, handled in startPractice
    } else if (tab === 'quiz') {
        document.getElementById('section-quiz').classList.remove('hidden');
        document.getElementById('nav-quiz').classList.add('active');
    }
}

function renderTopics() {
    const grid = document.getElementById('topics-grid');
    grid.innerHTML = TOPICS.map(t => `
        <button class="topic-btn" onclick="startPractice('${t.id}')">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <small>${t.formula}</small>
        </button>
    `).join('');
}

// ==========================================
// 5. PRACTICE LOGIC
// ==========================================
function startPractice(topicId) {
    state.currentTopic = topicId;
    state.qCount = 0;
    
    // UI Updates
    switchTab('practice');
    
    if (topicId === 'random') {
        document.getElementById('practice-mode-title').textContent = "Random Practice";
        document.getElementById('nav-random').classList.add('active');
    } else {
        const t = TOPICS.find(x => x.id === topicId);
        document.getElementById('practice-mode-title').textContent = t.title;
        document.getElementById('nav-learn').classList.add('active'); // Keep Learn highlighted for specific topics
    }

    nextQuestion();
}

function nextQuestion() {
    // Determine Topic (Specific or Random)
    let activeTopic = state.currentTopic;
    if (activeTopic === 'random') {
        const randIndex = Math.floor(Math.random() * TOPICS.length);
        activeTopic = TOPICS[randIndex].id;
    }

    // Generate Question Data
    const qData = generateQuestionData(activeTopic);
    state.currentQ = qData;
    state.qCount++;

    // Update UI
    document.getElementById('q-counter').textContent = state.qCount;
    document.getElementById('question-text').innerHTML = qData.text;
    document.getElementById('unit-label').textContent = qData.unit;
    document.getElementById('hint-text').textContent = qData.hint;
    document.getElementById('solution-text').innerHTML = qData.solution;

    // Reset Inputs/Feedback
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('answer-input').focus();
    
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('feedback').className = 'feedback hidden'; // reset classes
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('solution-box').classList.add('hidden');
    
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-next').disabled = true;
}

function checkAnswer() {
    const input = document.getElementById('answer-input');
    const val = parseFloat(input.value);
    
    if (isNaN(val)) return; // Do nothing if empty

    const correct = state.currentQ.answer;
    const tolerance = Math.max(Math.abs(correct * 0.05), 0.01); // 5% margin
    const isCorrect = Math.abs(val - correct) <= tolerance;

    const fb = document.getElementById('feedback');
    fb.classList.remove('hidden');

    if (isCorrect) {
        state.score += 10 + state.streak;
        state.streak++;
        fb.textContent = `✅ Correct! (+${10 + state.streak} pts)`;
        fb.classList.add('correct');
    } else {
        state.streak = 0;
        fb.innerHTML = `❌ Incorrect. The answer was <b>${correct.toFixed(3)}</b>`;
        fb.classList.add('incorrect');
    }

    // Update Stats
    document.getElementById('score').textContent = state.score;
    document.getElementById('streak').textContent = state.streak;

    // Show Solution & Enable Next
    document.getElementById('solution-box').classList.remove('hidden');
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('answer-input').disabled = true;
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-next').focus();
}

function showHint() {
    document.getElementById('hint-box').classList.remove('hidden');
}

// ==========================================
// 6. QUESTION GENERATORS (The Math)
// ==========================================
function generateQuestionData(topic) {
    const r = (min, max, dec=0) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
    const chem = CHEMICALS[Math.floor(Math.random() * CHEMICALS.length)];

    switch(topic) {
        case 'mass':
            const mass = r(5, 50, 1);
            const moles = mass / chem.mr;
            return {
                text: `Calculate the moles in <b>${mass} g</b> of <b>${chem.name}</b> (Mr = ${chem.mr}).`,
                answer: moles, unit: 'mol', hint: 'n = m / Mr',
                solution: `${mass} / ${chem.mr} = <b>${moles.toFixed(3)} mol</b>`
            };
        case 'gas':
            const vol = r(12, 96, 1);
            const gasMol = vol / 24;
            return {
                text: `Calculate the moles in <b>${vol} dm³</b> of gas at RTP.`,
                answer: gasMol, unit: 'mol', hint: 'n = V / 24',
                solution: `${vol} / 24 = <b>${gasMol.toFixed(3)} mol</b>`
            };
        case 'conc':
            const c = r(0.1, 2.0, 2);
            const v = r(25, 250, 0); // cm3
            const nSol = c * (v/1000);
            return {
                text: `Calculate moles in <b>${v} cm³</b> of <b>${c} mol/dm³</b> solution.`,
                answer: nSol, unit: 'mol', hint: 'n = c × (V/1000)',
                solution: `${c} × (${v}/1000) = <b>${nSol.toFixed(4)} mol</b>`
            };
        case 'limit':
            // Simple: 2A + B -> C. (Ratio 2:1)
            const mA = r(1,5,1); const mB = r(1,5,1);
            const neededB = mA / 2;
            const isALimiting = mB > neededB; // If have enough B, A is limit
            // Question: How much B remains? (or A if B is limit)
            // Let's stick to: "How many moles of excess reactant remain?"
            let excessMol;
            if (isALimiting) {
                // A limits. B is excess. Used B = mA/2.
                excessMol = mB - (mA/2);
            } else {
                // B limits. A is excess. Used A = mB*2.
                excessMol = mA - (mB*2);
            }
            return {
                text: `Reaction: <b>2A + B → C</b>.<br>You have <b>${mA} mol A</b> and <b>${mB} mol B</b>.<br>Calculate moles of excess reactant remaining.`,
                answer: excessMol, unit: 'mol', hint: 'Determine limiting first (Ratio 2:1)',
                solution: `Limiting is ${isALimiting ? 'A' : 'B'}. Excess = <b>${excessMol.toFixed(2)} mol</b>`
            };
        case 'yield':
            const theo = r(10, 50, 1);
            const act = r(theo*0.5, theo*0.9, 1);
            const yieldVal = (act/theo)*100;
            return {
                text: `Theoretical Yield: <b>${theo} g</b>.<br>Actual Yield: <b>${act} g</b>.<br>Calculate % Yield.`,
                answer: yieldVal, unit: '%', hint: '(Actual/Theo) * 100',
                solution: `(${act}/${theo}) × 100 = <b>${yieldVal.toFixed(1)}%</b>`
            };
        case 'empirical':
            // Reverse engineer: CHx
            const x = Math.floor(Math.random()*3)+1; // 1 to 3
            const mrE = 12 + x;
            const pC = (12/mrE)*100;
            const pH = (x/mrE)*100;
            return {
                text: `Hydrocarbon: <b>${pC.toFixed(1)}% C</b> and <b>${pH.toFixed(1)}% H</b>.<br>Find <b>x</b> in CHₓ.`,
                answer: x, unit: '', hint: 'Divide % by Ar (C=12, H=1)',
                solution: `Ratio C:H is 1:${x}. x = <b>${x}</b>`
            };
        case 'titration':
            // c1v1 = c2v2
            const c1 = r(0.1, 0.5, 2); const v1 = r(20, 30, 1); const v2 = r(20, 35, 1);
            const c2 = (c1*v1)/v2;
            return {
                text: `<b>${v1} cm³</b> of <b>${c1} M HCl</b> neutralizes <b>${v2} cm³</b> NaOH.<br>Find [NaOH].`,
                answer: c2, unit: 'mol/dm³', hint: 'c₁V₁ = c₂V₂',
                solution: `(${c1}×${v1}) / ${v2} = <b>${c2.toFixed(3)} M</b>`
            };
        case 'stoich':
            // N2 + 3H2 -> 2NH3. 
            const nN2 = r(0.5, 3, 1);
            const nNH3 = nN2 * 2;
            return {
                text: `Reaction: <b>N₂ + 3H₂ → 2NH₃</b>.<br>If <b>${nN2} mol N₂</b> reacts, how much NH₃ forms?`,
                answer: nNH3, unit: 'mol', hint: 'Mole ratio 1:2',
                solution: `${nN2} × 2 = <b>${nNH3.toFixed(1)} mol</b>`
            };
        default:
            return { text: 'Error', answer: 0, unit: '', hint: '', solution: '' };
    }
}

// ==========================================
// 7. QUIZ LOGIC
// ==========================================
async function loadQuizFile() {
    const filename = document.getElementById('quiz-filename').value;
    const status = document.getElementById('quiz-status');
    const ui = document.getElementById('quiz-interface');

    if (!filename) {
        status.textContent = "⚠️ Please enter a filename.";
        status.style.color = "orange";
        return;
    }

    try {
        // Attempt fetch
        const response = await fetch(`./worksheets/${filename}.json`);
        
        if (!response.ok) throw new Error("File not found or CORS error (use Live Server)");
        
        const data = await response.json();
        state.quiz.data = data.questions || [];
        
        if (state.quiz.data.length === 0) throw new Error("No questions in file");

        // Success
        status.textContent = `✅ Loaded ${state.quiz.data.length} questions.`;
        status.style.color = "#4ade80"; // Green
        ui.classList.remove('hidden');
        
        startQuiz();

    } catch (err) {
        status.innerHTML = `❌ Error: ${err.message}<br><small>Note: For local files, open this folder in VS Code and use "Live Server".</small>`;
        status.style.color = "#ef4444"; // Red
        ui.classList.add('hidden');
    }
}

function startQuiz() {
    state.quiz.index = 0;
    state.quiz.score = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = state.quiz.data[state.quiz.index];
    const total = state.quiz.data.length;
    
    document.getElementById('quiz-q-num').textContent = state.quiz.index + 1;
    document.getElementById('quiz-total').textContent = total;
    
    // Progress bar
    const pct = ((state.quiz.index) / total) * 100;
    document.getElementById('quiz-progress-fill').style.width = pct + "%";

    document.getElementById('quiz-q-text').textContent = q.question;
    document.getElementById('quiz-unit').textContent = q.unit || '';
    
    // Reset inputs
    document.getElementById('quiz-input').value = '';
    document.getElementById('quiz-input').disabled = false;
    document.getElementById('quiz-feedback').classList.add('hidden');
    
    const btn = document.getElementById('btn-quiz-submit');
    btn.textContent = "Submit";
    btn.disabled = false;
}

function submitQuizAnswer() {
    const input = document.getElementById('quiz-input');
    const val = parseFloat(input.value);
    
    if (isNaN(val)) return;

    const currentQ = state.quiz.data[state.quiz.index];
    const correct = parseFloat(currentQ.answer);
    const isCorrect = Math.abs(val - correct) <= (correct * 0.05 + 0.01);

    const fb = document.getElementById('quiz-feedback');
    fb.classList.remove('hidden');
    
    if (isCorrect) {
        fb.textContent = "✅ Correct";
        fb.className = "feedback correct";
        state.quiz.score++;
    } else {
        fb.textContent = `❌ Incorrect (Ans: ${correct})`;
        fb.className = "feedback incorrect";
    }

    document.getElementById('btn-quiz-submit').disabled = true;
    input.disabled = true;

    // Next question delay
    setTimeout(() => {
        state.quiz.index++;
        if (state.quiz.index < state.quiz.data.length) {
            renderQuizQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

function finishQuiz() {
    const ui = document.getElementById('quiz-interface');
    ui.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <h3>Quiz Complete!</h3>
            <p style="font-size: 1.5rem; margin: 15px 0;">Score: ${state.quiz.score} / ${state.quiz.data.length}</p>
            <button class="btn-primary" onclick="location.reload()">Return to Menu</button>
        </div>
    `;
    document.getElementById('quiz-progress-fill').style.width = "100%";
}
